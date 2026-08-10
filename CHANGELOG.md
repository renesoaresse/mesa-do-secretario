# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e o versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [UNRELEASED]

## [0.5.1] - 2026-08-09

### Corrigido

- assinatura de código do macOS refeita durante o empacotamento, corrigindo o erro
  `"Mesa do Secretario.app" está danificado e não pode ser aberto` em Macs com Apple Silicon.
  O `.app` era gerado apenas com a assinatura ad hoc residual do linker do Electron, que
  declara recursos não selados; o Gatekeeper classificava a assinatura como inválida e
  bloqueava a abertura sem oferecer caminho de liberação pela interface
- `Identifier` do bundle passou de `Electron` para `com.glmese.mesadosecretario`, e o
  `Info.plist` passou a ser selado pela assinatura
- trecho corrompido em `wiki-docs/08-Build-e-Distribuicao.md`, que continha caracteres
  chineses no meio da frase (`para跳过 assinatura`)
- blocos de comando do `README.md` que não estavam em code fences e seriam renderizados
  como parágrafo corrido
- lista de autores do `README.md`, cujas quebras de linha simples colapsavam no render
- badge do React no `README.md`, de 18 para 19

### Adicionado

- `scripts/mac-adhoc-sign.cjs`: _hook_ `afterPack` do electron-builder que aplica assinatura
  ad hoc ao bundle empacotado e verifica o resultado antes da geração do DMG
- seção **Primeira Abertura no macOS** em `wiki-docs/08-Build-e-Distribuicao.md`, destinada
  ao usuário final, com passo a passo de liberação para macOS 13 ou superior e para macOS 12
  ou anterior, alternativa por Terminal e tabela de solução de problemas
- documentação do caminho de autorização pela Apple (Developer ID) como evolução futura

### Alterado

- `target` do macOS passou a fixar `arm64` de forma explícita; antes, sem `arch` declarado,
  o artefato herdava a arquitetura da máquina que executava o _build_
- seção **Assinatura de Código** da wiki reescrita, documentando a diferença entre assinatura
  ausente e assinatura inválida no tratamento do Gatekeeper
- revisão de gramática e vocabulário do `README.md`, com tradução dos títulos que tinham
  equivalente consagrado em português e padronização dos estrangeirismos em itálico

### Removido

- suporte a Macs com processador Intel. O DMG passou a ser exclusivo de Apple Silicon

## [0.5.0] - 2026-08-09

### Adicionado

- exportação de PDF com proteção por senha, incluindo `PdfExportAction`, `PdfPasswordModal`
  e o serviço `src/services/pdfExport.ts`
- numeração de linhas no preview do documento, via `src/features/preview/hooks/useLineNumbers.ts`
- componentes de interface `Checkbox` e `PasswordInput`
- campo de tronco de beneficência com componente dedicado (`TroncoInput`)
- canal de IPC para exportação de PDF no processo principal do Electron, com testes de
  `main` e `preload`

### Alterado

- `DocumentPreview` reestruturado para acomodar a numeração de linhas e a exportação
- estilos de impressão (`print.css`) ajustados para o novo layout do documento
- painel da Palavra do Bem da Ordem revisado
- lista de lojas padrão (`defaultLojas.ts`) ampliada

## [0.4.0] - 2026-07-03

### Adicionado

- navegação entre telas com o roteador `wouter`, com a edição da ata movida para `AppEditor`
- tela inicial (_home_) com cartões de acesso rápido, composta por `HomeScreen`,
  `LauncherCard` e `WelcomeSection`
- hook `useHasSavedAta` para detectar rascunho de ata salvo
- cadastro de lojas, com listagem, formulário e seleção por combobox
  (`LojasListScreen`, `LojaFormScreen`, `LojaCombobox`, `useLojas`)
- tela de configurações (`ConfigScreen`) e componente `Modal`
- suporte a sessão conjunta, via `SessionConjuntaForm`
- wiki do projeto em `wiki-docs/`, com 8 páginas (Home, Instalação, Quickstart, Arquitetura,
  Padrões de Código, Testes, Build e Distribuição, Changelog)

### Alterado

- painel e entrada de visitantes reformulados
- persistência ampliada em `src/services/storage.ts` para acomodar lojas e sessão conjunta
- layout adaptado às novas telas, com ampliação de `components.css` e criação de `home.css`

## [0.3.0] - 2026-03-18

### Adicionado

- 34 novos arquivos de teste unitário cobrindo componentes reutilizáveis, formulários,
  listas, painéis, layout e composição principal da aplicação
- helpers reutilizáveis de teste em `src/test/render.tsx` e `src/test/factories.ts`
- suíte de testes para o preview seguro cobrindo texto malicioso, entidades escapadas,
  blocos condicionais, estabilidade durante edição e helpers textuais reutilizáveis
- suíte de testes para o shell Electron cobrindo preload seguro, regras de navegação,
  bloqueio de novas janelas e persistência mediada por IPC
- helper de testes para seed e leitura do storage em `src/test/storage.ts`
- cenários E2E cobrindo restauração dos campos persistidos e limpeza de dados legados

### Alterado

- escopo do coverage alinhado ao valor real da feature, excluindo barrels, arquivos de tipos,
  `src/app/providers.tsx`, `src/features/preview/components/DocumentPreview.tsx` e
  `src/features/loja-config/components/LojaConfigForm.tsx`
- cobertura total da suíte unitária elevada para 93.90%
- preview do documento migrado de HTML injetado para renderização declarativa em React,
  preservando `#documentPreview`, classes, `aria-label` e comportamento de zoom
- lógica textual do preview centralizada em `src/features/preview/components/documentPreviewText.ts`
  para reduzir regressões e manter tratamento consistente de todos os campos textuais
- `MainPreview` passou a ser validado com o `DocumentPreview` real em teste de integração
- `DocumentPreview.tsx` voltou ao escopo de coverage do Vitest
- `src/electron/main.ts` passou a explicitar `sandbox`, preload dedicado e bloqueios
  padrão para navegação externa e `window.open`
- `src/services/storage.ts` agora usa a ponte segura do Electron quando disponível,
  mantendo fallback para `localStorage` no ambiente web
- `src/app/App.tsx` e `src/components/layout/MainPreview.tsx` passaram a sinalizar e
  respeitar o runtime endurecido sem quebrar o fluxo atual
- persistência da ata migrada para um draft canônico com restauração dos campos principais
  restantes em `src/hooks/useAtaState.ts` e `src/services/storage.ts`
- compatibilidade mantida com `officersConfig` e `lojaConfig` durante a migração do estado
- `src/app/App.tsx` e `src/components/layout/SidebarContent.tsx` foram simplificados após a
  remoção completa do fluxo de documentos

### Segurança

- removido o uso de `dangerouslySetInnerHTML` no preview de atas
- todos os campos textuais do preview agora são exibidos como texto literal, sem interpretar
  HTML vindo da entrada do usuário ou de futuras importações
- adicionada API mínima no preload com superfície tipada e sem canal genérico
- operações privilegiadas de persistência passaram a ser centralizadas no processo principal
- adicionada política de conteúdo restritiva em `index.html`, compatível com o fluxo atual

### Removido

- módulo de documentos, incluindo tipos, componentes, lógica de estado e testes em
  `src/features/documents/`

## [0.2.0] - 2026-03-18

### Adicionado

- Arquitetura Feature-Sliced com 7 feature slices verticais autocontidas
  (`session`, `documents`, `officers`, `visitors`, `preview`, `loja-config`, `palavra`)
- Barrel exports (`index.ts`) para cada feature, controlando a API pública
- Serviço de storage (`src/services/storage.ts`) encapsulando `localStorage`
- Hook global `useAtaState` (`src/hooks/useAtaState.ts`) centralizando o estado da aplicação
- Placeholder de providers (`src/app/providers.tsx`) para expansão futura
- Pipeline de qualidade de código:
  - Prettier (aspas simples, semicolons, 100 colunas)
  - ESLint estendido com `eslint-config-prettier` e `eslint-plugin-jsx-a11y`
  - Husky com hooks `pre-commit` (lint-staged) e `commit-msg` (commitlint)
  - Commitlint com regras Conventional Commits
- Testes unitários com Vitest + React Testing Library + jsdom:
  - 8 testes para o serviço de storage
  - 8 testes para o hook useAtaState
  - 5 testes para o componente Button
- Cobertura de testes com `@vitest/coverage-v8`
- Testes E2E com Playwright + Chromium + Page Object Model:
  - 3 smoke tests (sidebar, preview, titulo)
  - WebServer integrado (sobe Vite automaticamente)
- `.gitignore` expandido para coverage, playwright-report, test-results, ferramentas de IA

### Alterado

- `App.tsx` simplificado — usa `useAtaState` em vez de 18 `useState` locais
- CSS fatiado de 1 arquivo (797 linhas) para 5 arquivos temáticos:
  `tokens.css`, `reset.css`, `layout.css`, `components.css`, `print.css`
- 37 componentes migrados de `src/components/` para `src/features/<domínio>/components/`
- Componentes de layout consolidados em `src/components/layout/`
- Typo corrigido: `OpenTextSction.tsx` renomeado para `OpenTextSection.tsx`
- Erros de lint pré-existentes corrigidos (imports não utilizados, acessibilidade)

## [0.1.0] - 2025-02-08

### Adicionado

- Versão inicial da aplicação Mesa do Secretário
- Geração de atas para sessões maçônicas (econômica, magna, conjunta)
- Preview em tempo real com HTML simulando folha A4 padrão ABNT
- Configuração da loja e oficiais com persistência em localStorage
- Empacotamento Electron para Windows (NSIS) e macOS (DMG)
