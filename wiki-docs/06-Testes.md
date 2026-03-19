# Testes

Este documento descreve como a suíte de testes do Mesa do Secretário é organizada, como executar os testes e como escrever novos testes seguindo os padrões do projeto.

O projeto adota **TDD** (Test-Driven Development) como princípio fundamental. Antes de implementar qualquer funcionalidade, os testes devem ser escritos e devem falhar.

---

## Visão Geral da Suíte

A suíte de testes é organizada em três camadas:

| Camada         | Ferramenta                     | O que cobre                    |
| -------------- | ------------------------------ | ------------------------------ |
| **Unit**       | Vitest + React Testing Library | _Hooks_, serviços, utilitários |
| **Componente** | Vitest + RTL + userEvent       | Componentes React isolados     |
| **E2E**        | Playwright + Chromium          | Fluxos completos do usuário    |

---

## Configuração do Ambiente

### Dependências

As ferramentas de teste já estão configuradas no `package.json`:

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@vitest/coverage-v8": "^3.2.4",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@playwright/test": "^1.58.2"
  }
}
```

### Arquivos de Configuração

- `vitest.config.ts` — Configuração do Vitest (ambiente jsdom, _globals_, setup)
- `playwright.config.ts` — Configuração do Playwright (browser, _webServer_, _reporters_)

---

## Comandos

| Comando              | Descrição                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `yarn test`          | Executa todos os testes unitários e de componente                |
| `yarn test:watch`    | Executa em modo _watch_ (re-execução automática ao salvar)       |
| `yarn test:coverage` | Executa com relatório de _coverage_ em `coverage/`               |
| `yarn test:e2e`      | Executa os testes E2E (Playwright abre Chromium automaticamente) |

---

## Testes Unitários de Serviço

Os testes de serviço validam a lógica de negócio isolada de _side effects_.

### Exemplo: storage.test.ts

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from './storage';

const STORAGE_KEY = 'ata-draft';

describe('storage', () => {
  beforeEach(() => {
    // Mock de localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it('deve salvar dados no localStorage', () => {
    const data = { sessionType: 'economica' as const };

    storage.save(STORAGE_KEY, data);

    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(data));
  });

  it('deve carregar dados do localStorage', () => {
    const saved = { sessionType: 'magna' as const };
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(saved));

    const result = storage.load(STORAGE_KEY);

    expect(result).toEqual(saved);
  });

  it('deve retornar null quando não há dados salvos', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const result = storage.load(STORAGE_KEY);

    expect(result).toBeNull();
  });

  it('deve remover dados do localStorage', () => {
    storage.remove(STORAGE_KEY);

    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('deve limpar todos os dados do localStorage', () => {
    storage.clear();

    expect(localStorage.clear).toHaveBeenCalled();
  });
});
```

---

## Testes Unitários de Hook

Os testes de _hook_ validam a lógica de estado dos _hooks_ customizados.

### Exemplo: useAtaState.test.ts

```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAtaState } from './useAtaState';
import { storage } from '../services/storage';

vi.mock('../services/storage', () => ({
  storage: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));

describe('useAtaState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.load).mockReturnValue(null);
  });

  it('deve iniciar com estado padrão', () => {
    const { result } = renderHook(() => useAtaState());

    expect(result.current.sessionType).toBe('economica');
    expect(result.current.officers.vm).toBe('');
  });

  it('deve atualizar o tipo de sessão', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.updateSessionType('magna');
    });

    expect(result.current.sessionType).toBe('magna');
  });

  it('deve restaurar estado persistido ao inicializar', () => {
    const saved = {
      sessionType: 'conjunta' as const,
      sessionConfig: {
        grau: 'Mestre' as const,
        numSessao: 42,
        dataISO: '2026-03-18',
        horaInicio: '19:00',
        horaEnc: '21:00',
        numPresenca: 15,
      },
      magnaFields: { tema: '', oradorConvidado: '', autoridades: '', atoEspecial: '' },
      visitors: [],
      officers: { vm: '', vig1: '', vig2: '', or: '', sec: '' },
      tronco: 0,
      ordemDia: '',
      pbo: { sul: '', norte: '', oriente: '' },
      lojaConfig: {
        logoDataUrl: null,
        nomeLoja: '',
        numeroLoja: '',
        dataFundacaoISO: '',
        temploNome: '',
        enderecoTemplo: '',
        cidadeEstado: '',
      },
      balaustreTexto: '',
      atosDecretosTexto: '',
      expedientesTexto: '',
      bolsaPropostasTexto: '',
    };

    vi.mocked(storage.load).mockReturnValue(saved);

    const { result } = renderHook(() => useAtaState());

    expect(result.current.sessionType).toBe('conjunta');
    expect(result.current.sessionConfig.numSessao).toBe(42);
  });
});
```

---

## Testes de Componente

Os testes de componente validam que a interface se comporta corretamente conforme a interação do usuário.

### Exemplo: Button.test.tsx

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('deve renderizar o texto do botão', () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Enviar</Button>);

    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando a prop disabled é true', () => {
    render(<Button disabled>Não clicável</Button>);

    expect(screen.getByRole('button', { name: /não clicável/i })).toBeDisabled();
  });
});
```

### Matchers Disponíveis

O projeto usa `@testing-library/jest-dom` para _matchers_ estendidos:

- `toBeInTheDocument()` — Verifica que o elemento existe no DOM
- `toHaveTextContent(text)` — Verifica o texto do elemento
- `toHaveValue(value)` — Verifica o valor de inputs
- `toBeDisabled()` / `toBeEnabled()` — Verifica estado de _disabled_
- `toHaveClass(className)` — Verifica classes CSS

---

## Testes E2E (End-to-End)

Os testes E2E validam fluxos completos do usuário usando Playwright com Chromium real.

### Estrutura

```
tests/
├── e2e/
│   ├── specs/           # Arquivos de especificação (*.spec.ts)
│   └── pages/           # Page Objects
```

### Page Objects

O projeto segue o padrão **Page Object Model**, onde cada página ou componente complexo tem uma classe que encapsula seus seletores e ações.

### Exemplo: Page Object

```typescript
// tests/e2e/pages/AppPage.ts
export class AppPage {
  constructor(private page: Page) {}

  get sidebar() {
    return this.page.locator('[data-testid="sidebar"]');
  }

  get previewContainer() {
    return this.page.locator('[data-testid="preview-container"]');
  }

  get title() {
    return this.page.locator('h1');
  }

  async goto() {
    await this.page.goto('/');
  }

  async selectSessionType(type: string) {
    await this.page.click(`button[data-session-type="${type}"]`);
  }
}
```

### Exemplo: Spec

```typescript
// tests/e2e/specs/smoke.spec.ts
import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/AppPage';

test.describe('Smoke Tests', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await appPage.goto();
  });

  test('a sidebar deve estar visível', async () => {
    await expect(appPage.sidebar).toBeVisible();
  });

  test('o preview deve estar visível', async () => {
    await expect(appPage.previewContainer).toBeVisible();
  });

  test('deve selecionar tipo de sessão Magna', async ({ page }) => {
    await appPage.selectSessionType('magna');

    await expect(page.locator('[data-testid="magna-fields"]')).toBeVisible();
  });
});
```

---

## Coverage

O _coverage_ de testes é gerado pelo `@vitest/coverage-v8`. Para executar com relatório:

```bash
yarn test:coverage
```

O relatório HTML é gerado em `coverage/` e pode ser aberto no navegador:

```bash
open coverage/index.html
```

---

## Adicionando Novos Testes

1. **Determine o tipo de teste**: unitário (serviço/hook) ou de componente
2. **Escreva o teste primeiro** (TDD): o teste deve falhar antes da implementação
3. **Implemente o código mínimo** para fazer o teste passar
4. **Refatore** se necessário, mantendo os testes verdes
5. **Execute `yarn test`** para confirmar que tudo está passando

### Checklist de Teste

- [ ] Teste cobre o comportamento esperado
- [ ] Teste falha antes da implementação (TDD)
- [ ] Mock de `localStorage` está configurado corretamente
- [ ] Mock de `storage` está configurado corretamente (se aplicável)
- [ ] Teste não depende de estado de outros testes
- [ ] Nome do teste é descritivo (`it('deve fazer X quando Y')`)

---

## Ver Também

- [Padrões de Código](Padroes-de-Codigo) — Convenções de implementação
- [Arquitetura](Arquitetura) — Estrutura do projeto

- [Build e Distribuição](Build-e-Distribuicao) — Como gerar builds e instaladores
