import type {
  AtaDraft,
  Gestao,
  GrauObreiro,
  Loja,
  LojaConfig,
  Obreiro,
  Officers,
} from '../types/ata';
import type { DesktopStorageKey } from '../types/electron-api';

export const STORAGE_KEYS = {
  ataDraft: 'ataDraft',
  officersConfig: 'officersConfig',
  lojaConfig: 'lojaConfig',
  lojasCadastro: 'lojasCadastro',
  obreiros: 'obreiros',
  gestoes: 'gestoes',
} as const;

function isDesktopStorageKey(key: string): key is DesktopStorageKey {
  return (
    key === STORAGE_KEYS.ataDraft ||
    key === STORAGE_KEYS.officersConfig ||
    key === STORAGE_KEYS.lojaConfig ||
    key === STORAGE_KEYS.lojasCadastro ||
    key === STORAGE_KEYS.obreiros ||
    key === STORAGE_KEYS.gestoes
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

function getBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function getRito(value: unknown, fallback: LojaConfig['rito']): LojaConfig['rito'] {
  const ritos: LojaConfig['rito'][] = [
    '',
    'Rito Escocês Antigo e Aceito',
    'Rito Adonhiramita',
    'Rito de York',
    'Rito de Emulação',
  ];

  return ritos.includes(value as LojaConfig['rito']) ? (value as LojaConfig['rito']) : fallback;
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
      numerarLinhas:
        typeof sessionConfig.numerarLinhas === 'boolean'
          ? sessionConfig.numerarLinhas
          : defaultDraft.sessionConfig.numerarLinhas,
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
    troncoSuprimido: getBoolean(value.troncoSuprimido, defaultDraft.troncoSuprimido),
    ordemDia: getString(value.ordemDia, defaultDraft.ordemDia),
    pbo: {
      ...defaultDraft.pbo,
      ...pbo,
    },
    pboSuprimido: getBoolean(value.pboSuprimido, defaultDraft.pboSuprimido),
    lojasConjunta: getLojasConjunta(value.lojasConjunta, defaultDraft.lojasConjunta),
    lojaConfig: {
      ...defaultDraft.lojaConfig,
      ...lojaConfig,
      rito: getRito(lojaConfig.rito, defaultDraft.lojaConfig.rito),
    },
    balaustreTexto: getString(value.balaustreTexto, defaultDraft.balaustreTexto),
    atosDecretosTexto: getString(value.atosDecretosTexto, defaultDraft.atosDecretosTexto),
    expedientesTexto: getString(value.expedientesTexto, defaultDraft.expedientesTexto),
    bolsaPropostasTexto: getString(value.bolsaPropostasTexto, defaultDraft.bolsaPropostasTexto),
  };
}

const GRAUS_OBREIRO: GrauObreiro[] = ['AP∴M∴', 'CP∴M∴', 'M∴M∴', 'M∴M∴I∴'];

function getGrauObreiro(value: unknown): GrauObreiro {
  return GRAUS_OBREIRO.includes(value as GrauObreiro) ? (value as GrauObreiro) : GRAUS_OBREIRO[0];
}

function sanitizeObreiros(value: unknown): Obreiro[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    id: getString(item.id, crypto.randomUUID()),
    nome: getString(item.nome, '').toUpperCase(),
    cim: getString(item.cim, ''),
    grau: getGrauObreiro(item.grau),
  }));
}

function sanitizeGestoes(value: unknown): Gestao[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    id: getString(item.id, crypto.randomUUID()),
    ano: getString(item.ano, '').replace(/\D/g, '').slice(0, 4),
    vigente: getBoolean(item.vigente, false),
    atribuicoes: Array.isArray(item.atribuicoes)
      ? item.atribuicoes
          .filter(isRecord)
          .filter((atribuicao) => typeof atribuicao.obreiroId === 'string')
          .map((atribuicao) => ({
            obreiroId: atribuicao.obreiroId as string,
            cargo: getString(atribuicao.cargo, ''),
          }))
      : [],
  }));
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

  loadObreiros(): Obreiro[] {
    return sanitizeObreiros(this.load<unknown>(STORAGE_KEYS.obreiros, []));
  },

  saveObreiros(obreiros: Obreiro[]): void {
    this.save<Obreiro[]>(STORAGE_KEYS.obreiros, sanitizeObreiros(obreiros));
  },

  loadGestoes(): Gestao[] {
    return sanitizeGestoes(this.load<unknown>(STORAGE_KEYS.gestoes, []));
  },

  saveGestoes(gestoes: Gestao[]): void {
    this.save<Gestao[]>(STORAGE_KEYS.gestoes, sanitizeGestoes(gestoes));
  },

  loadLojaConfig(defaultConfig: LojaConfig): LojaConfig {
    // O rascunho da ata é a fonte da verdade quando existe; a chave avulsa
    // atende instalações antigas e o primeiro acesso.
    const storedDraft = this.load<unknown>(STORAGE_KEYS.ataDraft, null);
    const draftLojaConfig = isRecord(storedDraft) ? getRecord(storedDraft.lojaConfig) : null;

    if (draftLojaConfig) {
      return {
        ...defaultConfig,
        ...draftLojaConfig,
        rito: getRito(draftLojaConfig.rito, defaultConfig.rito),
      };
    }

    const storedLojaConfig = getRecord(this.load<unknown>(STORAGE_KEYS.lojaConfig, null));

    return {
      ...defaultConfig,
      ...storedLojaConfig,
      rito: getRito(storedLojaConfig.rito, defaultConfig.rito),
    };
  },

  saveLojaConfig(lojaConfig: LojaConfig): void {
    this.save<LojaConfig>(STORAGE_KEYS.lojaConfig, lojaConfig);

    // Mantém o rascunho da ata sincronizado para a pré-visualização usar os dados novos.
    const storedDraft = this.load<unknown>(STORAGE_KEYS.ataDraft, null);

    if (isRecord(storedDraft)) {
      this.save(STORAGE_KEYS.ataDraft, { ...storedDraft, lojaConfig });
    }
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
