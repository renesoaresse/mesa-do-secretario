import { useMemo, useState } from 'react';
import { storage } from '../services/storage';
import type {
  DocumentDraft,
  Documento,
  LojaConfig,
  MagnaFields,
  Officers,
  PalavraBemOrdem,
  PreviewData,
  SessionConfig,
  SessionType,
  StatusState,
} from '../types/ata';

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

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

export function useAtaState() {
  // Preview
  const [zoom, setZoom] = useState(1);

  // Session
  const [sessionType, setSessionType] = useState<SessionType>('economica');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    grau: 'Aprendiz',
    numSessao: 0,
    dataISO: '',
    horaInicio: '',
    horaEnc: '',
    numPresenca: 0,
  });

  const [magnaFields, setMagnaFields] = useState<MagnaFields>({
    tema: '',
    oradorConvidado: '',
    autoridades: '',
    atoEspecial: '',
  });

  // Documents
  const [docDraft, setDocDraft] = useState<DocumentDraft>({
    type: 'Prancha/Edital',
    number: '',
    origin: '',
    subject: '',
  });
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [docStatus, setDocStatus] = useState<StatusState>(null);

  // Visitors
  const [visitors, setVisitors] = useState<string[]>([]);

  // Officers (persisted)
  const [officers, setOfficers] = useState<Officers>(() =>
    storage.load<Officers>('officersConfig', DEFAULT_OFFICERS),
  );

  // Others
  const [tronco, setTronco] = useState(0);
  const [ordemDia, setOrdemDia] = useState('');
  const [pbo, setPbo] = useState<PalavraBemOrdem>({
    sul: 'Irmãos do Sul',
    norte: 'Irmãos do Norte',
    oriente: 'Irmãos do Oriente',
  });

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [autoSaveVisible, setAutoSaveVisible] = useState(false);

  // Loja config (persisted)
  const [lojaConfig, setLojaConfig] = useState<LojaConfig>(() =>
    storage.load<LojaConfig>('lojaConfig', DEFAULT_LOJA_CONFIG),
  );

  // Open text sections
  const [balaustreTexto, setBalaustreTexto] = useState('');
  const [atosDecretosTexto, setAtosDecretosTexto] = useState('');
  const [expedientesTexto, setExpedientesTexto] = useState('');
  const [bolsaPropostasTexto, setBolsaPropostasTexto] = useState('');

  // Helpers
  const markChanged = () => {
    setLastSavedAt(new Date());
    setAutoSaveVisible(true);
    window.setTimeout(() => setAutoSaveVisible(false), 1200);
  };

  // Handlers
  const updateOfficers = (patch: Partial<Officers>) => {
    setOfficers((s) => {
      const next = { ...s, ...patch };
      storage.save('officersConfig', next);
      return next;
    });
    markChanged();
  };

  const updateLojaConfig = (patch: Partial<LojaConfig>) => {
    setLojaConfig((s) => {
      const next = { ...s, ...patch };
      storage.save('lojaConfig', next);
      return next;
    });
    markChanged();
  };

  const addDocument = (draft: DocumentDraft) => {
    const { number, origin, subject } = draft;
    if (!number.trim() || !origin.trim() || !subject.trim()) {
      setDocStatus({ kind: 'error', text: 'Preencha todos os campos do documento.' });
      return;
    }
    setDocuments((prev) => [
      {
        id: uid(),
        type: draft.type,
        number: number.trim(),
        origin: origin.trim(),
        subject: subject.trim(),
      },
      ...prev,
    ]);
    setDocDraft((d) => ({ ...d, number: '', origin: '', subject: '' }));
    setDocStatus({ kind: 'success', text: 'Documento adicionado.' });
    markChanged();
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setDocStatus({ kind: 'info', text: 'Documento removido.' });
    markChanged();
  };

  const addVisitor = (name: string) => {
    setVisitors((prev) => [name, ...prev]);
    markChanged();
  };

  const removeVisitor = (idx: number) => {
    setVisitors((prev) => prev.filter((_, i) => i !== idx));
    markChanged();
  };

  const updateSessionConfig = (patch: Partial<SessionConfig>) => {
    setSessionConfig((s) => ({ ...s, ...patch }));
    markChanged();
  };

  const updateMagnaFields = (patch: Partial<MagnaFields>) => {
    setMagnaFields((m) => ({ ...m, ...patch }));
    markChanged();
  };

  const updatePbo = (patch: Partial<PalavraBemOrdem>) => {
    setPbo((x) => ({ ...x, ...patch }));
    markChanged();
  };

  const onPickPdf = (file: File) => {
    setDocStatus({ kind: 'info', text: `PDF selecionado (mock): ${file.name}` });
    markChanged();
  };

  const handlePrint = () => window.print();

  const handleSave = () => {
    setDocStatus({
      kind: 'success',
      text: storage.hasDesktopBridge() ? 'Salvo com integração segura.' : 'Salvo (mock).',
    });
    markChanged();
  };

  // Preview data (memoized)
  const previewData: PreviewData = useMemo(
    () => ({
      lojaConfig,
      sessionType,
      sessionConfig,
      magnaFields,
      documents,
      visitors,
      officers,
      tronco,
      ordemDia,
      pbo,
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
      documents,
      visitors,
      officers,
      tronco,
      ordemDia,
      pbo,
      balaustreTexto,
      atosDecretosTexto,
      expedientesTexto,
      bolsaPropostasTexto,
    ],
  );

  return {
    // State
    zoom,
    sessionType,
    sessionConfig,
    magnaFields,
    docDraft,
    documents,
    docStatus,
    visitors,
    officers,
    tronco,
    ordemDia,
    pbo,
    lastSavedAt,
    autoSaveVisible,
    lojaConfig,
    balaustreTexto,
    atosDecretosTexto,
    expedientesTexto,
    bolsaPropostasTexto,
    previewData,

    // Setters
    setZoom,
    setSessionType,
    setDocDraft,
    setTronco: (n: number) => {
      setTronco(n);
      markChanged();
    },
    setOrdemDia: (s: string) => {
      setOrdemDia(s);
      markChanged();
    },
    setBalaustreTexto: (s: string) => {
      setBalaustreTexto(s);
      markChanged();
    },
    setAtosDecretosTexto: (s: string) => {
      setAtosDecretosTexto(s);
      markChanged();
    },
    setExpedientesTexto: (s: string) => {
      setExpedientesTexto(s);
      markChanged();
    },
    setBolsaPropostasTexto: (s: string) => {
      setBolsaPropostasTexto(s);
      markChanged();
    },

    // Handlers
    updateSessionConfig,
    updateMagnaFields,
    updateOfficers,
    updateLojaConfig,
    updatePbo,
    addDocument,
    removeDocument,
    addVisitor,
    removeVisitor,
    onPickPdf,
    handlePrint,
    handleSave,
    markChanged,
  };
}
