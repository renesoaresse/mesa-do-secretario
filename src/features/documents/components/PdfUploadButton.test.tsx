import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { PdfUploadButton } from './PdfUploadButton';

describe('PdfUploadButton', () => {
  it('faz upload do arquivo selecionado', async () => {
    const onPickFile = vi.fn();
    const { container, user } = renderWithUser(<PdfUploadButton onPickFile={onPickFile} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['conteudo'], 'ata.pdf', { type: 'application/pdf' });

    await user.upload(input, file);

    expect(onPickFile).toHaveBeenCalledWith(file);
    expect(input.value).toBe('');
  });

  it('desabilita o botao quando disabled=true', () => {
    renderWithUser(<PdfUploadButton onPickFile={vi.fn()} disabled />);
    expect(screen.getByRole('button', { name: /selecionar pdf/i })).toBeDisabled();
  });
});
