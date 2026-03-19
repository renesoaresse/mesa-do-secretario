import type { AtaDraft, LojaConfig, Officers } from '../types/ata';
import type { DesktopStorageKey } from '../types/electron-api';

export const STORAGE_KEYS = {
  ataDraft: 'ataDraft',
  officersConfig: 'officersConfig',
  lojaConfig: 'lojaConfig',
} as const;

function isDesktopStorageKey(key: string): key is DesktopStorageKey {
  return (
    key === STORAGE_KEYS.ataDraft ||
    key === STORAGE_KEYS.officersConfig ||
    key === STORAGE_KEYS.lojaConfig
  );
}

function getDesktopStorage() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.electronAPI?.storage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getRecord(value: unknown) {
  return isRecord(value) ? value : {};
}

function getString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function getNumber(value: unknown, fallback: number) {
  return typeof value === 'number' ? value : fallback;
}

function getSessionType(value: unknown, fallback: AtaDraft['sessionType']) {
  return value === 'economica' || value === 'magna' || value === 'conjunta' ? value : fallback;
}

function getStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : fallback;
}

function sanitizeAtaDraft(value: unknown, defaultDraft: AtaDraft): AtaDraft {
  if (!isRecord(value)) {
    return defaultDraft;
  }

  const sessionConfig = getRecord(value.sessionConfig);
  const magnaFields = getRecord(value.magnaFields);
  const officers = getRecord(value.officers);
  const pbo = getRecord(value.pbo);
  const lojaConfig = getRecord(value.lojaConfig);

  return {
    ...defaultDraft,
    sessionType: getSessionType(value.sessionType, defaultDraft.sessionType),
    sessionConfig: {
      ...defaultDraft.sessionConfig,
      ...sessionConfig,
    },
    magnaFields: {
      ...defaultDraft.magnaFields,
      ...magnaFields,
    },
    visitors: getStringArray(value.visitors, defaultDraft.visitors),
    officers: {
      ...defaultDraft.officers,
      ...officers,
    },
    tronco: getNumber(value.tronco, defaultDraft.tronco),
    ordemDia: getString(value.ordemDia, defaultDraft.ordemDia),
    pbo: {
      ...defaultDraft.pbo,
      ...pbo,
    },
    lojaConfig: {
      ...defaultDraft.lojaConfig,
      ...lojaConfig,
    },
    balaustreTexto: getString(value.balaustreTexto, defaultDraft.balaustreTexto),
    atosDecretosTexto: getString(value.atosDecretosTexto, defaultDraft.atosDecretosTexto),
    expedientesTexto: getString(value.expedientesTexto, defaultDraft.expedientesTexto),
    bolsaPropostasTexto: getString(value.bolsaPropostasTexto, defaultDraft.bolsaPropostasTexto),
  };
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

  saveAtaDraft(draft: AtaDraft): void {
    const sanitizedDraft = sanitizeAtaDraft(draft, draft);

    this.save(STORAGE_KEYS.ataDraft, sanitizedDraft);
    this.save<Officers>(STORAGE_KEYS.officersConfig, sanitizedDraft.officers);
    this.save<LojaConfig>(STORAGE_KEYS.lojaConfig, sanitizedDraft.lojaConfig);
  },

  loadAtaDraft(defaultDraft: AtaDraft): AtaDraft {
    const storedDraft = this.load<unknown>(STORAGE_KEYS.ataDraft, null);

    if (storedDraft) {
      return sanitizeAtaDraft(storedDraft, defaultDraft);
    }

    const legacyOfficers = this.load<Officers>(STORAGE_KEYS.officersConfig, defaultDraft.officers);
    const legacyLojaConfig = this.load<LojaConfig>(
      STORAGE_KEYS.lojaConfig,
      defaultDraft.lojaConfig,
    );

    return {
      ...defaultDraft,
      officers: {
        ...defaultDraft.officers,
        ...legacyOfficers,
      },
      lojaConfig: {
        ...defaultDraft.lojaConfig,
        ...legacyLojaConfig,
      },
    };
  },

  hasSavedAta(): boolean {
    const desktopStorage = getDesktopStorage();

    if (desktopStorage) {
      const data = desktopStorage.load<unknown>(STORAGE_KEYS.ataDraft);
      return data !== null;
    }

    return localStorage.getItem(STORAGE_KEYS.ataDraft) !== null;
  },
};
