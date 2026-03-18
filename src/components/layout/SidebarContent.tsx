import React from 'react';

import { SessionTypeSelector } from '../../features/session/components/SessionTypeSelector';
import { SessionConfigForm } from '../../features/session/components/SessionConfigForm';
import { MagnaFieldsForm } from '../../features/session/components/MagnaFieldsForm';
import { VisitorsPanel } from '../../features/visitors/components/VisitorsPanel';
import { OfficersForm } from '../../features/officers/components/OfficersForm';
import { TroncoInput } from '../../features/session/components/TroncoInput';
import { PalavraBemDaOrdemPanel } from '../../features/palavra/components/PalavraBemDaOrdemPanel';
import { FooterActions } from '../ui/FooterActions';
import { LastSaveInfo } from '../ui/LastSaveInfo';
import { LojaConfigForm } from '../../features/loja-config/components/LojaConfigForm';
import type { LojaConfig } from '../../types/ata';

import type {
  DocumentDraft,
  Documento,
  MagnaFields,
  Officers,
  PalavraBemOrdem,
  SessionConfig,
  SessionType,
  StatusState,
} from '../../types/ata';
import { SidebarDrawer } from './SidebarDrawer';
import { OpenTextSection } from '../../features/session/components/OpenTextSection';

type Props = {
  sessionType: SessionType;
  onSessionTypeChange: (t: SessionType) => void;
  sessionConfig: SessionConfig;
  onSessionConfigChange: (patch: Partial<SessionConfig>) => void;
  magnaFields: MagnaFields;
  onMagnaFieldsChange: (patch: Partial<MagnaFields>) => void;
  docDraft: DocumentDraft;
  onDocDraftChange: (patch: Partial<DocumentDraft>) => void;
  documents: Documento[];
  docStatus: StatusState;
  onPickPdf: (file: File) => void;
  onAddDocument: () => void;
  onRemoveDocument: (id: string) => void;
  visitors: string[];
  onAddVisitor: (name: string) => void;
  onRemoveVisitor: (idx: number) => void;
  officers: Officers;
  onOfficersChange: (patch: Partial<Officers>) => void;
  tronco: number;
  onTroncoChange: (n: number) => void;
  ordemDia: string;
  onOrdemDiaChange: (s: string) => void;
  pbo: PalavraBemOrdem;
  onPboChange: (patch: Partial<PalavraBemOrdem>) => void;
  onPrint: () => void;
  onSave: () => void;
  lastSavedAt: Date | null;
  lojaConfig: LojaConfig;
  onLojaConfigChange: (patch: Partial<LojaConfig>) => void;
  balaustreTexto: string;
  onBalaustreTextoChange: (s: string) => void;
  atosDecretosTexto: string;
  onAtosDecretosTextoChange: (s: string) => void;
  expedientesTexto: string;
  onExpedientesTextoChange: (s: string) => void;
  bolsaPropostasTexto: string;
  onBolsaPropostasTextoChange: (s: string) => void;
};

export function SidebarContent(props: Props) {
  const isMagna = props.sessionType === 'magna';

  return (
    <>
      <SidebarDrawer title="Tipo de Sessão" icon="🗂" defaultOpen>
        <SessionTypeSelector value={props.sessionType} onChange={props.onSessionTypeChange} />
      </SidebarDrawer>
      <SidebarDrawer title="Configuração da Sessão" icon="⚙️" defaultOpen>
        <SessionConfigForm value={props.sessionConfig} onChange={props.onSessionConfigChange} />
      </SidebarDrawer>
      <SidebarDrawer title="Oficiais da Loja" icon="🏛" defaultOpen={false}>
        <OfficersForm value={props.officers} onChange={props.onOfficersChange} />
      </SidebarDrawer>

      {isMagna && (
        <SidebarDrawer title="Campos da Sessão Magna" icon="👑" defaultOpen={false}>
          <MagnaFieldsForm visible value={props.magnaFields} onChange={props.onMagnaFieldsChange} />
        </SidebarDrawer>
      )}

      <SidebarDrawer title="Balaústre" icon="📝" defaultOpen={false}>
        <OpenTextSection
          value={props.balaustreTexto}
          onChange={props.onBalaustreTextoChange}
          placeholder="Digite o texto do Balaústre..."
        />
      </SidebarDrawer>

      <SidebarDrawer title="Atos e Decretos" icon="📜" defaultOpen={false}>
        <OpenTextSection
          value={props.atosDecretosTexto}
          onChange={props.onAtosDecretosTextoChange}
          placeholder="Liste atos e decretos (um por linha, se quiser)..."
        />
      </SidebarDrawer>

      <SidebarDrawer title="Expedientes" icon="📌" defaultOpen={false}>
        <OpenTextSection
          value={props.expedientesTexto}
          onChange={props.onExpedientesTextoChange}
          placeholder="Digite os expedientes..."
        />
      </SidebarDrawer>

      <SidebarDrawer title="Bolsa de Propostas e Informações" icon="💬" defaultOpen={false}>
        <OpenTextSection
          value={props.bolsaPropostasTexto}
          onChange={props.onBolsaPropostasTextoChange}
          placeholder="Digite os registros da Bolsa de Propostas e Informações..."
        />
      </SidebarDrawer>

      <SidebarDrawer title="Ordem do Dia" icon="📋" defaultOpen={false}>
        <OpenTextSection
          value={props.ordemDia}
          onChange={props.onOrdemDiaChange}
          placeholder="Digite o texto da Ordem do dia..."
        />
      </SidebarDrawer>
      <SidebarDrawer title="Tronco de Beneficência" icon="💰" defaultOpen={false}>
        <TroncoInput value={props.tronco} onChange={props.onTroncoChange} />
      </SidebarDrawer>
      <SidebarDrawer title="Visitantes" icon="👥" defaultOpen={false}>
        <VisitorsPanel
          items={props.visitors}
          onAdd={props.onAddVisitor}
          onRemove={props.onRemoveVisitor}
        />
      </SidebarDrawer>
      <SidebarDrawer title="Palavra a Bem da Ordem" icon="🗣" defaultOpen={false}>
        <PalavraBemDaOrdemPanel value={props.pbo} onChange={props.onPboChange} />
      </SidebarDrawer>

      <SidebarDrawer title="Configuração da Loja" icon="⚙️" defaultOpen>
        <LojaConfigForm value={props.lojaConfig} onChange={props.onLojaConfigChange} />
      </SidebarDrawer>

      <FooterActions onPrint={props.onPrint} onSave={props.onSave} />
      <LastSaveInfo lastSavedAt={props.lastSavedAt} />
    </>
  );
}
