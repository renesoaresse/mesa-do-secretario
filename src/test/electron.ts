export type MockElectronStorage = {
  load: <T>(key: string) => T | null;
  save: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export function createMockElectronStorage(seed: Record<string, unknown> = {}): MockElectronStorage {
  const store = new Map<string, unknown>(Object.entries(seed));

  return {
    load: <T>(key: string) => (store.has(key) ? (store.get(key) as T) : null),
    save: <T>(key: string, value: T) => {
      store.set(key, value);
    },
    remove: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

export function installMockElectronApi(seed: Record<string, unknown> = {}) {
  const storage = createMockElectronStorage(seed);
  window.electronAPI = { storage };
  return storage;
}

export function removeMockElectronApi() {
  delete window.electronAPI;
}
