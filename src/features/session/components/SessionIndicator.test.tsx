import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SessionIndicator } from './SessionIndicator';

describe('SessionIndicator', () => {
  it.each([
    ['economica', 'Sessão Econômica'],
    ['magna', 'Sessão Magna'],
    ['conjunta', 'Sessão Conjunta'],
  ] as const)('renderiza o label correto para %s', (type, label) => {
    render(<SessionIndicator sessionType={type} />);
    expect(screen.getByLabelText(/indicador de tipo de sessão/i)).toHaveTextContent(label);
  });
});
