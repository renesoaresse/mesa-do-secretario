export type DesktopStorageKey = 'ataDraft' | 'officersConfig' | 'lojaConfig' | 'lojasCadastro';

export interface ElectronStorageApi {
  load: <T>(key: DesktopStorageKey) => T | null;
  save: <T>(key: DesktopStorageKey, value: T) => void;
  remove: (key: DesktopStorageKey) => void;
  clear: () => void;
}

export interface PdfSaveResult {
  saved: boolean;
  filePath?: string;
}

export interface ElectronPdfApi {
  /** Renderiza a janela atual em PDF usando a mesma folha de estilo da impressão. */
  render: () => Promise<Uint8Array | null>;
  /** Abre o diálogo de "Salvar como" e grava os bytes já criptografados. */
  save: (payload: { fileName: string; data: Uint8Array }) => Promise<PdfSaveResult>;
}

export interface ElectronApi {
  storage: ElectronStorageApi;
  pdf: ElectronPdfApi;
}

declare global {
  interface Window {
    electronAPI?: ElectronApi;
  }
}
