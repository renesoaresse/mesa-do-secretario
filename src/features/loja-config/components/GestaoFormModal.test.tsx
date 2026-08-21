import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { GestaoFormModal } from './GestaoFormModal';
import { renderWithUser } from '../../../test/render';
import type { Obreiro } from '../../../types/ata';

const obreiros: Obreiro[] = [
  { id: 'a', nome: 'ABEL', cim: '1', grau: 'M∴M∴' },
  { id: 'b', nome: 'BRUNO', cim: '2', grau: 'AP∴M∴' },
];

const REAA = 'Rito Escocês Antigo e Aceito' as const;

describe('GestaoFormModal', () => {
  it('lista um select por obreiro com os cargos do rito', () => {
    renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const selectAbel = screen.getByLabelText('ABEL') as HTMLSelectElement;
    const opcoes = Array.from(selectAbel.options, (option) => option.textContent);

    expect(opcoes[0]).toBe('Sem cargo');
    // Cada opção mostra a sigla usada na ata e o nome completo do cargo.
    expect(opcoes).toContain('V∴M∴ — Venerável Mestre');
    expect(opcoes).toContain('M∴I∴ — Mestre Instalador');
    expect(opcoes).toHaveLength(24); // "Sem cargo" + 23 cargos do REAA
    expect(screen.getByLabelText('BRUNO')).toBeInTheDocument();
  });

  it('remove das outras listas o cargo ja escolhido', async () => {
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText('ABEL'), 'V∴M∴');

    const opcoesBruno = Array.from(
      (screen.getByLabelText('BRUNO') as HTMLSelectElement).options,
      (option) => option.textContent,
    );
    expect(opcoesBruno).not.toContain('V∴M∴ — Venerável Mestre');

    const opcoesAbel = Array.from(
      (screen.getByLabelText('ABEL') as HTMLSelectElement).options,
      (option) => option.textContent,
    );
    expect(opcoesAbel).toContain('V∴M∴ — Venerável Mestre');
  });

  it('exige o ano da gestao', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Informe o ano da gestão.')).toBeInTheDocument();
  });

  it('aceita no maximo 4 digitos numericos no ano', async () => {
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const campoAno = screen.getByLabelText('Ano da Gestão');
    await user.type(campoAno, '2026/2027');

    expect(campoAno).toHaveValue('2026');
  });

  it('recusa ano com menos de 4 digitos', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText('Ano da Gestão'), '20');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('O ano da gestão deve ter 4 dígitos.')).toBeInTheDocument();
  });

  it('grava a sigla do cargo, nao o nome completo', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText('Ano da Gestão'), '2026');
    await user.selectOptions(screen.getByLabelText('ABEL'), 'V∴M∴');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      ano: '2026',
      vigente: false,
      atribuicoes: [{ obreiroId: 'a', cargo: 'V∴M∴' }],
    });
  });

  it('envia apenas os obreiros com cargo definido', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText('Ano da Gestão'), '2026');
    await user.selectOptions(screen.getByLabelText('ABEL'), '1º Vig∴');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      ano: '2026',
      vigente: false,
      atribuicoes: [{ obreiroId: 'a', cargo: '1º Vig∴' }],
    });
  });

  it('marca a gestao como vigente pelo select', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Gestão Vigente')).toHaveValue('nao');

    await user.type(screen.getByLabelText('Ano da Gestão'), '2026');
    await user.selectOptions(screen.getByLabelText('Gestão Vigente'), 'Sim');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSubmit).toHaveBeenCalledWith({ ano: '2026', vigente: true, atribuicoes: [] });
  });

  it('avisa quando o rito nao foi escolhido', () => {
    renderWithUser(
      <GestaoFormModal open rito="" obreiros={obreiros} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    expect(
      screen.getByText('Escolha o rito da loja na aba Geral para liberar a lista de cargos.'),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('ABEL')).toBeNull();
  });

  it('avisa quando o rito ainda nao tem cargos cadastrados', () => {
    renderWithUser(
      <GestaoFormModal
        open
        rito="Rito de York"
        obreiros={obreiros}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Os cargos do Rito de York ainda não foram cadastrados.'),
    ).toBeInTheDocument();
  });

  it('preenche os cargos ja salvos no modo edicao', () => {
    renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        gestao={{
          id: 'g1',
          ano: '2025',
          vigente: false,
          atribuicoes: [{ obreiroId: 'b', cargo: 'Tes∴' }],
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Editar Gestão' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ano da Gestão')).toHaveValue('2025');
    expect(screen.getByLabelText('BRUNO')).toHaveValue('Tes∴');
    expect(screen.getByLabelText('ABEL')).toHaveValue('');
  });

  it('cancela sem enviar', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const { user } = renderWithUser(
      <GestaoFormModal
        open
        rito={REAA}
        obreiros={obreiros}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    await user.type(screen.getByLabelText('Ano da Gestão'), '2026');
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
