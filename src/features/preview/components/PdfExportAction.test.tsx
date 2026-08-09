import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { PdfExportAction } from './PdfExportAction';
import { renderWithUser } from '../../../test/render';

function mockDesktop() {
  window.electronAPI = {
    storage: { load: vi.fn(), save: vi.fn(), remove: vi.fn(), clear: vi.fn() },
    pdf: { render: vi.fn(), save: vi.fn() },
  } as unknown as Window['electronAPI'];
}

afterEach(() => {
  delete window.electronAPI;
});

describe('PdfExportAction', () => {
  describe('no desktop', () => {
    beforeEach(mockDesktop);

    it('abre o modal de senha ao clicar no botao', async () => {
      const { user } = renderWithUser(<PdfExportAction fileName="ata-sessao-7.pdf" />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'PDF com senha' }));

      expect(screen.getByRole('dialog', { name: 'PDF com senha' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite a senha do PDF')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Repita a senha')).toBeInTheDocument();
    });

    it('descarta o que foi digitado ao reabrir o modal', async () => {
      const { user } = renderWithUser(<PdfExportAction fileName="ata-sessao-7.pdf" />);

      await user.click(screen.getByRole('button', { name: 'PDF com senha' }));
      await user.type(screen.getByPlaceholderText('Digite a senha do PDF'), 'segredo-123');
      await user.click(screen.getByRole('button', { name: 'Cancelar' }));

      await user.click(screen.getByRole('button', { name: 'PDF com senha' }));

      expect(screen.getByPlaceholderText('Digite a senha do PDF')).toHaveValue('');
    });
  });

  it('nao renderiza nada na versao web', () => {
    const { container } = renderWithUser(<PdfExportAction fileName="ata-sessao-7.pdf" />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: 'PDF com senha' })).not.toBeInTheDocument();
  });
});
