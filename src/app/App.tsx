import React, { useMemo, useState } from "react";

/* =========================
   Layout
========================= */
import { AppLayout } from "../components/layout/AppLayout";
import { Sidebar } from "../components/layout/Sidebar";
import { MainPreview } from "../components/layout/MainPreview";

/* =========================
   Header / Indicators
========================= */
import { SidebarHeader } from "../components/sidebar/SidebarHeader";
import { SessionIndicator } from "../components/indicators/SessionIndicator";
import { AutoSaveToast } from "../components/feedback/AutoSaveToast";

/* =========================
   Sidebar composition
========================= */
import { SidebarContent } from "../components/sidebar/SidebarContent";

/* =========================
   Types
========================= */
import type {
  DocumentDraft,
  Documento,
  MagnaFields,
  Officers,
  PalavraBemOrdem,
  SessionConfig,
  SessionType,
  StatusState,
  LojaConfig,
} from "../types/ata";

/* =========================
   Styles
========================= */
import "../styles/index.css";

/* =========================
   Helpers
========================= */
function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* =========================
   App
========================= */
export default function App() {
  // Preview
  const [zoom, setZoom] = useState(1);

  // Session
  const [sessionType, setSessionType] = useState<SessionType>("economica");
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    grau: "Aprendiz",
    numSessao: 0,
    dataISO: "",
    horaInicio: "",
    horaEnc: "",
    numPresenca: 0,
  });

  const [magnaFields, setMagnaFields] = useState<MagnaFields>({
    tema: "",
    oradorConvidado: "",
    autoridades: "",
    atoEspecial: "",
  });

  // Documents
  const [docDraft, setDocDraft] = useState<DocumentDraft>({
    type: "Prancha/Edital",
    number: "",
    origin: "",
    subject: "",
  });

  const [documents, setDocuments] = useState<Documento[]>([]);
  const [docStatus, setDocStatus] = useState<StatusState>(null);

  // Visitors
  const [visitors, setVisitors] = useState<string[]>([]);

  // Officers
  const [officers, setOfficers] = useState<Officers>(() => {
    const raw = localStorage.getItem("officersConfig");
    if (raw) {
      try {
        return JSON.parse(raw) as Officers;
      } catch {}
    }
    return {
      vm: "",
      vig1: "",
      vig2: "",
      or: "",
      sec: "",
    };
  });

  // Others
  const [tronco, setTronco] = useState(0);
  const [ordemDia, setOrdemDia] = useState("");
  const [pbo, setPbo] = useState<PalavraBemOrdem>({
    sul: "Irmãos do Sul",
    norte: "Irmãos do Norte",
    oriente: "Irmãos do Oriente",
  });

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [autoSaveVisible, setAutoSaveVisible] = useState(false);

    const [lojaConfig, setLojaConfig] = useState<LojaConfig>(() => {
    const raw = localStorage.getItem("lojaConfig");
    if (raw) {
      try {
        return JSON.parse(raw) as LojaConfig;
      } catch {}
    }
    return {
      logoDataUrl: null,
      nomeLoja: "",
      numeroLoja: "",
      dataFundacaoISO: "",
      temploNome: "",
      enderecoTemplo: "",
      cidadeEstado: "",
    };
  });

  const persistLojaConfig = (next: LojaConfig) => {
    localStorage.setItem("lojaConfig", JSON.stringify(next));
  };

  const persistOfficersConfig = (next: LojaConfig) => {
    localStorage.setItem("officersConfig", JSON.stringify(next));
  };

  const [balaustreTexto, setBalaustreTexto] = useState("");
  const [atosDecretosTexto, setAtosDecretosTexto] = useState("");
  const [expedientesTexto, setExpedientesTexto] = useState("");
  const [bolsaPropostasTexto, setBolsaPropostasTexto] = useState("");

  /* =========================
     Helpers / Handlers (mock)
  ========================= */
  const markChanged = () => {
    setLastSavedAt(new Date());
    setAutoSaveVisible(true);
    window.setTimeout(() => setAutoSaveVisible(false), 1200);
  };

  const onPickPdf = (file: File) => {
    setDocStatus({ kind: "info", text: `PDF selecionado (mock): ${file.name}` });
    markChanged();
  };

  const handleAddDocument = () => {
    const number = docDraft.number.trim();
    const origin = docDraft.origin.trim();
    const subject = docDraft.subject.trim();

    if (!number || !origin || !subject) {
      setDocStatus({ kind: "error", text: "Preencha todos os campos do documento." });
      return;
    }

    setDocuments((prev) => [
      { id: uid(), type: docDraft.type, number, origin, subject },
      ...prev,
    ]);

    setDocDraft((d) => ({ ...d, number: "", origin: "", subject: "" }));
    setDocStatus({ kind: "success", text: "Documento adicionado." });
    markChanged();
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setDocStatus({ kind: "info", text: "Documento removido." });
    markChanged();
  };

  const handleAddVisitor = (name: string) => {
    setVisitors((prev) => [name, ...prev]);
    markChanged();
  };

  const handleRemoveVisitor = (idx: number) => {
    setVisitors((prev) => prev.filter((_, i) => i !== idx));
    markChanged();
  };

  const handlePrint = () => window.print();

  const handleSave = () => {
    setDocStatus({ kind: "success", text: "Salvo (mock)." });
    markChanged();
  };

  /* =========================
     Preview mock
  ========================= */
  const previewData = useMemo(
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
    ]
  );

  /* =========================
     Render
  ========================= */
  return (
    <>
      <AppLayout
        sidebar={
          <Sidebar
            header={
              <SidebarHeader
                title="Gerador de Ata"
                badgeText={<SessionIndicator sessionType={sessionType} />}
                counterText={`Contador: ${sessionConfig.numSessao} - v${__APP_VERSION__}`}
              />
            }
            footer={<AutoSaveToast visible={autoSaveVisible} />}
          >
            <SidebarContent
              sessionType={sessionType}
              onSessionTypeChange={(t) => {
                setSessionType(t);
                markChanged();
              }}
              sessionConfig={sessionConfig}
              onSessionConfigChange={(patch) => {
                setSessionConfig((s) => ({ ...s, ...patch }));
                markChanged();
              }}
              magnaFields={magnaFields}
              onMagnaFieldsChange={(patch) => {
                setMagnaFields((m) => ({ ...m, ...patch }));
                markChanged();
              }}
              docDraft={docDraft}
              onDocDraftChange={(patch) => setDocDraft((d) => ({ ...d, ...patch }))}
              documents={documents}
              docStatus={docStatus}
              onPickPdf={onPickPdf}
              onAddDocument={handleAddDocument}
              onRemoveDocument={handleRemoveDocument}
              visitors={visitors}
              onAddVisitor={handleAddVisitor}
              onRemoveVisitor={handleRemoveVisitor}
              officers={officers}
              onOfficersChange={(patch) => {
                setOfficers((s) => {
                  const next = { ...s, ...patch };
                  persistOfficersConfig(next);
                  return next;
                });
                markChanged();
              }}
              tronco={tronco}
              onTroncoChange={(n) => {
                setTronco(n);
                markChanged();
              }}
              ordemDia={ordemDia}
              onOrdemDiaChange={(s) => {
                setOrdemDia(s);
                markChanged();
              }}
              pbo={pbo}
              onPboChange={(patch) => {
                setPbo((x) => ({ ...x, ...patch }));
                markChanged();
              }}
              onPrint={handlePrint}
              onSave={handleSave}
              lastSavedAt={lastSavedAt}
              lojaConfig={lojaConfig}
              onLojaConfigChange={(patch) => {
                setLojaConfig((s) => {
                  const next = { ...s, ...patch };
                  persistLojaConfig(next);
                  return next;
                });
                markChanged();
              }}
              balaustreTexto={balaustreTexto}
              onBalaustreTextoChange={(s) => { setBalaustreTexto(s); markChanged(); }}

              atosDecretosTexto={atosDecretosTexto}
              onAtosDecretosTextoChange={(s) => { setAtosDecretosTexto(s); markChanged(); }}

              expedientesTexto={expedientesTexto}
              onExpedientesTextoChange={(s) => { setExpedientesTexto(s); markChanged(); }}

              bolsaPropostasTexto={bolsaPropostasTexto}
              onBolsaPropostasTextoChange={(s) => { setBolsaPropostasTexto(s); markChanged(); }}
            />
          </Sidebar>
        }
        main={
          <MainPreview
            sessionType={sessionType}
            zoom={zoom}
            onZoomChange={setZoom}
            dataDocument={previewData}
          />
        }
      />
    </>
  );
}
