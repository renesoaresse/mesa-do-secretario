import type { DesktopStorageKey } from '../types/electron-api';

function isDesktopStorageKey(key: string): key is DesktopStorageKey {
  return key === 'officersConfig' || key === 'lojaConfig';
}

function getDesktopStorage() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.electronAPI?.storage;
}

export const storage = {
  hasDesktopBridge(): boolean {
    return Boolean(getDesktopStorage());
  },

  save<T>(key: string, value: T): void {
    try {
      const desktopStorage = getDesktopStorage();

      if (desktopStorage && isDesktopStorageKey(key)) {
        desktopStorage.save(key, value);
        return;
      }

      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if localStorage is full or unavailable
    }
  },

  load<T>(key: string, defaultValue: T): T {
    try {
      const desktopStorage = getDesktopStorage();

      if (desktopStorage && isDesktopStorageKey(key)) {
        return desktopStorage.load<T>(key) ?? defaultValue;
      }

      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  },

  remove(key: string): void {
    const desktopStorage = getDesktopStorage();

    if (desktopStorage && isDesktopStorageKey(key)) {
      desktopStorage.remove(key);
      return;
    }

    localStorage.removeItem(key);
  },

  clear(): void {
    const desktopStorage = getDesktopStorage();

    if (desktopStorage) {
      desktopStorage.clear();
      return;
    }

    localStorage.clear();
  },
};
