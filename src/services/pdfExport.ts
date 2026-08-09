import { PDFDocument, PDFHeader } from '@cantoo/pdf-lib';

export type PdfExportResult =
  | { kind: 'saved'; filePath?: string }
  | { kind: 'canceled' }
  | { kind: 'unavailable' }
  | { kind: 'error'; message: string };

function getDesktopPdf() {
  if (typeof window === 'undefined') return undefined;
  return window.electronAPI?.pdf;
}

export function isPdfExportAvailable() {
  return getDesktopPdf() !== undefined;
}

/**
 * Recriptografa o PDF com a senha informada.
 *
 * O cabeçalho é elevado para 1.7 de propósito: o Chromium emite `%PDF-1.4`, que
 * levaria o handler padrão a cair em RC4-128. Com 1.7 o documento sai em AES-128,
 * que qualquer leitor atual abre.
 *
 * A senha só existe como argumento — nada aqui a persiste ou registra.
 */
export async function encryptPdf(pdfBytes: Uint8Array, password: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  pdfDoc.context.header = PDFHeader.forVersion(1, 7);
  pdfDoc.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: { printing: 'highResolution', copying: true, contentAccessibility: true },
  });

  return pdfDoc.save();
}

/**
 * Gera o PDF da ata (mesmo layout da impressão), criptografa e abre o
 * "Salvar como". A senha não sai do renderer nem é guardada em disco.
 */
export async function exportEncryptedPdf(
  password: string,
  fileName: string,
): Promise<PdfExportResult> {
  const pdf = getDesktopPdf();

  if (!pdf) {
    return { kind: 'unavailable' };
  }

  try {
    const rendered = await pdf.render();

    if (!rendered || rendered.byteLength === 0) {
      return { kind: 'error', message: 'Não foi possível gerar o PDF da ata.' };
    }

    const encrypted = await encryptPdf(rendered, password);
    const result = await pdf.save({ fileName, data: encrypted });

    return result.saved ? { kind: 'saved', filePath: result.filePath } : { kind: 'canceled' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha inesperada ao gerar o PDF.';
    return { kind: 'error', message };
  }
}

export function buildAtaFileName(numSessao: number) {
  const numero = Number.isFinite(numSessao) && numSessao > 0 ? String(numSessao) : 'sem-numero';
  return `ata-sessao-${numero}.pdf`;
}
