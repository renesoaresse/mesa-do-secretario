export type DesktopStorageKey = 'officersConfig' | 'lojaConfig';

export interface ElectronStorageApi {
  load: <T>(key: DesktopStorageKey) => T | null;
  save: <T>(key: DesktopStorageKey, value: T) => void;
  remove: (key: DesktopStorageKey) => void;
  clear: () => void;
}

export interface ElectronApi {
  storage: ElectronStorageApi;
}

declare global {
  interface Window {
    electronAPI?: ElectronApi;
  }
}
