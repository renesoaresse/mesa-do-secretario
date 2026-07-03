# Changelog

Este documento descreve o formato e a política de manutenção do histórico de mudanças do Mesa do Secretário.

O arquivo `CHANGELOG.md` na raiz do repositório é a fonte autoritativa do histórico de mudanças. Esta página wiki serve como guia para entender o formato e a política.

---

## Política de Manutenção

O CHANGELOG do Mesa do Secretário é mantido **manualmente**. Não usamos ferramentas automáticas de geração de changelog (como `standard-version`, `release-please` ou `semantic-release`).

Esta decisão é intencional: manter o changelog manualmente força os autores a articarem o **impacto para o usuário** de cada mudança, produzindo uma documentação significativa em vez de um _log_ mecânico de commits.

**A versão no `package.json` é atualizada manualmente** pelos mantenedores, não automaticamente por CI.

---

## Formato: Keep a Changelog

O formato segue a especificação [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), com as seguintes categorias:

### Categorias

| Categoria      | Quando usar                            |
| -------------- | -------------------------------------- |
| **Adicionado** | Novas funcionalidades                  |
| **Alterado**   | Mudanças em funcionalidades existentes |
| **Removido**   | Funcionalidades removidas              |
| **Segurança**  | Mudanças relacionadas a segurança      |
| **Correções**  | Correções de bugs                      |

### Estrutura

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Adicionado

- Descrição da nova funcionalidade

### Alterado

- Descrição da mudança com impacto no usuário

### Removido

- Funcionalidade que foi removida

### Segurança

- Correção ou melhoria de segurança

### Correções

- Bugs corrigidos
```

---

## Versionamento Semântico

O projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/):

| Tipo      | Quando incrementar                                    | Exemplo       |
| --------- | ----------------------------------------------------- | ------------- |
| **MAJOR** | Mudança incompatível com versões anteriores           | 0.2.0 → 1.0.0 |
| **MINOR** | Nova funcionalidade compatível com versões anteriores | 0.2.0 → 0.3.0 |
| **PATCH** | Correção de bug compatível com versões anteriores     | 0.2.0 → 0.2.1 |

**Situação atual**: O projeto está em fase de desenvolvimento inicial (v0.x.y), onde a API pública ainda não está estabilizada. Breaking changes podem ocorrer em versões 0.x.y.

---

## Histórico de Versões

### v0.3.0 — 2026-03-18

**Adicionado**

- 34 novos arquivos de teste unitário cobrindo componentes reutilizáveis, formulários, listas, painéis, layout e composição principal da aplicação
- _Helpers_ reutilizáveis de teste em `src/test/render.tsx` e `src/test/factories.ts`
- Suíte de testes para o preview seguro cobrindo texto malicioso, entidades escapadas, blocos condicionais, estabilidade durante edição e _helpers_ textuais reutilizáveis
- Suíte de testes para o _shell_ Electron cobrindo preload seguro, regras de navegação, bloqueio de novas janelas e persistência mediada por IPC
- _Helper_ de testes para _seed_ e leitura do _storage_ em `src/test/storage.ts`
- Cenários E2E cobrindo restauração dos campos persistidos e limpeza de dados legados

**Alterado**

- Escopo do _coverage_ alinhado ao valor real da _feature_, excluindo barrels, arquivos de tipos, `src/app/providers.tsx`, `src/features/preview/components/DocumentPreview.tsx` e `src/features/loja-config/components/LojaConfigForm.tsx`
- Cobertura total da suíte unitária elevada para 93,90%
- Preview do documento migrado de HTML injetado para renderização declarativa em React, preservando `#documentPreview`, classes, `aria-label` e comportamento de zoom
- Lógica textual do preview centralizada em `src/features/preview/components/documentPreviewText.ts` para reduzir regressões
- `MainPreview` passou a ser validado com o `DocumentPreview` real em teste de integração
- `DocumentPreview.tsx` voltou ao escopo de _coverage_ do Vitest
- `src/electron/main.ts` passou a explicitar `sandbox`, preload dedicado e bloqueios padrão para navegação externa
- `src/services/storage.ts` agora usa a ponte segura do Electron quando disponível, mantendo _fallback_ para `localStorage` no ambiente web
- Persistência da ata migrada para um _draft_ canônico com restauração dos campos principais restantes em `src/hooks/useAtaState.ts` e `src/services/storage.ts`
- Compatibilidade mantida com `officersConfig` e `lojaConfig` durante a migração do estado
- `src/app/App.tsx` e `src/components/layout/SidebarContent.tsx` foram simplificados após a remoção completa do fluxo de documentos

**Segurança**

- Removido o uso de `dangerouslySetInnerHTML` no preview de atas
- Todos os campos textuais do preview agora são exibidos como texto literal, sem interpretar HTML
- Adicionada API mínima no preload com superfície tipada e sem canal genérico
- Operações privilegiadas de persistência centralizadas no processo principal
- Adicionada política de conteúdo restritiva em `index.html`

**Removido**

- Módulo de documentos, incluindo tipos, componentes, lógica de estado e testes em `src/features/documents/`

---

### v0.2.0 — 2026-03-18

**Adicionado**

- Arquitetura Feature-Sliced com 7 _feature slices_ verticais autocontidas (`session`, `documents`, `officers`, `visitors`, `preview`, `loja-config`, `palavra`)
- Barrel exports (`index.ts`) para cada _feature_, controlando a API pública
- Serviço de _storage_ (`src/services/storage.ts`) encapsulando `localStorage`
- _Hook_ global `useAtaState` (`src/hooks/useAtaState.ts`) centralizando o estado da aplicação
- Placeholder de providers (`src/app/providers.tsx`) para expansão futura
- Pipeline de qualidade de código: Prettier, ESLint, Husky com _hooks_ `pre-commit` e `commit-msg`, Commitlint com Conventional Commits
- Testes unitários com Vitest + React Testing Library + jsdom (8 testes para `storage.ts`, 8 para `useAtaState`, 5 para `Button`)
- Cobertura de testes com `@vitest/coverage-v8`
- Testes E2E com Playwright + Chromium + Page Object Model (3 _smoke tests_)
- `.gitignore` expandido

**Alterado**

- `App.tsx` simplificado — usa `useAtaState` em vez de 18 `useState` locais
- CSS fatiado de 1 arquivo para 5 arquivos temáticos
- 37 componentes migrados para `src/features/<domínio>/`
- Componentes de layout consolidados em `src/components/layout/`

---

### v0.1.0 — 2025-02-08

**Adicionado**

- Versão inicial da aplicação Mesa do Secretário
- Geração de atas para sessões maçônicas (Econômica, Magna, Conjunta)
- Preview em tempo real com HTML simulando folha A4 padrão ABNT
- Configuração da loja e oficiais com persistência em `localStorage`
- Empacotamento Electron para Windows (NSIS) e macOS (DMG)

---

## Adicionando Entradas ao Changelog

Ao fazer uma mudança significativa, adicione uma entrada ao `CHANGELOG.md`:

1. **Não espere** — adicione a entrada no mesmo PR que faz a mudança
2. Use a **voz do usuário** — descreva o impacto, não o que foi feito tecnicamente
3. **Uma entrada por mudança significativa** — não liste cada _commit_
4. Agrupe por **categoria** (Adicionado, Alterado, Removido, etc.)
5. Se a mudança afeta a **segurança**, use a categoria **Segurança**
6. Se a mudança é uma **correção**, use a categoria **Correções**

### Exemplos de Boas Entradas

```markdown
## [UNRELEASED]

### Adicionado

- Preview seguro: campos textuais agora são renderizados sem interpretar HTML,
  eliminando riscos de injeção de conteúdo malicioso

### Alterado

- Persistência ampliada: campos da ata são salvos automaticamente, permitindo
  retomada do preenchimento após fechar o navegador

### Removido

- Módulo de documentos: a funcionalidade de importação de PDFs foi removida
  para simplificar o fluxo de edição
```

### Exemplos de Entradas Ruins

```markdown
# ❌ Evitar — detalhe técnico, não impacto para o usuário

### Alterado

- Refatorou storage.ts para usar IPC

# ❌ Evitar — lista de commits, não changelog

### Adicionado

- feat(session): adiciona tipo de sessão
- feat(preview): adiciona renderização
- fix(storage): corrige bug null
```

---

## Ver Também

- [Home](Home) — Visão geral do projeto
