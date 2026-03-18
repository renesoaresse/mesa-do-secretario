import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusMessage } from './StatusMessage';

describe('StatusMessage', () => {
  it('nao renderiza quando status e null', () => {
    const { container } = render(<StatusMessage status={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza mensagem com role status e classe do tipo', () => {
    render(<StatusMessage status={{ kind: 'success', text: 'Tudo certo' }} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Tudo certo');
    expect(status).toHaveClass('status', 'success');
  });
});
