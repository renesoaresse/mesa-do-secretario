import type { AtaDraft, Loja, LojaConfig, Officers } from '../types/ata';
import type { DesktopStorageKey } from '../types/electron-api';

export const STORAGE_KEYS = {
  ataDraft: 'ataDraft',
  officersConfig: 'officersConfig',
  lojaConfig: 'lojaConfig',
  lojasCadastro: 'lojasCadastro',
} as const;

function isDesktopStorageKey(key: string): key is DesktopStorageKey {
  return (
    key === STORAGE_KEYS.ataDraft ||
    key === STORAGE_KEYS.officersConfig ||
    key === STORAGE_KEYS.lojaConfig ||
    key === STORAGE_KEYS.lojasCadastro
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
  return value === 'economica' || value === 'magna' ? value : fallback;
}

function getVisitors(value: unknown, fallback: AtaDraft['visitors']): AtaDraft['visitors'] {
  if (!Array.isArray(value)) return fallback;
  // Compat: versões antigas guardavam visitantes como string.
  return value
    .map((item) => {
      if (typeof item === 'string') {
        return { nome: item, lojaId: '', lojaNome: '', oriente: '', potencia: '' };
      }
      if (isRecord(item) && typeof item.nome === 'string') {
        return {
          nome: item.nome,
          lojaId: getString(item.lojaId, ''),
          lojaNome: getString(item.lojaNome, ''),
          oriente: getString(item.oriente, ''),
          potencia: getString(item.potencia, ''),
        };
      }
      return null;
    })
    .filter((item): item is AtaDraft['visitors'][number] => item !== null);
}

function getLojasConjunta(value: unknown, fallback: AtaDraft['lojasConjunta']) {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter(isRecord)
    .filter((item) => typeof item.id === 'string')
    .map((item) => ({
      id: item.id as string,
      nome: getString(item.nome, ''),
      obreiros: getNumber(item.obreiros, 0),
    }));
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

  // Migração: versões antigas guardavam "conjunta" como tipo de sessão.
  // Agora vira um flag booleano dentro do sessionConfig.
  const legacyConjunta = value.sessionType === 'conjunta';

  return {
    ...defaultDraft,
    sessionType: getSessionType(value.sessionType, defaultDraft.sessionType),
    sessionConfig: {
      ...defaultDraft.sessionConfig,
      ...sessionConfig,
      conjunta:
        typeof sessionConfig.conjunta === 'boolean'
          ? sessionConfig.conjunta
          : legacyConjunta || defaultDraft.sessionConfig.conjunta,
    },
    magnaFields: {
      ...defaultDraft.magnaFields,
      ...magnaFields,
    },
    visitors: getVisitors(value.visitors, defaultDraft.visitors),
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
    lojasConjunta: getLojasConjunta(value.lojasConjunta, defaultDraft.lojasConjunta),
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

function sanitizeLojas(value: unknown): Loja[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    id: getString(item.id, crypto.randomUUID()),
    nome: getString(item.nome, ''),
    oriente: getString(item.oriente, ''),
    potencia: getString(item.potencia, ''),
  }));
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

  loadLojas(defaultLojas: Loja[] = []): Loja[] {
    return sanitizeLojas(this.load<unknown>(STORAGE_KEYS.lojasCadastro, defaultLojas));
  },

  saveLojas(lojas: Loja[]): void {
    this.save<Loja[]>(STORAGE_KEYS.lojasCadastro, sanitizeLojas(lojas));
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
