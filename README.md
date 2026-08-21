# Mesa do Secretário

![Electron](https://img.shields.io/badge/Electron-Desktop-blue?logo=electron)
![Vercel](https://img.shields.io/badge/Vercel-Web-black?logo=vercel)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-purple?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicação de apoio administrativo às sessões maçônicas, que permite gerar e gerir
atas de forma padronizada. Distribuída como aplicativo _desktop_ (Windows e macOS)
e também publicável como aplicação web estática.

## ✨ Funcionalidades

- Geração automática de atas
- Pré-visualização em tempo real
- Exportação para impressão
- Exportação de PDF protegido por senha (exclusivo da versão _desktop_)
- Configuração da loja
- Distribuição como aplicativo _desktop_ ou como aplicação web

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

O comando gera o _build_ completo do _desktop_: o _renderer_ com caminhos relativos
(`yarn build:renderer`) e o processo principal do Electron (`yarn build:electron`).
Para a versão web, use `yarn build:web`, descrito na seção de publicação.

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

## 🌐 Publicação web

A versão web é totalmente estática: não há servidor, banco de dados nem chamada a
APIs externas. Para gerar os artefatos:

```bash
yarn build:web
```

A saída fica em `dist/`, com caminhos absolutos e roteamento por History API — ao
contrário do _build_ do _desktop_, que usa caminhos relativos e rotas por _hash_
porque o Electron carrega o HTML via `file://`.

O arquivo `vercel.json`, na raiz do projeto, versiona toda a configuração de deploy
na Vercel (comandos, diretório de saída, reescrita de rotas da SPA, cache e
cabeçalhos de segurança). Basta importar o repositório na Vercel: não há variável de
ambiente secreta a configurar, pois o projeto não usa credenciais nem chaves de API.

Duas diferenças importam ao usuário final na versão web:

- a exportação de **PDF protegido por senha não existe**, por depender do
  `printToPDF` do Electron; resta a impressão pelo navegador;
- os dados ficam no `localStorage`, ou seja, **apenas no navegador da máquina que os
  digitou** — nada é enviado ao servidor, outro computador não os acessa, e limpar
  os dados de navegação os apaga em definitivo.

Os detalhes de configuração estão em
[Build e Distribuição — Publicação na Web (Vercel)](wiki-docs/08-Build-e-Distribuicao.md#publicação-na-web-vercel).

## Autores

- **Marcio Alves de Andrade** — Loja Maçônica Luzes do Cruzeiro nº 29
- **Renê Rocha Soares Neto** — Loja Maçônica Hans Werner Menna Barreto König nº 19
- **Victor Moura Amado** — Loja Maçônica Segredo dos 33 nº 09
- **Jorge Luiz Mendes Gonçalves Junior** — Loja Maçônica 7 de Setembro nº 01
