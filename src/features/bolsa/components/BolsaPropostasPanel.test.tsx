import type { ComponentProps } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { makeBolsaProposta, makeBolsaPropostas, makePreviewData } from '../../../test/factories';
import type { Loja } from '../../../types/ata';
import type { ObreiroComCargo } from '../../loja-config/data/oficiais';
import { BolsaPropostasPanel } from './BolsaPropostasPanel';

const lojaConfig = makePreviewData().lojaConfig;

const obreiros: ObreiroComCargo[] = [
  { id: 'o1', nome: 'JORGE FARIAS LIMA', cim: '1', grau: 'M∴M∴', cargo: 'Orad∴' },
  { id: 'o2', nome: 'UBIRATAN PINHEIRO', cim: '2', grau: 'M∴M∴', cargo: '' },
];

const lojas: Loja[] = [
  { id: 'l1', nome: 'Jacques Demolay - 18', oriente: 'Aracaju/SE', potencia: 'GLMESE' },
];

function renderPanel(overrides: Partial<ComponentProps<typeof BolsaPropostasPanel>> = {}) {
  const props = {
    value: makeBolsaPropostas({ texto: '' }),
    obreiros,
    lojas,
    lojaConfig,
    onChange: vi.fn(),
    onAddItem: vi.fn(),
    onRemoveItem: vi.fn(),
    onCreateLoja: vi.fn(),
    ...overrides,
  };

  return { props, ...renderWithUser(<BolsaPropostasPanel {...props} />) };
}

describe('BolsaPropostasPanel', () => {
  it('esconde os campos quando a bolsa esta suprimida', () => {
    renderPanel({ value: makeBolsaPropostas({ suprimida: true }) });

    expect(screen.getByLabelText(/suprimida/i)).toBeChecked();
    expect(screen.queryByText(/total de colunas gravadas/i)).not.toBeInTheDocument();
  });

  it('lista os registros ja adicionados com o tipo de cada um', () => {
    renderPanel({
      value: makeBolsaPropostas({
        itens: [makeBolsaProposta({ obreiroNome: 'JORGE FARIAS LIMA' })],
      }),
    });

    expect(screen.getByText(/JORGE FARIAS LIMA — Certificado de Visitas/)).toBeInTheDocument();
    expect(screen.getByText(/Jacques Demolay - 18 \(24\/07\/2026\)/)).toBeInTheDocument();
  });

  it('comeca sem tipo escolhido e so mostra os campos apos a escolha', async () => {
    const { user } = renderPanel();

    const tipo = screen.getByLabelText(/^tipo$/i);
    expect(tipo).toHaveValue('');
    expect(screen.queryByPlaceholderText(/loja visitada/i)).not.toBeInTheDocument();

    await user.selectOptions(tipo, 'certificado');
    expect(screen.getByPlaceholderText(/loja visitada/i)).toBeInTheDocument();
  });

  it('grava o certificado num unico botao Adicionar, sem passo intermediario', async () => {
    const { props, user } = renderPanel();

    await user.type(screen.getByPlaceholderText(/buscar obreiro/i), 'jorge');
    await user.click(screen.getByRole('button', { name: /JORGE FARIAS LIMA/ }));
    await user.selectOptions(screen.getByLabelText(/^tipo$/i), 'certificado');

    await user.type(screen.getByPlaceholderText(/loja visitada/i), 'jacques');
    await user.click(screen.getByRole('button', { name: 'Jacques Demolay - 18' }));
    await user.type(screen.getByLabelText(/data da visita/i), '2026-07-24');

    expect(screen.queryByRole('button', { name: /adicionar visita/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(props.onAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        obreiroNome: 'JORGE FARIAS LIMA',
        tipo: 'certificado',
        certificados: [{ lojaId: 'l1', lojaNome: 'Jacques Demolay - 18', dataISO: '2026-07-24' }],
      }),
    );
  });

  it('exige loja e data para gravar um certificado', async () => {
    const { props, user } = renderPanel();

    await user.type(screen.getByPlaceholderText(/buscar obreiro/i), 'ubiratan');
    await user.click(screen.getByRole('button', { name: /UBIRATAN PINHEIRO/ }));
    await user.selectOptions(screen.getByLabelText(/^tipo$/i), 'certificado');

    const adicionar = screen.getByRole('button', { name: 'Adicionar' });
    expect(adicionar).toBeDisabled();

    // Só com a data, sem loja, segue bloqueado.
    await user.type(screen.getByLabelText(/data da visita/i), '2026-07-25');
    expect(adicionar).toBeDisabled();

    // Só com a loja, sem data, também.
    await user.clear(screen.getByLabelText(/data da visita/i));
    await user.type(screen.getByPlaceholderText(/loja visitada/i), 'jacques');
    await user.click(screen.getByRole('button', { name: 'Jacques Demolay - 18' }));
    expect(adicionar).toBeDisabled();
    expect(props.onAddItem).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/data da visita/i), '2026-07-25');
    expect(adicionar).toBeEnabled();
  });

  it('pede o titulo quando o tipo e trabalho', async () => {
    const { props, user } = renderPanel();

    await user.type(screen.getByPlaceholderText(/buscar obreiro/i), 'jorge');
    await user.click(screen.getByRole('button', { name: /JORGE FARIAS LIMA/ }));
    await user.selectOptions(screen.getByLabelText(/^tipo$/i), 'trabalho');
    await user.type(screen.getByLabelText(/título do trabalho/i), 'A Simbologia do Esquadro');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(props.onAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        tipo: 'trabalho',
        titulo: 'A Simbologia do Esquadro',
        certificados: [],
      }),
    );
  });
});
