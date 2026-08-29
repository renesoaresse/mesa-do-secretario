# Padrões de Código

Este documento estabelece as convenções e regras que todos os desenvolvedores devem seguir ao escrever código para o Mesa do Secretário. O objetivo é garantir consistência, manutenibilidade e qualidade em todas as contribuições.

Para contexto arquitetural, consulte [Arquitetura](Arquitetura).

---

## TypeScript

O projeto usa TypeScript 5.9 em **strict mode**. Toda nova código deve ser tipado corretamente.

### Regras Fundamentais

- **Não usar `any`** — Se o tipo é desconhecido, use `unknown` e refine-o com guardas de tipo
- **`noUnusedLocals: true`** — Variáveis locais não utilizadas são erro de compilação
- **`noUnusedParameters: true`** — Parâmetros não utilizados são erro de compilação
- **Tipagem forte em funções** — Assinaturas de função devem ter tipos explícitos em todos os parâmetros e no retorno

### Exemplo Correto

```typescript
type SessionType = 'economica' | 'magna' | 'conjunta';

interface SessionConfig {
  readonly grau: Grau;
  numSessao: number;
  dataISO: string;
}

function createSession(type: SessionType, config: SessionConfig): SessionConfig {
  return { ...config, grau: 'Mestre' };
}
```

### Exemplo Incorreto

```typescript
// ❌ any não é permitido
function process(data: any) {
  return data.value; // any ignora erros de tipo
}

// ❌ Parâmetro não utilizado deve ser prefixado com _
function validate(value: string, _required: boolean) {
  return value.length > 0;
}

// ❌ Tipo de retorno implícito em funções complexas
function parseConfig(raw: string) {
  // ❌ Falta tipo de retorno
  return JSON.parse(raw);
}
```

---

## CSS

O projeto usa **CSS puro** com _design tokens_ via propriedades CSS. Nenhum framework CSS (Tailwind, CSS-in-JS, etc.) é permitido.

### Design Tokens

Todos os valores de _design_ (cores, espaçamento, tipografia) são definidos como _design tokens_ em `src/styles/tokens.css`:

```css
:root {
  /* Azuis institucionais */
  --blue-900: #0b1d3a;
  --blue-850: #0f2648;
  --blue-800: #102a52;
  --blue-700: #163a6b;

  /* Dourados do brasão */
  --gold-500: #c9a24d;
  --gold-450: #d3ad5c;
  --gold-400: #e0b866;

  /* Texto */
  --text-light: #f5f7fa;
  --text-muted: #c7d0dd;
  --text-dim: #9fb0c6;
  --text-dark: #1f2937;

  /* Superfícies e campos */
  --bg-app: #eef1f4;
  --input-bg: rgba(255, 255, 255, 0.08);
  --input-bg-hover: rgba(255, 255, 255, 0.12);
  --input-border: rgba(255, 255, 255, 0.22);
  --input-border-strong: rgba(255, 255, 255, 0.32);

  /* Bordas e sombras */
  --border-light: #d6dae1;
  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.12);
}
```

Os tokens nomeiam a cor pela escala, não pelo papel (`--blue-900`, e não `--color-primary`).
Não há tokens de espaçamento, tipografia ou raio de borda: esses valores são escritos direto nas
regras CSS.

### Arquivos CSS

O CSS é organizado em 6 arquivos temáticos:

| Arquivo          | Propósito                            |
| ---------------- | ------------------------------------ |
| `tokens.css`     | _Design tokens_ (variáveis CSS)      |
| `reset.css`      | Normalização de estilos do navegador |
| `layout.css`     | Grid, sidebar, container do preview  |
| `components.css` | Estilos de componentes reutilizáveis |
| `home.css`       | Estilos da tela inicial              |
| `print.css`      | Regras de impressão (`@media print`) |

### Classes CSS

- Classes CSS são nomeadas em **kebab-case** (ex: `sidebar-header`, `preview-container`)
- Classes de utilitário são evitadas — prefira CSS semântico com classes descritivas
- Cada componente tem sua própria seção no `components.css` com um comentário de cabeçalho

---

## Componentes React

### Estrutura de um Componente

```tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'secondary', className = '', ...props }: ButtonProps) {
  const base = 'btn';
  const v = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return <button {...props} className={`${base} ${v} ${className}`.trim()} />;
}
```

### Regras

- Componentes são **declarações de função exportadas** (`export function Nome(props: Props)`).
  Não use `FC<Props>` nem `React.FunctionComponent`: a tipagem vai nos parâmetros, e o retorno é
  inferido. As 68 declarações de componente do projeto seguem esta forma, e nenhuma usa `FC`.
- O tipo das _props_ é declarado no próprio arquivo, com o nome do componente mais `Props`.
- Extrair _event handlers_ para variáveis com `const handleX = ...`.
- Usar `className` para estilização — ver a regra de estilo em linha abaixo.
- Cada componente em seu próprio arquivo, nomeado com **PascalCase**.
- Arquivo de teste ao lado: `Button.test.tsx`.

### Estilo em Linha

A estilização pertence ao CSS. Ainda assim, o projeto tem **52 usos de `style={{ … }}`** em 27
arquivos, concentrados em `features/loja-config/components` (8 arquivos) e
`features/bolsa/components` (4), quase todos para espaçamento e largura pontuais — por exemplo
`src/features/bolsa/components/BolsaPropostasList.tsx:41`.

A regra vigente é: **não introduzir novos estilos em linha**. Os existentes são dívida conhecida,
registrada em [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica), e devem migrar para
`components.css` conforme os arquivos forem tocados.

## Hooks

- Hooks customizados vivem em `src/hooks/` ou dentro da _feature_ (`src/features/<nome>/hooks/`)
- Nomear com prefixo `use`: `useAtaState`, `useLocalStorage`
- Hooks que precisam de _cleanup_ devem retornar uma função de limpeza

### Exemplo

```typescript
import { useState, useEffect, useCallback } from 'react';

export function useAtaState() {
  const [sessionType, setSessionType] = useState<SessionType>('economica');

  const updateSessionType = useCallback((type: SessionType) => {
    setSessionType(type);
  }, []);

  useEffect(() => {
    const saved = storage.load<AtaDraft>('ata-draft');
    if (saved) {
      setSessionType(saved.sessionType);
    }
  }, []);

  return { sessionType, updateSessionType };
}
```

---

## Nomenclatura

| Entidade               | Convenção                   | Exemplo                 |
| ---------------------- | --------------------------- | ----------------------- |
| Arquivos de componente | PascalCase                  | `SessionConfigForm.tsx` |
| Arquivos de _hook_     | camelCase com prefixo `use` | `useAtaState.ts`        |
| Arquivos de serviço    | camelCase                   | `storage.ts`            |
| Arquivos de tipos      | kebab-case                  | `session-types.ts`      |
| Arquivos de teste      | Mesmo nome + `.test`        | `Button.test.tsx`       |
| Classes CSS            | kebab-case                  | `sidebar-header`        |
| Constantes             | SCREAMING_SNAKE_CASE        | `MAX_VISITORS`          |
| Tipos e interfaces     | PascalCase                  | `SessionConfig`         |

---

## Imports

### Regra de Barrel Export

**Sempre** importe de outros _features_ pela API pública (barrel export):

```typescript
// ✅ Correto
import { SessionTypeSelector } from '../session';
import { storage } from '../services/storage';

// ❌ Incorreto — caminho interno
import { SessionTypeSelector } from '../session/components/SessionTypeSelector';
```

> **Estado da regra**: hoje ela é descumprida em **27 imports**, entre eles um acesso direto de
> uma _feature_ a dados de outra
> (`src/features/officers/components/OfficerSelect.tsx:5`), e não existe regra de _lint_ que a
> imponha. Ver [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica).

### Ordem dos Imports

1. Dependências externas (React, bibliotecas)
2. Dependências internas (_features_, serviços, _hooks_)
3. Tipos (`type` keyword)
4. Imports relativos (`./`, `../`)

```typescript
import { useState, useCallback } from 'react';
import type { FC } from 'react';

import { Button } from '../components/ui/Button';
import { storage } from '../services/storage';
import { SessionTypeSelector } from '../features/session';
import type { AtaDraft } from '../types/ata';
```

---

## Persistência

**Nunca** chame `localStorage` diretamente fora de `src/services/storage.ts`. A regra é cumprida:
a única ocorrência fora do serviço está no auxiliar de teste `src/test/storage.ts`.

No alvo _desktop_ o mesmo serviço encaminha a chamada para a ponte do Electron, então usar o
serviço é o que mantém a aplicação funcionando nos dois alvos.

O serviço de armazenamento oferece uma abstração tipada:

```typescript
import { storage } from '../services/storage';

// Salvar dados
storage.save<AtaDraft>('ata-draft', draft);

// Carregar dados
const draft = storage.load<AtaDraft>('ata-draft');

// Remover dados
storage.remove('ata-draft');

// Limpar tudo
storage.clear();
```

---

## Estado

O estado da aplicação **deve** usar exclusivamente _hooks_ nativos do React:

- `useState` — estado local
- `useMemo` — valores computados cacheados
- `useCallback` — funções memoizadas
- `useEffect` — efeitos colaterais (persistência, subscriptions)

**Nenhuma** biblioteca de gerenciamento de estado é permitida (Redux, Zustand, Jotai, MobX, etc.).

---

## Regras Adicionais

### Condições em HTML

- Em JSX, use `condition && <Element />` para renderização condicional — não use operador ternário quando a condição for suficiente
- Prefira `{items.length > 0 ? items.map(...) : <EmptyState />}` quando precisar de fallback

### Acesso ao DOM

- Use `ref` para acessar elementos do DOM — não use `document.querySelector`
- Para _refs_ em componentes, use `useRef<HTMLInputElement>(null)`

### Eventos

- Tipar eventos com `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`, etc.
- Não passar `event` diretamente para funções — extrair os valores necessários

---

## Ver Também

- [Arquitetura](Arquitetura) — Visão geral da estrutura do projeto
- [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica) — regras descumpridas e plano
- [Testes](Testes) — Como escrever testes seguindo os padrões
