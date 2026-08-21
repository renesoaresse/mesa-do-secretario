import { contextBridge, ipcRenderer } from 'electron';

export const STORAGE_CHANNELS = {
  load: 'storage:load',
  save: 'storage:save',
  remove: 'storage:remove',
  clear: 'storage:clear',
} as const;

export const PDF_CHANNELS = {
  render: 'pdf:render',
  save: 'pdf:save',
} as const;

type DesktopStorageKey =
  | 'ataDraft'
  | 'officersConfig'
  | 'lojaConfig'
  | 'lojasCadastro'
  | 'obreiros'
  | 'gestoes';

type PdfSaveResult = { saved: boolean; filePath?: string };

export const electronApi = {
  storage: {
    load: <T>(key: DesktopStorageKey) =>
      ipcRenderer.sendSync(STORAGE_CHANNELS.load, key) as T | null,
    save: <T>(key: DesktopStorageKey, value: T) => {
      ipcRenderer.sendSync(STORAGE_CHANNELS.save, { key, value });
    },
    remove: (key: DesktopStorageKey) => {
      ipcRenderer.sendSync(STORAGE_CHANNELS.remove, key);
    },
    clear: () => {
      ipcRenderer.sendSync(STORAGE_CHANNELS.clear);
    },
  },
  // A senha nunca cruza a ponte: o processo principal só devolve o PDF cru e
  // grava os bytes que o renderer já criptografou.
  pdf: {
    render: () => ipcRenderer.invoke(PDF_CHANNELS.render) as Promise<Uint8Array | null>,
    save: (payload: { fileName: string; data: Uint8Array }) =>
      ipcRenderer.invoke(PDF_CHANNELS.save, payload) as Promise<PdfSaveResult>,
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronApi);
