import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('deve renderizar com texto fornecido', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('deve aplicar a classe btn-primary quando variant="primary"', () => {
    render(<Button variant="primary">Primário</Button>);
    const btn = screen.getByRole('button', { name: /primário/i });
    expect(btn).toHaveClass('btn-primary');
  });

  it('deve aplicar a classe btn-secondary por padrão', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button', { name: /default/i });
    expect(btn).toHaveClass('btn-secondary');
  });

  it('deve chamar onClick quando clicado', async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => (clicked = true)}>Click</Button>);
    await user.click(screen.getByRole('button', { name: /click/i }));
    expect(clicked).toBe(true);
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });
});
