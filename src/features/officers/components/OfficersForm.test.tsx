import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeOfficers } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { OfficersForm } from './OfficersForm';
import type { ObreiroComCargo } from '../../loja-config/data/oficiais';

const SEM_TITULARES = { vm: '', vig1: '', vig2: '', or: '', sec: '', tes: '' };
const OFICIAIS_REAA = ['vm', 'vig1', 'vig2', 'or', 'sec'] as const;
const REAA = 'Rito Escocês Antigo e Aceito' as const;

const obreiros: ObreiroComCargo[] = [
  { id: 'a', nome: 'ABEL SANTOS', cim: '1', grau: 'M∴M∴', cargo: 'Venerável Mestre' },
  { id: 'b', nome: 'BRUNO LIMA', cim: '2', grau: 'M∴M∴', cargo: '' },
];

describe('OfficersForm', () => {
  it('oferece o quadro de obreiros em cada cargo', () => {
    renderWithUser(
      <OfficersForm
        oficiais={OFICIAIS_REAA}
        rito={REAA}
        value={makeOfficers()}
        obreiros={obreiros}
        titulares={SEM_TITULARES}
        onChange={vi.fn()}
      />,
    );

    const select = screen.getByLabelText('Venerável Mestre') as HTMLSelectElement;
    const opcoes = Array.from(select.options, (option) => option.textContent);

    // Quem ocupa cargo na gestão vigente aparece com o cargo ao lado do nome.
    expect(opcoes).toEqual([
      'Sem indicação',
      'ABEL SANTOS — Venerável Mestre',
      'BRUNO LIMA',
      'Outro (digitar nome)',
    ]);
  });

  it('emite patch parcial ao escolher um obreiro', async () => {
    const onChange = vi.fn();
    const { user } = renderWithUser(
      <OfficersForm
        oficiais={OFICIAIS_REAA}
        rito={REAA}
        value={{ vm: '', vig1: '', vig2: '', or: '', sec: '', tes: '' }}
        obreiros={obreiros}
        titulares={SEM_TITULARES}
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('1º Vigilante'), 'BRUNO LIMA');

    expect(onChange).toHaveBeenCalledWith({ vig1: 'BRUNO LIMA' });
  });

  it('libera a digitacao de um nome fora do quadro', async () => {
    const onChange = vi.fn();
    const { user } = renderWithUser(
      <OfficersForm
        oficiais={OFICIAIS_REAA}
        rito={REAA}
        value={{ vm: '', vig1: '', vig2: '', or: '', sec: '', tes: '' }}
        obreiros={obreiros}
        titulares={SEM_TITULARES}
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Secretário'), 'Outro (digitar nome)');
    // O campo é controlado pelo pai, então cada tecla emite o patch daquele caractere.
    await user.type(screen.getByLabelText('Secretário - nome'), 'c');

    // Nome digitado à mão sobe para caixa alta, como o cadastro de obreiros.
    expect(onChange).toHaveBeenLastCalledWith({ sec: 'C' });
  });

  it('coloca o titular do cargo no topo e o identifica', () => {
    renderWithUser(
      <OfficersForm
        oficiais={OFICIAIS_REAA}
        rito={REAA}
        value={{ vm: '', vig1: '', vig2: '', or: '', sec: '', tes: '' }}
        obreiros={obreiros}
        titulares={{ ...SEM_TITULARES, vm: 'BRUNO LIMA' }}
        onChange={vi.fn()}
      />,
    );

    const select = screen.getByLabelText('Venerável Mestre') as HTMLSelectElement;
    const opcoes = Array.from(select.options, (option) => option.textContent);

    expect(opcoes[1]).toBe('BRUNO LIMA — Titular do Cargo');
  });

  it('rotula cada cargo como o rito da loja o nomeia', () => {
    renderWithUser(
      <OfficersForm
        oficiais={['vm', 'vig1', 'vig2', 'tes', 'sec']}
        rito="Rito de York"
        value={makeOfficers()}
        obreiros={obreiros}
        titulares={SEM_TITULARES}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Tesoureiro')).toBeInTheDocument();
    expect(screen.getByLabelText('1º Vigilante')).toBeInTheDocument();
    // O Rito de York não nomeia Orador na ata.
    expect(screen.queryByLabelText('Orador')).not.toBeInTheDocument();
  });

  it('mantem o campo livre aberto quando o nome salvo nao esta no quadro', () => {
    renderWithUser(
      <OfficersForm
        oficiais={OFICIAIS_REAA}
        rito={REAA}
        value={{ vm: 'IRMAO VISITANTE', vig1: '', vig2: '', or: '', sec: '', tes: '' }}
        obreiros={obreiros}
        titulares={SEM_TITULARES}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Venerável Mestre - nome')).toHaveValue('IRMAO VISITANTE');
  });
});
