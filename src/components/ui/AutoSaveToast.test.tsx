import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AutoSaveToast } from './AutoSaveToast';

describe('AutoSaveToast', () => {
  it('nao renderiza quando visible=false', () => {
    const { container } = render(<AutoSaveToast visible={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza a mensagem quando visible=true', () => {
    render(<AutoSaveToast visible />);
    expect(screen.getByText(/alterações salvas automaticamente/i)).toBeInTheDocument();
  });
});
