import { useEffect, useMemo, useState } from 'react';
import { storage } from '../services/storage';
import type {
  AtaDraft,
  LojaConfig,
  LojaConjunta,
  MagnaFields,
  Officers,
  PalavraBemOrdem,
  PreviewData,
  SessionConfig,
  SessionType,
  Visitor,
} from '../types/ata';

const DEFAULT_OFFICERS: Officers = { vm: '', vig1: '', vig2: '', or: '', sec: '' };

const DEFAULT_LOJA_CONFIG: LojaConfig = {
  logoDataUrl: null,
  nomeLoja: '',
  numeroLoja: '',
  dataFundacaoISO: '',
  temploNome: '',
  enderecoTemplo: '',
  cidadeEstado: '',
};

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  grau: 'Aprendiz',
  numSessao: 0,
  dataISO: '',
  horaInicio: '',
  horaEnc: '',
  numPresenca: 0,
  conjunta: false,
};

const DEFAULT_MAGNA_FIELDS: MagnaFields = {
  tema: '',
  oradorConvidado: '',
  autoridades: '',
  atoEspecial: '',
};

const DEFAULT_PBO: PalavraBemOrdem = {
  sul: 'Irmãos do Sul',
  norte: 'Irmãos do Norte',
  oriente: 'Irmãos do Oriente',
};

const DEFAULT_ATA_DRAFT: AtaDraft = {
  sessionType: 'economica',
  sessionConfig: DEFAULT_SESSION_CONFIG,
  magnaFields: DEFAULT_MAGNA_FIELDS,
  visitors: [],
  officers: DEFAULT_OFFICERS,
  tronco: 0,
  ordemDia: '',
  pbo: DEFAULT_PBO,
  lojasConjunta: [],
  lojaConfig: DEFAULT_LOJA_CONFIG,
  balaustreTexto: '',
  atosDecretosTexto: '',
  expedientesTexto: '',
  bolsaPropostasTexto: '',
};

export function useAtaState() {
  const initialDraft = storage.loadAtaDraft(DEFAULT_ATA_DRAFT);

  const [zoom, setZoom] = useState(1);
  const [sessionType, setSessionType] = useState<SessionType>(initialDraft.sessionType);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(initialDraft.sessionConfig);
  const [magnaFields, setMagnaFields] = useState<MagnaFields>(initialDraft.magnaFields);
  const [visitors, setVisitors] = useState<Visitor[]>(initialDraft.visitors);
  const [officers, setOfficers] = useState<Officers>(initialDraft.officers);
  const [tronco, setTronco] = useState(initialDraft.tronco);
  const [ordemDia, setOrdemDia] = useState(initialDraft.ordemDia);
  const [pbo, setPbo] = useState<PalavraBemOrdem>(initialDraft.pbo);
  const [lojasConjunta, setLojasConjunta] = useState<LojaConjunta[]>(initialDraft.lojasConjunta);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [autoSaveVisible, setAutoSaveVisible] = useState(false);
  const [lojaConfig, setLojaConfig] = useState<LojaConfig>(initialDraft.lojaConfig);
  const [balaustreTexto, setBalaustreTexto] = useState(initialDraft.balaustreTexto);
  const [atosDecretosTexto, setAtosDecretosTexto] = useState(initialDraft.atosDecretosTexto);
  const [expedientesTexto, setExpedientesTexto] = useState(initialDraft.expedientesTexto);
  const [bolsaPropostasTexto, setBolsaPropostasTexto] = useState(initialDraft.bolsaPropostasTexto);

  const currentDraft = useMemo<AtaDraft>(
    () => ({
      sessionType,
      sessionConfig,
      magnaFields,
      visitors,
      officers,
      tronco,
      ordemDia,
      pbo,
      lojasConjunta,
      lojaConfig,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostasTexto,
    }),
    [
      sessionType,
      sessionConfig,
      magnaFields,
      visitors,
      officers,
      tronco,
      ordemDia,
      pbo,
      lojasConjunta,
      lojaConfig,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostasTexto,
    ],
  );

  useEffect(() => {
    storage.saveAtaDraft(currentDraft);
  }, [currentDraft]);

  const markChanged = () => {
    setLastSavedAt(new Date());
    setAutoSaveVisible(true);
    window.setTimeout(() => setAutoSaveVisible(false), 1200);
  };

  const updateOfficers = (patch: Partial<Officers>) => {
    setOfficers((state) => ({ ...state, ...patch }));
    markChanged();
  };

  const updateLojaConfig = (patch: Partial<LojaConfig>) => {
    setLojaConfig((state) => ({ ...state, ...patch }));
    markChanged();
  };

  const addVisitor = (visitor: Visitor) => {
    setVisitors((prev) => [visitor, ...prev]);
    markChanged();
  };

  const removeVisitor = (idx: number) => {
    setVisitors((prev) => prev.filter((_, i) => i !== idx));
    markChanged();
  };

  const updateSessionConfig = (patch: Partial<SessionConfig>) => {
    setSessionConfig((state) => ({ ...state, ...patch }));
    markChanged();
  };

  const updateMagnaFields = (patch: Partial<MagnaFields>) => {
    setMagnaFields((state) => ({ ...state, ...patch }));
    markChanged();
  };

  const updatePbo = (patch: Partial<PalavraBemOrdem>) => {
    setPbo((state) => ({ ...state, ...patch }));
    markChanged();
  };

  const addLojaConjunta = (id: string, nome: string) => {
    setLojasConjunta((prev) =>
      prev.some((item) => item.id === id) ? prev : [...prev, { id, nome, obreiros: 0 }],
    );
    markChanged();
  };

  const removeLojaConjunta = (id: string) => {
    setLojasConjunta((prev) => prev.filter((item) => item.id !== id));
    markChanged();
  };

  const setObreirosConjunta = (id: string, obreiros: number) => {
    setLojasConjunta((prev) => prev.map((item) => (item.id === id ? { ...item, obreiros } : item)));
    markChanged();
  };

  const handlePrint = () => window.print();

  const handleSave = () => {
    storage.saveAtaDraft(currentDraft);
    markChanged();
  };

  const previewData: PreviewData = useMemo(
    () => ({
      lojaConfig,
      sessionType,
      sessionConfig,
      magnaFields,
      visitors,
      officers,
      tronco,
      ordemDia,
      pbo,
      lojasConjunta,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostasTexto,
    }),
    [
      lojaConfig,
      sessionType,
      sessionConfig,
      magnaFields,
      visitors,
      officers,
      tronco,
      ordemDia,
      pbo,
      lojasConjunta,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostasTexto,
    ],
  );

  return {
    zoom,
    sessionType,
    sessionConfig,
    magnaFields,
    visitors,
    officers,
    tronco,
    ordemDia,
    pbo,
    lojasConjunta,
    lastSavedAt,
    autoSaveVisible,
    lojaConfig,
    balaustreTexto,
    atosDecretosTexto,
    expedientesTexto,
    bolsaPropostasTexto,
    previewData,
    setZoom,
    setSessionType,
    setTronco: (value: number) => {
      setTronco(value);
      markChanged();
    },
    setOrdemDia: (value: string) => {
      setOrdemDia(value);
      markChanged();
    },
    setBalaustreTexto: (value: string) => {
      setBalaustreTexto(value);
      markChanged();
    },
    setAtosDecretosTexto: (value: string) => {
      setAtosDecretosTexto(value);
      markChanged();
    },
    setExpedientesTexto: (value: string) => {
      setExpedientesTexto(value);
      markChanged();
    },
    setBolsaPropostasTexto: (value: string) => {
      setBolsaPropostasTexto(value);
      markChanged();
    },
    updateSessionConfig,
    updateMagnaFields,
    updateOfficers,
    updateLojaConfig,
    updatePbo,
    addLojaConjunta,
    removeLojaConjunta,
    setObreirosConjunta,
    addVisitor,
    removeVisitor,
    handlePrint,
    handleSave,
    markChanged,
  };
}
