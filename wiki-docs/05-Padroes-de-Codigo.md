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
  --color-primary: #1a365d;
  --color-secondary: #2c5282;
  --color-background: #f7fafc;
  --color-text: #1a202c;
  --color-border: #e2e8f0;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Arquivos CSS

O CSS é organizado em 5 arquivos temáticos:

| Arquivo          | Propósito                            |
| ---------------- | ------------------------------------ |
| `tokens.css`     | _Design tokens_ (variáveis CSS)      |
| `reset.css`      | Normalização de estilos do navegador |
| `layout.css`     | Grid, sidebar, container do preview  |
| `components.css` | Estilos de componentes reutilizáveis |
| `print.css`      | Regras de impressão (`@media print`) |

### Classes CSS

- Classes CSS são nomeadas em **kebab-case** (ex: `sidebar-header`, `preview-container`)
- Classes de utilitário são evitadas — prefira CSS semântico com classes descritivas
- Cada componente tem sua própria seção no `components.css` com um comentário de cabeçalho

---

## Componentes React

### Estrutura de um Componente

```tsx
import { type FC } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextInput: FC<Props> = ({ label, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor="input">{label}</label>
      <input id="input" type="text" value={value} onChange={handleChange} className="text-input" />
    </div>
  );
};
```

### Regras

- Componentes funcionais com **tipos de `FC<Props>`** — não use `React.FunctionComponent`
- Extrair _event handlers_ para variáveis com `const handleX = ...`
- Usar `className` para estilização CSS — nunca _inline styles_
- Cada componente em seu próprio arquivo, nomeado com **PascalCase**
- Arquivo de teste ao lado: `TextInput.test.tsx`

---

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

**Nunca** chame `localStorage` diretamente fora de `src/services/storage.ts`.

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
- [Testes](Testes) — Como escrever testes seguindo os padrões
