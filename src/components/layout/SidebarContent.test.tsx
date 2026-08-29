import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  makeBolsaPropostas,
  makeMagnaFields,
  makeOfficers,
  makePbo,
  makeSessionConfig,
} from '../../test/factories';
import { MODULO_ESCOCES, MODULO_YORK } from '../../features/ata';
import { SidebarContent } from './SidebarContent';

vi.mock('../../features/session/components/SessionTypeSelector', () => ({
  SessionTypeSelector: () => <div>SessionTypeSelector</div>,
}));
vi.mock('../../features/session/components/SessionConfigForm', () => ({
  SessionConfigForm: () => <div>SessionConfigForm</div>,
}));
vi.mock('../../features/session/components/MagnaFieldsForm', () => ({
  MagnaFieldsForm: () => <div>MagnaFieldsForm</div>,
}));
vi.mock('../../features/visitors/components/VisitorsPanel', () => ({
  VisitorsPanel: () => <div>VisitorsPanel</div>,
}));
vi.mock('../../features/officers/components/OfficersForm', () => ({
  OfficersForm: () => <div>OfficersForm</div>,
}));
vi.mock('../../features/session/components/TroncoInput', () => ({
  TroncoInput: () => <div>TroncoInput</div>,
}));
vi.mock('../../features/palavra/components/PalavraBemDaOrdemPanel', () => ({
  PalavraBemDaOrdemPanel: () => <div>PalavraBemDaOrdemPanel</div>,
}));
vi.mock('../ui/FooterActions', () => ({
  FooterActions: () => <div>FooterActions</div>,
}));
vi.mock('../ui/LastSaveInfo', () => ({
  LastSaveInfo: () => <div>LastSaveInfo</div>,
}));
vi.mock('../../features/loja-config/components/LojaConfigForm', () => ({
  LojaConfigForm: () => <div>LojaConfigForm</div>,
}));
vi.mock('../../features/session/components/OpenTextSection', () => ({
  OpenTextSection: () => <div>OpenTextSection</div>,
}));
vi.mock('../../features/bolsa', () => ({
  BolsaPropostasPanel: () => <div>BolsaPropostasPanel</div>,
}));

const baseProps = {
  modulo: MODULO_ESCOCES,
  sessionType: 'economica' as const,
  lojas: [],
  lojasConjunta: [],
  onAddLojaConjunta: vi.fn(),
  onRemoveLojaConjunta: vi.fn(),
  onSetObreirosConjunta: vi.fn(),
  onCreateLoja: vi.fn(),
  obreiros: [],
  titulares: makeOfficers(),
  troncoSuprimido: false,
  onTroncoSuprimidoChange: vi.fn(),
  pboSuprimido: false,
  onPboSuprimidoChange: vi.fn(),
  onSessionTypeChange: vi.fn(),
  sessionConfig: makeSessionConfig(),
  onSessionConfigChange: vi.fn(),
  magnaFields: makeMagnaFields(),
  onMagnaFieldsChange: vi.fn(),
  visitors: [],
  onAddVisitor: vi.fn(),
  onRemoveVisitor: vi.fn(),
  officers: makeOfficers(),
  onOfficersChange: vi.fn(),
  tronco: 10,
  onTroncoChange: vi.fn(),
  ordemDia: 'Ordem',
  onOrdemDiaChange: vi.fn(),
  pbo: makePbo(),
  onPboChange: vi.fn(),
  onPrint: vi.fn(),
  onSave: vi.fn(),
  lastSavedAt: new Date('2026-03-18T19:45:00'),
  lojaConfig: {
    logoDataUrl: null,
    nomeLoja: 'Loja',
    rito: 'Rito Escocês Antigo e Aceito' as const,
    numeroLoja: '29',
    dataFundacaoISO: '2020-01-01',
    temploNome: 'Templo',
    enderecoTemplo: 'Rua',
    cidadeEstado: 'Aracaju/SE',
  },
  balaustreTexto: 'B',
  onBalaustreTextoChange: vi.fn(),
  atosDecretosTexto: 'A',
  onAtosDecretosTextoChange: vi.fn(),
  expedientesTexto: 'E',
  onExpedientesTextoChange: vi.fn(),
  pranchasTexto: 'P',
  onPranchasTextoChange: vi.fn(),
  atosTexto: 'AT',
  onAtosTextoChange: vi.fn(),
  decretosTexto: 'D',
  onDecretosTextoChange: vi.fn(),
  leituraAtasTexto: 'L',
  onLeituraAtasTextoChange: vi.fn(),
  pboTexto: 'PBO',
  onPboTextoChange: vi.fn(),
  bolsaPropostas: makeBolsaPropostas(),
  onBolsaPropostasChange: vi.fn(),
  onAddBolsaProposta: vi.fn(),
  onRemoveBolsaProposta: vi.fn(),
};

describe('SidebarContent', () => {
  it('renderiza drawers e componentes principais', () => {
    render(<SidebarContent {...baseProps} />);

    expect(screen.getByText('SessionTypeSelector')).toBeInTheDocument();
    expect(screen.getByText('SessionConfigForm')).toBeInTheDocument();
    expect(screen.getByText('OfficersForm')).toBeInTheDocument();
    expect(screen.getByText('VisitorsPanel')).toBeInTheDocument();
    expect(screen.getByText('BolsaPropostasPanel')).toBeInTheDocument();
    expect(screen.getByText('FooterActions')).toBeInTheDocument();
    expect(screen.getByText('LastSaveInfo')).toBeInTheDocument();
    expect(screen.queryByText(/documentos pdf/i)).not.toBeInTheDocument();
  });

  it('renderiza campos da sessao magna somente quando sessionType=magna', () => {
    const { rerender } = render(<SidebarContent {...baseProps} />);
    expect(screen.queryByText('MagnaFieldsForm')).not.toBeInTheDocument();

    rerender(<SidebarContent {...baseProps} sessionType="magna" />);
    expect(screen.getByText('MagnaFieldsForm')).toBeInTheDocument();
  });

  it('abre as secoes que o rito da loja pede, na ordem dele', () => {
    const { rerender } = render(<SidebarContent {...baseProps} />);

    expect(screen.getByText('Balaústre')).toBeInTheDocument();
    expect(screen.getByText('Bolsa de Propostas e Informações')).toBeInTheDocument();
    expect(screen.queryByText('Pranchas e Correspondências')).not.toBeInTheDocument();

    rerender(<SidebarContent {...baseProps} modulo={MODULO_YORK} />);

    expect(screen.getByText('Pranchas e Correspondências')).toBeInTheDocument();
    expect(screen.getByText('Leitura de Atas Anteriores')).toBeInTheDocument();
    expect(screen.queryByText('Balaústre')).not.toBeInTheDocument();
    expect(screen.queryByText('Bolsa de Propostas e Informações')).not.toBeInTheDocument();
  });
});
