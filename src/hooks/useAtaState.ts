import { useEffect, useMemo, useState } from 'react';
import { storage } from '../services/storage';
import {
  aplicarSufixoAdHoc,
  gestaoVigente,
  titularesDosOficiais,
} from '../features/loja-config/data/oficiais';
import type {
  AtaDraft,
  BolsaProposta,
  BolsaPropostas,
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

export const DEFAULT_LOJA_CONFIG: LojaConfig = {
  logoDataUrl: null,
  nomeLoja: '',
  rito: '',
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
  numerarLinhas: false,
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

const DEFAULT_BOLSA_PROPOSTAS: BolsaPropostas = {
  totalColunas: 0,
  itens: [],
  texto: '',
  suprimida: false,
};

const DEFAULT_ATA_DRAFT: AtaDraft = {
  sessionType: 'economica',
  sessionConfig: DEFAULT_SESSION_CONFIG,
  magnaFields: DEFAULT_MAGNA_FIELDS,
  visitors: [],
  officers: DEFAULT_OFFICERS,
  tronco: 0,
  troncoSuprimido: false,
  ordemDia: '',
  pbo: DEFAULT_PBO,
  pboSuprimido: false,
  lojasConjunta: [],
  lojaConfig: DEFAULT_LOJA_CONFIG,
  balaustreTexto: '',
  atosDecretosTexto: '',
  expedientesTexto: '',
  bolsaPropostas: DEFAULT_BOLSA_PROPOSTAS,
};

export function useAtaState() {
  const initialDraft = storage.loadAtaDraft(DEFAULT_ATA_DRAFT);
  const quadroObreiros = storage.loadObreiros();
  // Titulares da gestão vigente: preenchem os oficiais e definem quem é ad hoc.
  const titulares = titularesDosOficiais(
    gestaoVigente(storage.loadGestoes()),
    quadroObreiros,
    initialDraft.lojaConfig.rito,
  );
  // Cada cargo ainda em branco herda o titular da gestão; o que já foi digitado fica.
  const officersIniciais = (Object.keys(initialDraft.officers) as (keyof Officers)[]).reduce(
    (acc, oficial) => {
      acc[oficial] = initialDraft.officers[oficial] || titulares[oficial];
      return acc;
    },
    { ...initialDraft.officers },
  );

  const [zoom, setZoom] = useState(1);
  const [sessionType, setSessionType] = useState<SessionType>(initialDraft.sessionType);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(initialDraft.sessionConfig);
  const [magnaFields, setMagnaFields] = useState<MagnaFields>(initialDraft.magnaFields);
  const [visitors, setVisitors] = useState<Visitor[]>(initialDraft.visitors);
  const [officers, setOfficers] = useState<Officers>(officersIniciais);
  const [tronco, setTronco] = useState(initialDraft.tronco);
  const [troncoSuprimido, setTroncoSuprimido] = useState(initialDraft.troncoSuprimido);
  const [ordemDia, setOrdemDia] = useState(initialDraft.ordemDia);
  const [pbo, setPbo] = useState<PalavraBemOrdem>(initialDraft.pbo);
  const [pboSuprimido, setPboSuprimido] = useState(initialDraft.pboSuprimido);
  const [lojasConjunta, setLojasConjunta] = useState<LojaConjunta[]>(initialDraft.lojasConjunta);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [autoSaveVisible, setAutoSaveVisible] = useState(false);
  const [lojaConfig, setLojaConfig] = useState<LojaConfig>(initialDraft.lojaConfig);
  const [balaustreTexto, setBalaustreTexto] = useState(initialDraft.balaustreTexto);
  const [atosDecretosTexto, setAtosDecretosTexto] = useState(initialDraft.atosDecretosTexto);
  const [expedientesTexto, setExpedientesTexto] = useState(initialDraft.expedientesTexto);
  const [bolsaPropostas, setBolsaPropostas] = useState<BolsaPropostas>(initialDraft.bolsaPropostas);

  const currentDraft = useMemo<AtaDraft>(
    () => ({
      sessionType,
      sessionConfig,
      magnaFields,
      visitors,
      officers,
      tronco,
      troncoSuprimido,
      ordemDia,
      pbo,
      pboSuprimido,
      lojasConjunta,
      lojaConfig,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostas,
    }),
    [
      sessionType,
      sessionConfig,
      magnaFields,
      visitors,
      officers,
      tronco,
      troncoSuprimido,
      ordemDia,
      pbo,
      pboSuprimido,
      lojasConjunta,
      lojaConfig,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostas,
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

  const updateBolsaPropostas = (patch: Partial<BolsaPropostas>) => {
    setBolsaPropostas((state) => ({ ...state, ...patch }));
    markChanged();
  };

  const addBolsaProposta = (item: BolsaProposta) => {
    setBolsaPropostas((state) => ({ ...state, itens: [...state.itens, item] }));
    markChanged();
  };

  const removeBolsaProposta = (id: string) => {
    setBolsaPropostas((state) => ({
      ...state,
      itens: state.itens.filter((item) => item.id !== id),
    }));
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
      officers: aplicarSufixoAdHoc(officers, titulares),
      tronco,
      troncoSuprimido,
      ordemDia,
      pbo,
      pboSuprimido,
      lojasConjunta,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostas,
    }),
    [
      titulares,
      lojaConfig,
      sessionType,
      sessionConfig,
      magnaFields,
      visitors,
      officers,
      tronco,
      troncoSuprimido,
      ordemDia,
      pbo,
      pboSuprimido,
      lojasConjunta,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostas,
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
    troncoSuprimido,
    ordemDia,
    pbo,
    pboSuprimido,
    lojasConjunta,
    lastSavedAt,
    autoSaveVisible,
    lojaConfig,
    balaustreTexto,
    atosDecretosTexto,
    expedientesTexto,
    bolsaPropostas,
    previewData,
    setZoom,
    setSessionType,
    setTronco: (value: number) => {
      setTronco(value);
      markChanged();
    },
    setTroncoSuprimido: (value: boolean) => {
      setTroncoSuprimido(value);
      markChanged();
    },
    setPboSuprimido: (value: boolean) => {
      setPboSuprimido(value);
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
    updateSessionConfig,
    updateMagnaFields,
    updateOfficers,
    updateLojaConfig,
    updatePbo,
    updateBolsaPropostas,
    addBolsaProposta,
    removeBolsaProposta,
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
