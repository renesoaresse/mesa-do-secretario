import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  makeDocumentDraft,
  makeMagnaFields,
  makeOfficers,
  makePbo,
  makePreviewData,
  makeSessionConfig,
} from '../test/factories';
import App from './App';

const mockState = {
  sessionType: 'economica' as const,
  sessionConfig: makeSessionConfig(),
  magnaFields: makeMagnaFields(),
  docDraft: makeDocumentDraft(),
  documents: [],
  docStatus: null,
  visitors: [],
  officers: makeOfficers(),
  tronco: 0,
  ordemDia: '',
  pbo: makePbo(),
  lastSavedAt: new Date('2026-03-18T19:45:00'),
  lojaConfig: makePreviewData().lojaConfig,
  balaustreTexto: '',
  atosDecretosTexto: '',
  expedientesTexto: '',
  bolsaPropostasTexto: '',
  previewData: makePreviewData(),
  autoSaveVisible: true,
  zoom: 1,
  setZoom: vi.fn(),
  setSessionType: vi.fn(),
  setDocDraft: vi.fn(),
  setTronco: vi.fn(),
  setOrdemDia: vi.fn(),
  setBalaustreTexto: vi.fn(),
  setAtosDecretosTexto: vi.fn(),
  setExpedientesTexto: vi.fn(),
  setBolsaPropostasTexto: vi.fn(),
  updateSessionConfig: vi.fn(),
  updateMagnaFields: vi.fn(),
  updateOfficers: vi.fn(),
  updateLojaConfig: vi.fn(),
  updatePbo: vi.fn(),
  addDocument: vi.fn(),
  removeDocument: vi.fn(),
  addVisitor: vi.fn(),
  removeVisitor: vi.fn(),
  onPickPdf: vi.fn(),
  handlePrint: vi.fn(),
  handleSave: vi.fn(),
  markChanged: vi.fn(),
};

vi.mock('../hooks/useAtaState', () => ({
  useAtaState: () => mockState,
}));

vi.mock('../components/layout/SidebarContent', () => ({
  SidebarContent: ({ sessionType }: { sessionType: string }) => (
    <div>SidebarContent {sessionType}</div>
  ),
}));

vi.mock('../components/layout/MainPreview', () => ({
  MainPreview: ({ zoom }: { zoom: number }) => <div>MainPreview {zoom}</div>,
}));

describe('App', () => {
  it('renderiza composicao principal com header, content e preview', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /gerador de ata/i })).toBeInTheDocument();
    expect(screen.getByText(/contador: 42 - v/i)).toBeInTheDocument();
    expect(screen.getByText('SidebarContent economica')).toBeInTheDocument();
    expect(screen.getByText('MainPreview 1')).toBeInTheDocument();
    expect(screen.getByText(/alterações salvas automaticamente/i)).toBeInTheDocument();
  });
});
