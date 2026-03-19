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
      "target": "dmg",
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

Para distribuir um aplicativo macOS fora da Mac App Store, é necessário assinatura de código. O `package.json` inclui `identity: null` para跳过 assinatura durante o desenvolvimento.

Para assinar o aplicativo:

1. Obtenha um certificado de assinatura de código da Apple Developer Program
2. Configure o _workflow_ de CI/CD para assinar durante o _build_
3. Aplique a assinatura:

```bash
electron-builder --mac --publish never --sign.identity="Nome do Certificado"
```

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
