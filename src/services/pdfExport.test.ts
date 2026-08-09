import { afterEach, describe, expect, it, vi } from 'vitest';
import { PDFDocument } from '@cantoo/pdf-lib';
import {
  buildAtaFileName,
  encryptPdf,
  exportEncryptedPdf,
  isPdfExportAvailable,
} from './pdfExport';

async function criarPdfSimples() {
  const doc = await PDFDocument.create();
  doc.addPage();
  return doc.save();
}

function mockDesktopPdf(overrides: {
  render?: () => Promise<Uint8Array | null>;
  save?: (payload: { fileName: string; data: Uint8Array }) => Promise<{
    saved: boolean;
    filePath?: string;
  }>;
}) {
  const render = vi.fn(overrides.render ?? (async () => new Uint8Array()));
  const save = vi.fn(overrides.save ?? (async () => ({ saved: true })));

  window.electronAPI = {
    storage: { load: vi.fn(), save: vi.fn(), remove: vi.fn(), clear: vi.fn() },
    pdf: { render, save },
  } as unknown as Window['electronAPI'];

  return { render, save };
}

afterEach(() => {
  delete window.electronAPI;
});

describe('encryptPdf', () => {
  it('protege o PDF com a senha informada', async () => {
    const encrypted = await encryptPdf(await criarPdfSimples(), 'segredo-123');

    await expect(PDFDocument.load(encrypted)).rejects.toThrow();
    await expect(PDFDocument.load(encrypted, { password: 'segredo-123' })).resolves.toBeInstanceOf(
      PDFDocument,
    );
  });

  it('usa AES (PDF 1.7) em vez do RC4 herdado do cabecalho do Chromium', async () => {
    const encrypted = await encryptPdf(await criarPdfSimples(), 'segredo-123');
    const header = new TextDecoder().decode(encrypted.subarray(0, 8));

    expect(header).toBe('%PDF-1.7');
  });
});

describe('exportEncryptedPdf', () => {
  it('avisa quando a ponte do desktop nao existe', async () => {
    expect(isPdfExportAvailable()).toBe(false);
    await expect(exportEncryptedPdf('segredo-123', 'ata.pdf')).resolves.toEqual({
      kind: 'unavailable',
    });
  });

  it('renderiza, criptografa e envia para o dialogo de salvar', async () => {
    const original = await criarPdfSimples();
    const { render, save } = mockDesktopPdf({
      render: async () => original,
      save: async () => ({ saved: true, filePath: '/tmp/ata.pdf' }),
    });

    await expect(exportEncryptedPdf('segredo-123', 'ata-sessao-7.pdf')).resolves.toEqual({
      kind: 'saved',
      filePath: '/tmp/ata.pdf',
    });

    expect(render).toHaveBeenCalledTimes(1);

    const payload = save.mock.calls[0]?.[0];
    expect(payload?.fileName).toBe('ata-sessao-7.pdf');
    await expect(PDFDocument.load(payload!.data)).rejects.toThrow();
    await expect(
      PDFDocument.load(payload!.data, { password: 'segredo-123' }),
    ).resolves.toBeInstanceOf(PDFDocument);
  });

  it('reporta cancelamento quando o usuario fecha o dialogo', async () => {
    mockDesktopPdf({
      render: async () => await criarPdfSimples(),
      save: async () => ({ saved: false }),
    });

    await expect(exportEncryptedPdf('segredo-123', 'ata.pdf')).resolves.toEqual({
      kind: 'canceled',
    });
  });

  it('reporta erro quando a renderizacao volta vazia', async () => {
    mockDesktopPdf({ render: async () => null });

    await expect(exportEncryptedPdf('segredo-123', 'ata.pdf')).resolves.toEqual({
      kind: 'error',
      message: 'Não foi possível gerar o PDF da ata.',
    });
  });

  it('reporta erro quando a ponte falha', async () => {
    mockDesktopPdf({
      render: async () => {
        throw new Error('printToPDF indisponivel');
      },
    });

    await expect(exportEncryptedPdf('segredo-123', 'ata.pdf')).resolves.toEqual({
      kind: 'error',
      message: 'printToPDF indisponivel',
    });
  });
});

describe('buildAtaFileName', () => {
  it('usa o numero da sessao', () => {
    expect(buildAtaFileName(7)).toBe('ata-sessao-7.pdf');
  });

  it('cai para um nome generico quando nao ha numero', () => {
    expect(buildAtaFileName(0)).toBe('ata-sessao-sem-numero.pdf');
  });
});
