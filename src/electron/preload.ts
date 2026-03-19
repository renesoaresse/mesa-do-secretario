import { contextBridge, ipcRenderer } from 'electron';

export const STORAGE_CHANNELS = {
  load: 'storage:load',
  save: 'storage:save',
  remove: 'storage:remove',
  clear: 'storage:clear',
} as const;

type DesktopStorageKey = 'ataDraft' | 'officersConfig' | 'lojaConfig';

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
};

contextBridge.exposeInMainWorld('electronAPI', electronApi);
