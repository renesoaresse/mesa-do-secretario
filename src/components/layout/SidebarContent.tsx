import type { ReactNode } from 'react';
import { SessionTypeSelector } from '../../features/session/components/SessionTypeSelector';
import { SessionConfigForm } from '../../features/session/components/SessionConfigForm';
import { SessionConjuntaForm } from '../../features/session/components/SessionConjuntaForm';
import { MagnaFieldsForm } from '../../features/session/components/MagnaFieldsForm';
import { VisitorsPanel } from '../../features/visitors/components/VisitorsPanel';
import { OfficersForm } from '../../features/officers/components/OfficersForm';
import { TroncoInput } from '../../features/session/components/TroncoInput';
import { PalavraBemDaOrdemPanel } from '../../features/palavra/components/PalavraBemDaOrdemPanel';
import { PalavraBemDaOrdemLivre } from '../../features/palavra/components/PalavraBemDaOrdemLivre';
import { FooterActions } from '../ui/FooterActions';
import { PdfExportAction } from '../../features/preview/components/PdfExportAction';
import { buildAtaFileName } from '../../services/pdfExport';
import { LastSaveInfo } from '../ui/LastSaveInfo';
import { BolsaPropostasPanel } from '../../features/bolsa';
import type { ModuloAta, SecaoAta } from '../../features/ata';
import type {
  BolsaProposta,
  BolsaPropostas,
  Loja,
  LojaConfig,
  LojaConjunta,
  Visitor,
} from '../../types/ata';
import type { ObreiroComCargo } from '../../features/loja-config/data/oficiais';

import type {
  MagnaFields,
  Officers,
  PalavraBemOrdem,
  SessionConfig,
  SessionType,
} from '../../types/ata';
import { SidebarDrawer } from './SidebarDrawer';
import { OpenTextSection } from '../../features/session/components/OpenTextSection';

type Props = {
  /** Módulo do rito da loja: define quais seções aparecem e em que ordem. */
  modulo: ModuloAta;
  sessionType: SessionType;
  onSessionTypeChange: (t: SessionType) => void;
  sessionConfig: SessionConfig;
  onSessionConfigChange: (patch: Partial<SessionConfig>) => void;
  lojas: Loja[];
  lojasConjunta: LojaConjunta[];
  onAddLojaConjunta: (id: string, nome: string) => void;
  onRemoveLojaConjunta: (id: string) => void;
  onSetObreirosConjunta: (id: string, obreiros: number) => void;
  onCreateLoja: (input: Omit<Loja, 'id'>) => Loja;
  magnaFields: MagnaFields;
  onMagnaFieldsChange: (patch: Partial<MagnaFields>) => void;
  visitors: Visitor[];
  onAddVisitor: (visitor: Visitor) => void;
  onRemoveVisitor: (idx: number) => void;
  officers: Officers;
  onOfficersChange: (patch: Partial<Officers>) => void;
  tronco: number;
  onTroncoChange: (n: number) => void;
  troncoSuprimido: boolean;
  onTroncoSuprimidoChange: (suprimido: boolean) => void;
  ordemDia: string;
  onOrdemDiaChange: (s: string) => void;
  pbo: PalavraBemOrdem;
  onPboChange: (patch: Partial<PalavraBemOrdem>) => void;
  pboSuprimido: boolean;
  onPboSuprimidoChange: (suprimido: boolean) => void;
  /** Presente apenas no desktop: volta para a tela principal. */
  onBack?: () => void;
  onPrint: () => void;
  onSave: () => void;
  lastSavedAt: Date | null;
  lojaConfig: LojaConfig;
  /** Quadro de obreiros anotado com o cargo de cada um na gestão vigente. */
  obreiros: ObreiroComCargo[];
  /** Titular de cada cargo segundo a gestão vigente. */
  titulares: Officers;
  balaustreTexto: string;
  onBalaustreTextoChange: (s: string) => void;
  atosDecretosTexto: string;
  onAtosDecretosTextoChange: (s: string) => void;
  expedientesTexto: string;
  onExpedientesTextoChange: (s: string) => void;
  pranchasTexto: string;
  onPranchasTextoChange: (s: string) => void;
  atosTexto: string;
  onAtosTextoChange: (s: string) => void;
  decretosTexto: string;
  onDecretosTextoChange: (s: string) => void;
  leituraAtasTexto: string;
  onLeituraAtasTextoChange: (s: string) => void;
  pboTexto: string;
  onPboTextoChange: (s: string) => void;
  bolsaPropostas: BolsaPropostas;
  onBolsaPropostasChange: (patch: Partial<BolsaPropostas>) => void;
  onAddBolsaProposta: (item: BolsaProposta) => void;
  onRemoveBolsaProposta: (id: string) => void;
};

type Secao = {
  title: string;
  icon: string;
  content: ReactNode;
};

export function SidebarContent(props: Props) {
  const isMagna = props.sessionType === 'magna';
  const isConjunta = props.sessionConfig.conjunta;

  const secoes: Record<SecaoAta, Secao> = {
    oficiais: {
      title: 'Oficiais da Loja',
      icon: '🏛',
      content: (
        <OfficersForm
          value={props.officers}
          oficiais={props.modulo.oficiais}
          rito={props.lojaConfig.rito}
          obreiros={props.obreiros}
          titulares={props.titulares}
          onChange={props.onOfficersChange}
        />
      ),
    },
    balaustre: {
      title: 'Balaústre',
      icon: '📝',
      content: (
        <OpenTextSection
          value={props.balaustreTexto}
          onChange={props.onBalaustreTextoChange}
          placeholder="Digite o texto do Balaústre..."
        />
      ),
    },
    atosDecretos: {
      title: 'Atos e Decretos',
      icon: '📜',
      content: (
        <OpenTextSection
          value={props.atosDecretosTexto}
          onChange={props.onAtosDecretosTextoChange}
          placeholder="Liste atos e decretos (um por linha, se quiser)..."
        />
      ),
    },
    pranchas: {
      title: 'Pranchas e Correspondências',
      icon: '✉️',
      content: (
        <OpenTextSection
          value={props.pranchasTexto}
          onChange={props.onPranchasTextoChange}
          placeholder="Ex.: Prancha nº 200 - assunto da prancha"
        />
      ),
    },
    atos: {
      title: 'Atos',
      icon: '📜',
      content: (
        <OpenTextSection
          value={props.atosTexto}
          onChange={props.onAtosTextoChange}
          placeholder="Digite os atos apresentados na sessão..."
        />
      ),
    },
    decretos: {
      title: 'Decretos',
      icon: '⚖️',
      content: (
        <OpenTextSection
          value={props.decretosTexto}
          onChange={props.onDecretosTextoChange}
          placeholder="Digite os decretos apresentados na sessão..."
        />
      ),
    },
    leituraAtas: {
      title: 'Leitura de Atas Anteriores',
      icon: '📖',
      content: (
        <OpenTextSection
          value={props.leituraAtasTexto}
          onChange={props.onLeituraAtasTextoChange}
          placeholder="Registre a leitura das atas anteriores..."
        />
      ),
    },
    expedientes: {
      title: 'Expedientes',
      icon: '📌',
      content: (
        <OpenTextSection
          value={props.expedientesTexto}
          onChange={props.onExpedientesTextoChange}
          placeholder="Digite os expedientes..."
        />
      ),
    },
    bolsaPropostas: {
      title: 'Bolsa de Propostas e Informações',
      icon: '💬',
      content: (
        <BolsaPropostasPanel
          value={props.bolsaPropostas}
          obreiros={props.obreiros}
          lojas={props.lojas}
          lojaConfig={props.lojaConfig}
          onChange={props.onBolsaPropostasChange}
          onAddItem={props.onAddBolsaProposta}
          onRemoveItem={props.onRemoveBolsaProposta}
          onCreateLoja={props.onCreateLoja}
        />
      ),
    },
    ordemDia: {
      title: 'Ordem do Dia',
      icon: '📋',
      content: (
        <OpenTextSection
          value={props.ordemDia}
          onChange={props.onOrdemDiaChange}
          placeholder="Digite o texto da Ordem do dia..."
        />
      ),
    },
    tronco: {
      title: 'Tronco de Beneficência',
      icon: '💰',
      content: (
        <TroncoInput
          value={props.tronco}
          onChange={props.onTroncoChange}
          suprimido={props.troncoSuprimido}
          onSuprimidoChange={props.onTroncoSuprimidoChange}
        />
      ),
    },
    visitantes: {
      title: 'Visitantes',
      icon: '👥',
      content: (
        <VisitorsPanel
          items={props.visitors}
          lojas={props.lojas}
          lojaConfig={props.lojaConfig}
          onAdd={props.onAddVisitor}
          onRemove={props.onRemoveVisitor}
          onCreateLoja={props.onCreateLoja}
        />
      ),
    },
    pbo: {
      title: 'Palavra a Bem da Ordem',
      icon: '🗣',
      content: (
        <PalavraBemDaOrdemPanel
          value={props.pbo}
          onChange={props.onPboChange}
          suprimido={props.pboSuprimido}
          onSuprimidoChange={props.onPboSuprimidoChange}
        />
      ),
    },
    pboLivre: {
      title: 'Palavra a Bem da Ordem',
      icon: '🗣',
      content: (
        <PalavraBemDaOrdemLivre
          value={props.pboTexto}
          onChange={props.onPboTextoChange}
          suprimida={props.pboSuprimido}
          onSuprimidaChange={props.onPboSuprimidoChange}
        />
      ),
    },
  };

  return (
    <>
      <SidebarDrawer title="Tipo de Sessão" icon="🗂" defaultOpen>
        <SessionTypeSelector value={props.sessionType} onChange={props.onSessionTypeChange} />
      </SidebarDrawer>
      <SidebarDrawer title="Configuração da Sessão" icon="⚙️" defaultOpen>
        <SessionConfigForm value={props.sessionConfig} onChange={props.onSessionConfigChange} />
      </SidebarDrawer>
      {isConjunta && (
        <SidebarDrawer title="Sessão Conjunta" icon="🤝" defaultOpen>
          <SessionConjuntaForm
            lojas={props.lojas}
            selected={props.lojasConjunta}
            lojaConfig={props.lojaConfig}
            onAdd={props.onAddLojaConjunta}
            onRemove={props.onRemoveLojaConjunta}
            onSetObreiros={props.onSetObreirosConjunta}
            onCreateLoja={props.onCreateLoja}
          />
        </SidebarDrawer>
      )}

      {isMagna && (
        <SidebarDrawer title="Campos da Sessão Magna" icon="👑" defaultOpen={false}>
          <MagnaFieldsForm visible value={props.magnaFields} onChange={props.onMagnaFieldsChange} />
        </SidebarDrawer>
      )}

      {/* Da abertura ao fecho, na ordem em que o rito da loja pede as seções. */}
      {props.modulo.secoes.map((chave) => {
        const secao = secoes[chave];

        return (
          <SidebarDrawer key={chave} title={secao.title} icon={secao.icon} defaultOpen={false}>
            {secao.content}
          </SidebarDrawer>
        );
      })}

      <FooterActions
        onBack={props.onBack}
        onPrint={props.onPrint}
        onSave={props.onSave}
        pdfAction={<PdfExportAction fileName={buildAtaFileName(props.sessionConfig.numSessao)} />}
      />
      <LastSaveInfo lastSavedAt={props.lastSavedAt} />
    </>
  );
}
