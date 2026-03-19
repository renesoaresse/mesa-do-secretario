import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeMagnaFields, makeOfficers, makePbo, makeSessionConfig } from '../../test/factories';
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

const baseProps = {
  sessionType: 'economica' as const,
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
    numeroLoja: '29',
    dataFundacaoISO: '2020-01-01',
    temploNome: 'Templo',
    enderecoTemplo: 'Rua',
    cidadeEstado: 'Aracaju/SE',
  },
  onLojaConfigChange: vi.fn(),
  balaustreTexto: 'B',
  onBalaustreTextoChange: vi.fn(),
  atosDecretosTexto: 'A',
  onAtosDecretosTextoChange: vi.fn(),
  expedientesTexto: 'E',
  onExpedientesTextoChange: vi.fn(),
  bolsaPropostasTexto: 'BP',
  onBolsaPropostasTextoChange: vi.fn(),
};

describe('SidebarContent', () => {
  it('renderiza drawers e componentes principais', () => {
    render(<SidebarContent {...baseProps} />);

    expect(screen.getByText('SessionTypeSelector')).toBeInTheDocument();
    expect(screen.getByText('SessionConfigForm')).toBeInTheDocument();
    expect(screen.getByText('OfficersForm')).toBeInTheDocument();
    expect(screen.getByText('VisitorsPanel')).toBeInTheDocument();
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
});
