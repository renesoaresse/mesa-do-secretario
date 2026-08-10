# Build e Distribuição

Este documento descreve como compilar o Mesa do Secretário e gerar instaladores para Windows e macOS.

---

## Visão Geral do Build

O processo de _build_ do Mesa do Secretário é dividido em duas partes:

| Parte        | Comando                     | Saída               |
| ------------ | --------------------------- | ------------------- |
| **Web**      | `yarn build:web` (via Vite) | `dist/`             |
| **Electron** | `yarn build:electron`       | `dist-electron/`    |
| **Completo** | `yarn build`                | Ambos os anteriores |

### Build Web (Vite)

O _build_ web gera uma versão otimizada da aplicação React:

```bash
yarn build:web
```

Saída em `dist/`:

- Arquivos HTML, CSS e JavaScript minificados
- Assets otimizados
- Código _bundle_ para produção

### Build Electron

O _build_ do Electron compila o TypeScript do processo principal:

```bash
yarn build:electron
# Equivalente a:
yarn electron:tsc
```

Saída em `dist-electron/`:

- `main.js` — Processo principal compilado
- `preload.js` — Script de preload compilado

### Build Completo

Para gerar os artefatos para distribuição:

```bash
yarn build
```

Este comando executa sequencialmente:

1. `yarn clean` — Remove `dist/`, `dist-electron/`, `release/`
2. `yarn build:web` — Gera artefatos web
3. `yarn build:electron` — Compila TypeScript do Electron

---

## Desenvolvimento Desktop

Para testar a aplicação em modo _desktop_:

```bash
yarn electron:dev
```

Este comando executa em paralelo:

1. Servidor Vite na porta 5173
2. Processo principal do Electron com _hot reload_

---

## Distribuição

### Windows (NSIS)

Para gerar um instalador Windows (.exe):

```bash
yarn dist:win
```

O instalador é gerado em `release/` com o nome:

```
mesa-do-secretario-setup-{versao}.exe
```

### macOS (DMG)

Para gerar um instalador macOS (.dmg):

```bash
yarn dist:mac
```

O instalador é gerado em `release/` com o nome:

```
mesa-do-secretario-{versao}.dmg
```

O _build_ é exclusivo para Apple Silicon (arm64) e assinado ad-hoc pelo _hook_ `afterPack`. Veja [Assinatura de Código](#assinatura-de-codigo) e [Primeira Abertura no macOS](#primeira-abertura-no-macos).

### Ambas as Plataformas

```bash
yarn dist
```

---

## Configuração de Build

A configuração de _build_ está no `package.json`, na seção `build`:

```json
{
  "build": {
    "appId": "com.glmese.mesadosecretario",
    "productName": "Mesa do Secretario",
    "afterPack": "scripts/mac-adhoc-sign.cjs",
    "directories": {
      "output": "release"
    },
    "files": ["dist/**/*", "dist-electron/**/*", "build/**/*", "package.json"],
    "win": {
      "icon": "build/icon.ico",
      "executableName": "mesa-do-secretario",
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Mesa do Secretario"
    },
    "mac": {
      "target": [
        {
          "target": "dmg",
          "arch": ["arm64"]
        }
      ],
      "icon": "build/icon.icns",
      "artifactName": "mesa-do-secretario-${version}.${ext}",
      "category": "public.app-category.productivity",
      "identity": null
    }
  }
}
```

### Ícones

Os ícones do aplicativo devem estar em `build/`:

- `build/icon.ico` — Ícone Windows (256x256 px, formato ICO)
- `build/icon.icns` — Ícone macOS (1024x1024 px, formato ICNS)

---

## Segurança do Electron

O Mesa do Secretário segue as melhores práticas de segurança do Electron:

### Configuração do BrowserWindow

```typescript
// src/electron/main.ts
const win = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true, // ✅ Ativado — isola o contexto do preload
    nodeIntegration: false, // ✅ Desativado — sem acesso ao Node.js no renderer
    sandbox: true, // ✅ Ativado — sandbox do Chromium
  },
});
```

### API Mínima de Preload

O _preload script_ expõe apenas as operações necessárias:

```typescript
// src/electron/preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  persistState: (key: string, data: string) => ipcRenderer.invoke('persist:state', key, data),
  loadState: (key: string) => ipcRenderer.invoke('persist:load', key),
  clearState: () => ipcRenderer.invoke('persist:clear'),
});
```

### Operações Privilegiadas

Todas as operações de _storage_ são mediadas pelo processo principal via IPC:

```
Renderer (React)  →  Preload (API mínima)  →  Main (operações privilegiadas)
```

O renderer **nunca** acessa `localStorage` diretamente — apenas através da API do preload.

### Content Security Policy

O `index.html` inclui uma política de segurança restritiva:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self';
           style-src 'self' 'unsafe-inline';
           img-src 'self' data:;
           font-src 'self';
           connect-src 'self'"
/>
```

---

## Assinatura de Código

### macOS

O projeto não possui certificado do Apple Developer Program, então o `package.json` mantém `identity: null` e o electron-builder pula a própria etapa de assinatura.

Isso, sozinho, produz um aplicativo quebrado no Apple Silicon. O `.app` fica apenas com a assinatura ad-hoc residual do linker do Electron, que declara recursos não selados:

```
Identifier=Electron                    ← identifier genérico
flags=0x20002(adhoc,linker-signed)
Info.plist=not bound                   ← Info.plist fora da assinatura

$ codesign --verify --deep --strict "Mesa do Secretario.app"
code has no resources but signature indicates they must be present
```

O Gatekeeper trata assinatura inválida de forma diferente de assinatura ausente. Ausente gera "de desenvolvedor não identificado", com caminho de liberação pela interface. **Inválida** gera "o aplicativo está danificado e não pode ser aberto. Você deve movê-lo para o Lixo" — sem nenhuma saída pela interface.

Por isso o _build_ do macOS registra um _hook_ `afterPack`:

```json
{
  "build": {
    "afterPack": "scripts/mac-adhoc-sign.cjs"
  }
}
```

O _hook_ (`scripts/mac-adhoc-sign.cjs`) refaz a assinatura ad-hoc sobre o _bundle_ já empacotado, antes da geração do DMG:

```bash
codesign --force --deep --sign - "Mesa do Secretario.app"
codesign --verify --deep --strict "Mesa do Secretario.app"
```

Resultado: `Identifier` correto, `Info.plist` selado e verificação passando. O aplicativo continua sem notarização — o usuário ainda precisa liberá-lo na primeira abertura (veja a seção seguinte), mas o caminho pela interface passa a existir.

#### Arquitetura

O `target` do macOS fixa `arm64` explicitamente. Sem isso, o artefato herda a arquitetura da máquina que executa o _build_, o que torna a saída imprevisível. **O DMG não roda em Macs Intel.**

#### Notarização (opcional, requer conta paga)

Para eliminar o aviso por completo e permitir abertura com duplo clique em qualquer Mac, é necessário Apple Developer Program (US$ 99/ano):

1. Obtenha um certificado Developer ID Application.
2. Substitua `identity: null` pelo nome do certificado e remova o _hook_ `afterPack`.
3. Habilite `hardenedRuntime: true` e configure os _entitlements_.
4. Configure as credenciais de notarização no ambiente de _build_:

```bash
export APPLE_ID="conta@exemplo.com"
export APPLE_APP_SPECIFIC_PASSWORD="senha-especifica-do-app"
export APPLE_TEAM_ID="XXXXXXXXXX"
```

---

## Primeira Abertura no macOS

Esta seção é destinada ao **usuário final** que recebeu o DMG.

Como o aplicativo recebe assinatura ad hoc, mas não é autorizado pela Apple, o macOS bloqueia a primeira execução com a mensagem de que não é possível verificar se contém _malware_. O bloqueio é do Gatekeeper, e a liberação é feita **uma única vez por versão instalada**.

### Passo 1 — Instalar na pasta Aplicativos

1. Dê um duplo clique no arquivo `mesa-do-secretario-{versao}.dmg`. Uma janela do Finder se abre.
2. **Arraste** o ícone do Mesa do Secretário para o atalho da pasta Aplicativos, na mesma janela.
3. Aguarde a cópia terminar.
4. Ejete o DMG: clique com o botão direito no disco montado, na barra lateral do Finder, e escolha **Ejetar**.

> **Não execute o aplicativo de dentro do DMG.** O DMG é somente leitura e a liberação do Gatekeeper não persiste.

### Passo 2 — Tentar abrir uma vez

1. Abra a pasta **Aplicativos** no Finder.
2. Dê um duplo clique em **Mesa do Secretario**.
3. Aparece um aviso informando que a Apple não pode verificar o aplicativo. Clique em **OK** ou **Concluído**.

Este passo é obrigatório: o botão de liberação do passo seguinte só aparece **depois** de uma tentativa de abertura.

### Passo 3 — Liberar em Ajustes do Sistema

**No macOS 13 (Ventura) ou mais recente — inclui o macOS 26 (Tahoe):**

1. Abra o menu Apple () → **Ajustes do Sistema**.
2. Na barra lateral, clique em **Privacidade e Segurança**.
3. Role a página até a seção **Segurança**, no final.
4. Você verá a mensagem: _"Mesa do Secretario" foi bloqueado para proteger o seu Mac_.
5. Clique no botão **Abrir mesmo assim**, ao lado da mensagem.
6. Autentique com Touch ID ou com a senha de administrador do Mac.
7. Um último diálogo de confirmação aparece. Clique em **Abrir**.

**No macOS 12 (Monterey) ou anterior:**

1. Abra o menu Apple () → **Preferências do Sistema** → **Segurança e Privacidade**.
2. Na aba **Geral**, clique no cadeado do canto inferior esquerdo e autentique.
3. Clique em **Abrir Assim Mesmo**.

O aplicativo abre normalmente. Nas execuções seguintes, o duplo clique funciona direto — não é preciso repetir nada.

> O botão **Abrir mesmo assim** expira cerca de uma hora após a tentativa de abertura. Se ele não estiver mais visível, repita o Passo 2 e volte aos Ajustes.

### Alternativa pelo Terminal

Para liberar em um único comando, sem passar pelos Ajustes do Sistema:

```bash
xattr -dr com.apple.quarantine "/Applications/Mesa do Secretario.app"
```

O comando remove o atributo de quarentena que o navegador aplica a arquivos baixados. Sem esse atributo, o Gatekeeper não avalia o aplicativo e ele abre direto.

### Solução de Problemas

| Sintoma                                               | Causa                                                                     | O que fazer                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "O aplicativo está danificado e não pode ser aberto"  | DMG gerado antes da correção de assinatura ad-hoc, ou download corrompido | Baixe novamente a versão atual. Se persistir, use o comando `xattr` acima   |
| O botão "Abrir mesmo assim" não aparece               | O aplicativo ainda não foi executado, ou o botão já expirou               | Repita o Passo 2 e volte imediatamente aos Ajustes                          |
| "Não é possível abrir o aplicativo neste tipo de Mac" | Mac com processador Intel                                                 | O DMG é exclusivo para Apple Silicon (M1 e superiores). Não há versão Intel |
| O aviso reaparece a cada abertura                     | Aplicativo executado de dentro do DMG                                     | Arraste para a pasta Aplicativos e repita o processo a partir do Passo 1    |

Para descobrir o processador do Mac: menu Apple () → **Sobre este Mac**. A linha **Chip** indica Apple M1/M2/M3 ou superior; a linha **Processador** indica Intel.

### Windows

Para distribuições Windows, o NSIS gera um instalador autoassinado durante o desenvolvimento. Para produção, configure _code signing_:

1. Obtenha um certificado de assinatura de código (DigiCert, Sectigo, etc.)
2. Configure variáveis de ambiente com o certificado
3. Aplique a assinatura:

```bash
electron-builder --win --publish never --windows.sign="%CERT_FILE%" --windows.signWithParams="%SIGN_PARAMS%"
```

---

## Ver Também

- [Instalação](Instalacao) — Como configurar o ambiente de desenvolvimento
- [Arquitetura](Arquitetura) — Estrutura do projeto e do código Electron
