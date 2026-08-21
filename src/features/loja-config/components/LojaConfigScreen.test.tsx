import { describe, expect, it, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { LojaConfigScreen } from './LojaConfigScreen';
import { removeMockElectronApi } from '../../../test/electron';
import { renderWithUser } from '../../../test/render';
import { storage } from '../../../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';

async function abrirAbaObreiros(user: ReturnType<typeof renderWithUser>['user']) {
  await user.click(screen.getByRole('tab', { name: 'Obreiros' }));
}

describe('LojaConfigScreen', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('mostra o botao de cadastro apenas na aba Gestao', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);

    expect(screen.queryByRole('button', { name: 'Cadastrar Gestão' })).toBeNull();

    await user.click(screen.getByRole('tab', { name: 'Gestão' }));

    expect(screen.getByRole('button', { name: 'Cadastrar Gestão' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cadastrar Obreiro' })).toBeNull();
  });

  it('mostra o botao de cadastro apenas na aba Obreiros', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);

    await user.click(screen.getByRole('tab', { name: 'Obreiros' }));

    expect(screen.getByRole('button', { name: 'Cadastrar Obreiro' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cadastrar Gestão' })).toBeNull();
  });

  it('mostra Salvar apenas na aba Geral, sempre ao lado de Voltar', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Gestão' }));
    expect(screen.queryByRole('button', { name: 'Salvar' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Obreiros' }));
    expect(screen.queryByRole('button', { name: 'Salvar' })).toBeNull();

    await user.click(screen.getByRole('tab', { name: 'Geral' }));
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('abre e fecha o modal de cadastro de gestao', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);

    await user.click(screen.getByRole('tab', { name: 'Gestão' }));
    await user.click(screen.getByRole('button', { name: 'Cadastrar Gestão' }));

    const dialog = screen.getByRole('dialog', { name: 'Cadastrar Gestão' });
    expect(dialog).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('abre o modal de cadastro de obreiro com o titulo correto', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);

    await user.click(screen.getByRole('tab', { name: 'Obreiros' }));
    await user.click(screen.getByRole('button', { name: 'Cadastrar Obreiro' }));

    expect(screen.getByRole('dialog', { name: 'Cadastrar Obreiro' })).toBeInTheDocument();
  });
});

describe('LojaConfigScreen - Obreiros', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('cadastra o obreiro em caixa alta e atualiza a listagem ao fechar o modal', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);
    await abrirAbaObreiros(user);

    expect(screen.getByText('Nenhum obreiro cadastrado ainda.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cadastrar Obreiro' }));
    await user.type(screen.getByLabelText('Nome'), 'joao da silva');
    await user.type(screen.getByLabelText('CIM'), '123456');
    await user.selectOptions(screen.getByLabelText('Grau'), 'M∴M∴');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('JOAO DA SILVA - 123456')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'M∴M∴' })).toBeInTheDocument();
    expect(storage.loadObreiros()).toMatchObject([{ nome: 'JOAO DA SILVA', cim: '123456' }]);
  });

  it('nao salva nada ao cancelar o modal', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);
    await abrirAbaObreiros(user);

    await user.click(screen.getByRole('button', { name: 'Cadastrar Obreiro' }));
    await user.type(screen.getByLabelText('Nome'), 'ninguem');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('Nenhum obreiro cadastrado ainda.')).toBeInTheDocument();
    expect(storage.loadObreiros()).toEqual([]);
  });

  it('exige o nome para salvar', async () => {
    const { user } = renderWithUser(<LojaConfigScreen />);
    await abrirAbaObreiros(user);

    await user.click(screen.getByRole('button', { name: 'Cadastrar Obreiro' }));
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Informe o nome do obreiro.')).toBeInTheDocument();
  });

  it('lista os obreiros em ordem alfabetica', async () => {
    storage.saveObreiros([
      { id: 'b', nome: 'ZEZE', cim: '2', grau: 'M∴M∴' },
      { id: 'a', nome: 'ABEL', cim: '1', grau: 'AP∴M∴' },
    ]);

    const { user } = renderWithUser(<LojaConfigScreen />);
    await abrirAbaObreiros(user);

    const primeiraColuna = screen
      .getAllByRole('row')
      .slice(1)
      .map((linha) => linha.querySelector('td')?.textContent);
    expect(primeiraColuna).toEqual(['ABEL - 1', 'ZEZE - 2']);
  });

  it('edita um obreiro pelo botao Editar e reflete na listagem', async () => {
    storage.saveObreiros([{ id: 'a', nome: 'ABEL', cim: '1', grau: 'AP∴M∴' }]);

    const { user } = renderWithUser(<LojaConfigScreen />);
    await abrirAbaObreiros(user);

    await user.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByRole('dialog', { name: 'Editar Obreiro' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toHaveValue('ABEL');

    await user.clear(screen.getByLabelText('Nome'));
    await user.type(screen.getByLabelText('Nome'), 'abel santos');
    await user.selectOptions(screen.getByLabelText('Grau'), 'M∴M∴I∴');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('ABEL SANTOS - 1')).toBeInTheDocument();
    expect(storage.loadObreiros()).toHaveLength(1);
    expect(storage.loadObreiros()[0].grau).toBe('M∴M∴I∴');
  });
});

describe('LojaConfigScreen - Gestão', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('cadastra a gestao e atualiza a listagem ao fechar o modal', async () => {
    storage.saveLojaConfig({
      ...DEFAULT_LOJA_CONFIG,
      rito: 'Rito Escocês Antigo e Aceito',
    });
    storage.saveObreiros([{ id: 'a', nome: 'ABEL', cim: '1', grau: 'M∴M∴' }]);

    const { user } = renderWithUser(<LojaConfigScreen />);
    await user.click(screen.getByRole('tab', { name: 'Gestão' }));

    expect(screen.getByText('Nenhuma gestão cadastrada ainda.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cadastrar Gestão' }));
    await user.type(screen.getByLabelText('Ano da Gestão'), '2026');
    await user.selectOptions(screen.getByLabelText('ABEL'), 'V∴M∴');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('cell', { name: '2026' })).toBeInTheDocument();
    expect(storage.loadGestoes()).toMatchObject([
      { ano: '2026', atribuicoes: [{ obreiroId: 'a', cargo: 'V∴M∴' }] },
    ]);
  });

  it('nao persiste a gestao ao cancelar', async () => {
    storage.saveLojaConfig({ ...DEFAULT_LOJA_CONFIG, rito: 'Rito Escocês Antigo e Aceito' });

    const { user } = renderWithUser(<LojaConfigScreen />);
    await user.click(screen.getByRole('tab', { name: 'Gestão' }));
    await user.click(screen.getByRole('button', { name: 'Cadastrar Gestão' }));
    await user.type(screen.getByLabelText('Ano da Gestão'), '2026');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Nenhuma gestão cadastrada ainda.')).toBeInTheDocument();
    expect(storage.loadGestoes()).toEqual([]);
  });

  it('usa os obreiros cadastrados em ordem alfabetica no modal', async () => {
    storage.saveLojaConfig({ ...DEFAULT_LOJA_CONFIG, rito: 'Rito Escocês Antigo e Aceito' });
    storage.saveObreiros([
      { id: 'z', nome: 'ZEZE', cim: '2', grau: 'M∴M∴' },
      { id: 'a', nome: 'ABEL', cim: '1', grau: 'AP∴M∴' },
    ]);

    const { user } = renderWithUser(<LojaConfigScreen />);
    await user.click(screen.getByRole('tab', { name: 'Gestão' }));
    await user.click(screen.getByRole('button', { name: 'Cadastrar Gestão' }));

    const rotulos = within(screen.getByRole('dialog'))
      .getAllByRole('combobox')
      .map((select) => select.getAttribute('aria-label') ?? select.previousSibling?.textContent);
    // O primeiro combobox é o "Gestão Vigente"; os seguintes são os obreiros.
    expect(rotulos).toEqual(['Gestão Vigente', 'ABEL', 'ZEZE']);
  });
});
