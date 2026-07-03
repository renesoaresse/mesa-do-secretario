# Arquitetura

Este documento descreve a arquitetura do Mesa do Secretário, incluindo a estrutura de diretórios, os princípios de organização do código e a filosofia de design que orienta o projeto.

Para entender as regras de implementação, consulte [Padrões de Código](Padroes-de-Codigo).

---

## Visão Geral

O Mesa do Secretário adota a **Feature-Sliced Architecture** (FSA), uma metodologia de organização de código que divide a aplicação em _domains_ verticais autocontidos chamados _feature slices_. Cada _slice_ contém todo o código necessário para implementar uma funcionalidade específica — componentes, _hooks_, tipos, serviços e testes.

Esta arquitetura foi introduzida na versão 0.2.0 e é o princípio organizacional do projeto.

---

## Estrutura de Diretórios

### Feature Slices

Cada _feature_ vive em `src/features/<nome>/`:

```
src/features/
├── session/          # Tipo de sessão (Econômica, Magna, Conjunta)
├── officers/         # Ofíciais da loja (VM, Vig., Or., Sec.)
├── visitors/         # Visitantes presentes na sessão
├── preview/          # Preview A4 da ata em tempo real
├── loja-config/      # Configuração da loja
└── palavra/          # Palavra de cada coluna (Sul, Norte, Oriente)
```

> **Nota**: O módulo `documents` foi removido na versão 0.3.0.

Cada _feature slice_ segue esta estrutura interna:

```
src/features/<nome>/
├── components/       # Componentes React da feature
├── types.ts          # Tipos TypeScript específicos da feature
└── index.ts          # Barrel export — API pública da feature
```

### Camadas Globais

Além das _features_, existem camadas compartilhadas que atravessam toda a aplicação:

```
src/
├── components/
│   ├── ui/           # Componentes reutilizáveis (Button, Input, etc.)
│   └── layout/       # Componentes de layout (Sidebar, Preview, AppLayout)
├── hooks/            # Hooks globais (useAtaState)
├── services/         # Serviços de side-effect (storage)
├── types/            # Tipos TypeScript compartilhados
└── styles/           # Arquivos CSS fatiados
```

### Componentes UI

O diretório `src/components/ui/` contém componentes genéricos sem lógica de negócio:

- `Button.tsx`
- `TextInput.tsx`
- `Textarea.tsx`
- `Select.tsx`
- `FormGroup.tsx`
- `FormRow.tsx`
- `SectionTitle.tsx`
- `StatusMessage.tsx`
- `FooterActions.tsx`
- `LastSaveInfo.tsx`
- `AutoSaveToast.tsx`

### Componentes de Layout

O diretório `src/components/layout/` contém componentes que definem a estrutura visual da aplicação:

- `AppLayout.tsx` — Composição raiz da aplicação
- `Sidebar.tsx` — Barra lateral com navegação
- `SidebarHeader.tsx` — Cabeçalho da barra lateral
- `SidebarContent.tsx` — Conteúdo da barra lateral
- `SidebarDrawer.tsx` — Gaveta expansível da barra lateral
- `MainPreview.tsx` — Área principal do preview

### Estado Global

O estado da aplicação é centralizado em um único _hook_:

- `src/hooks/useAtaState.ts` — Gerencia todo o estado da ata (tipo de sessão, configuração, oficiales, visitantes, Expedientes, etc.)

### Persistência

O serviço de armazenamento abstrai o acesso ao `localStorage`:

- `src/services/storage.ts` — Métodos `save()`, `load()`, `remove()`, `clear()`

### Tipos Compartilhados

Os tipos TypeScript que atravessam a aplicação estão em:

- `src/types/ata.ts` — Tipos principais: `AtaDraft`, `SessionConfig`, `Officers`, `LojaConfig`, `PreviewData`

### CSS

O CSS é organizado em arquivos temáticos em `src/styles/`:

| Arquivo          | O que contém                                              |
| ---------------- | --------------------------------------------------------- |
| `tokens.css`     | _Design tokens_ (cores, espaçamento, tipografia, sombras) |
| `reset.css`      | Normalização do navegador                                 |
| `layout.css`     | Grid, sidebar, container do preview                       |
| `components.css` | Estilos de componentes genéricos                          |
| `print.css`      | Regras `@media print` e formatação A4/ABNT                |

---

## Barrel Exports

Cada _feature_ expõe sua API pública exclusivamente através de um arquivo `index.ts` na raiz do diretório. Este padrão é chamado de **barrel export** e garante que:

- Imports entre _features_ sejam feitas apenas pela interface pública
- Mudanças internas não quebrem _features_ dependentes
- O _linter_ possa detectar imports diretos a caminhos internos

**Exemplo** de barrel export:

```typescript
// src/features/session/index.ts
export { SessionTypeSelector } from './components/SessionTypeSelector';
export { SessionConfigForm } from './components/SessionConfigForm';
export type { SessionConfig, MagnaFields } from './types';
```

**Exemplo** de import correto:

```typescript
import { SessionTypeSelector } from '../session'; // ✅ Correto — usa barrel
```

**Exemplo** de import incorreto:

```typescript
import { SessionTypeSelector } from '../session/components/SessionTypeSelector'; // ❌ Incorreto — caminho interno
```

---

## App.tsx como Composição Raiz

O `src/app/App.tsx` tem uma única responsabilidade: **compor a interface**. Ele não contém lógica de negócio, não faz chamadas diretas a `localStorage` e não mantém estado próprio. Ele:

1. Carrega o estado inicial do `useAtaState`
2. Passa _props_ para os componentes de layout
3. Delega toda a lógica para _features_ e _hooks_

---

## Ver Também

- [Padrões de Código](Padroes-de-Codigo) — Convenções de implementação
- [Testes](Testes) — Como a suíte de testes é organizada
