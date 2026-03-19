# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e o versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.3.0] - 2026-03-18

### Adicionado

- 34 novos arquivos de teste unitário cobrindo componentes reutilizáveis, formulários,
  listas, painéis, layout e composição principal da aplicação
- helpers reutilizáveis de teste em `src/test/render.tsx` e `src/test/factories.ts`
- suíte de testes para o preview seguro cobrindo texto malicioso, entidades escapadas,
  blocos condicionais, estabilidade durante edição e helpers textuais reutilizáveis
- suíte de testes para o shell Electron cobrindo preload seguro, regras de navegação,
  bloqueio de novas janelas e persistência mediada por IPC

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

### Segurança

- removido o uso de `dangerouslySetInnerHTML` no preview de atas
- todos os campos textuais do preview agora são exibidos como texto literal, sem interpretar
  HTML vindo da entrada do usuário ou de futuras importações
- adicionada API mínima no preload com superfície tipada e sem canal genérico
- operações privilegiadas de persistência passaram a ser centralizadas no processo principal
- adicionada política de conteúdo restritiva em `index.html`, compatível com o fluxo atual

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
