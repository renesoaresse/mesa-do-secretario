# Mesa do Secretário

![Electron](https://img.shields.io/badge/Electron-Desktop-blue?logo=electron)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-purple?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicação _desktop_ de apoio administrativo às sessões maçônicas, que permite gerar
e gerir atas de forma padronizada.

## ✨ Funcionalidades

- Geração automática de atas
- Pré-visualização em tempo real
- Exportação para impressão
- Configuração da loja
- Distribuição como aplicativo _desktop_

## 🧱 Tecnologias

- React
- Vite
- Electron
- TypeScript

## 📦 Instalação

### Ambiente de desenvolvimento

```bash
yarn install
yarn dev
```

### Compilação

```bash
yarn build
```

### Distribuição

```bash
yarn dist:win
yarn dist:mac
```

O _build_ do macOS é gerado exclusivamente para Apple Silicon (arm64) e recebe
assinatura ad hoc por meio do _hook_ `scripts/mac-adhoc-sign.cjs`. Sem essa
etapa, o Gatekeeper considera a assinatura inválida e acusa o aplicativo como
danificado.

### Primeira abertura no macOS

Como o aplicativo não é autorizado pela Apple, o macOS informa, na primeira
execução, que não consegue verificar o desenvolvedor. O comportamento é
esperado, e a liberação precisa ser feita uma única vez por versão instalada.

Resumo do procedimento:

1. Abra o DMG e **arraste** o aplicativo para a pasta Aplicativos.
2. Ejete o DMG e abra o aplicativo a partir da pasta Aplicativos. Ao surgir o
   aviso de bloqueio, clique em OK.
3. Acesse Ajustes do Sistema → Privacidade e Segurança, role a página até a
   seção Segurança e clique em **Abrir mesmo assim**.
4. Autentique-se com o Touch ID ou com a senha de administrador e confirme em
   **Abrir**.

O passo a passo completo — com as diferenças entre as versões do macOS e o que
fazer quando o botão de liberação não aparece — está em
[Build e Distribuição — Primeira abertura no macOS](wiki-docs/08-Build-e-Distribuicao.md#primeira-abertura-no-macos).

## Autores

- **Marcio Alves de Andrade** — Loja Maçônica Luzes do Cruzeiro nº 29
- **Renê Rocha Soares Neto** — Loja Maçônica Hans Werner Menna Barreto König nº 19
- **Victor Moura Amado** — Loja Maçônica Segredo dos 33 nº 09
- **Jorge Luiz Mendes Gonçalves Junior** — Loja Maçônica 7 de Setembro nº 01
