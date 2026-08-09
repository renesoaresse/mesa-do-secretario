import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { PdfPasswordModal } from './PdfPasswordModal';
import { renderWithUser } from '../../../test/render';
import * as pdfExport from '../../../services/pdfExport';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderModal(onClose = vi.fn()) {
  return {
    onClose,
    ...renderWithUser(<PdfPasswordModal open fileName="ata-sessao-7.pdf" onClose={onClose} />),
  };
}

function getSenhaInput() {
  return screen.getByPlaceholderText('Digite a senha do PDF');
}

function getConfirmacaoInput() {
  return screen.getByPlaceholderText('Repita a senha');
}

describe('PdfPasswordModal', () => {
  it('mantem as senhas ocultas por padrao', () => {
    renderModal();

    expect(getSenhaInput()).toHaveAttribute('type', 'password');
    expect(getConfirmacaoInput()).toHaveAttribute('type', 'password');
  });

  it('alterna a visibilidade de cada campo pelo botao de olho', async () => {
    const { user } = renderModal();

    await user.click(screen.getByRole('button', { name: /mostrar senha/i }));
    expect(getSenhaInput()).toHaveAttribute('type', 'text');
    expect(getConfirmacaoInput()).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /ocultar senha/i }));
    expect(getSenhaInput()).toHaveAttribute('type', 'password');
  });

  it('so habilita Gerar quando as duas senhas sao iguais', async () => {
    const { user } = renderModal();
    const gerar = screen.getByRole('button', { name: 'Gerar' });

    expect(gerar).toBeDisabled();

    await user.type(getSenhaInput(), 'segredo-123');
    expect(gerar).toBeDisabled();

    await user.type(getConfirmacaoInput(), 'segredo-124');
    expect(gerar).toBeDisabled();
    expect(screen.getByText('As senhas não conferem.')).toBeInTheDocument();

    await user.clear(getConfirmacaoInput());
    await user.type(getConfirmacaoInput(), 'segredo-123');
    expect(gerar).toBeEnabled();
  });

  it('gera o PDF com a senha informada e fecha o modal', async () => {
    const exportSpy = vi
      .spyOn(pdfExport, 'exportEncryptedPdf')
      .mockResolvedValue({ kind: 'saved', filePath: '/tmp/ata-sessao-7.pdf' });

    const { user, onClose } = renderModal();

    await user.type(getSenhaInput(), 'segredo-123');
    await user.type(getConfirmacaoInput(), 'segredo-123');
    await user.click(screen.getByRole('button', { name: 'Gerar' }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(exportSpy).toHaveBeenCalledWith('segredo-123', 'ata-sessao-7.pdf');
  });

  it('limpa os campos apos gerar, sem deixar a senha no DOM', async () => {
    vi.spyOn(pdfExport, 'exportEncryptedPdf').mockResolvedValue({
      kind: 'error',
      message: 'Falhou',
    });

    const { user } = renderModal();

    await user.type(getSenhaInput(), 'segredo-123');
    await user.type(getConfirmacaoInput(), 'segredo-123');
    await user.click(screen.getByRole('button', { name: 'Gerar' }));

    await waitFor(() => expect(screen.getByText('Falhou')).toBeInTheDocument());
    expect(getSenhaInput()).toHaveValue('');
    expect(getConfirmacaoInput()).toHaveValue('');
  });

  it('avisa quando a exportacao nao esta disponivel fora do desktop', async () => {
    vi.spyOn(pdfExport, 'exportEncryptedPdf').mockResolvedValue({ kind: 'unavailable' });

    const { user } = renderModal();

    await user.type(getSenhaInput(), 'segredo-123');
    await user.type(getConfirmacaoInput(), 'segredo-123');
    await user.click(screen.getByRole('button', { name: 'Gerar' }));

    await waitFor(() =>
      expect(
        screen.getByText(
          'A exportação de PDF com senha está disponível apenas no aplicativo desktop.',
        ),
      ).toBeInTheDocument(),
    );
  });

  it('Cancelar apenas fecha o modal, sem gerar nada', async () => {
    const exportSpy = vi.spyOn(pdfExport, 'exportEncryptedPdf');
    const { user, onClose } = renderModal();

    await user.type(getSenhaInput(), 'segredo-123');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(exportSpy).not.toHaveBeenCalled();
  });

  it('nao persiste a senha em nenhum storage', async () => {
    vi.spyOn(pdfExport, 'exportEncryptedPdf').mockResolvedValue({ kind: 'saved' });
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    const { user } = renderModal();

    await user.type(getSenhaInput(), 'segredo-123');
    await user.type(getConfirmacaoInput(), 'segredo-123');
    await user.click(screen.getByRole('button', { name: 'Gerar' }));

    await waitFor(() => expect(pdfExport.exportEncryptedPdf).toHaveBeenCalled());

    const gravado = setItem.mock.calls.map(([, value]) => String(value)).join('|');
    expect(gravado).not.toContain('segredo-123');
    expect(window.sessionStorage.length).toBe(0);
  });
});
