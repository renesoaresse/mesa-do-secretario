import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { LojaConfigForm } from './LojaConfigForm';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';
import { renderWithUser } from '../../../test/render';

describe('LojaConfigForm - Rito', () => {
  it('mostra "Escolha o Rito" quando nenhum rito esta selecionado', () => {
    renderWithUser(<LojaConfigForm value={DEFAULT_LOJA_CONFIG} onChange={vi.fn()} />);

    const select = screen.getByLabelText('Rito') as HTMLSelectElement;
    expect(select.value).toBe('');
    expect(select.selectedOptions[0].textContent).toBe('Escolha o Rito');
  });

  it('lista os quatro ritos disponiveis', () => {
    renderWithUser(<LojaConfigForm value={DEFAULT_LOJA_CONFIG} onChange={vi.fn()} />);

    const opcoes = Array.from(
      (screen.getByLabelText('Rito') as HTMLSelectElement).options,
      (option) => option.textContent,
    );

    expect(opcoes).toEqual([
      'Escolha o Rito',
      'Rito Escocês Antigo e Aceito',
      'Rito Adonhiramita',
      'Rito de York',
      'Rito de Emulação',
    ]);
  });

  it('propaga o rito escolhido via onChange', async () => {
    const onChange = vi.fn();
    const { user } = renderWithUser(
      <LojaConfigForm value={DEFAULT_LOJA_CONFIG} onChange={onChange} />,
    );

    await user.selectOptions(screen.getByLabelText('Rito'), 'Rito de York');

    expect(onChange).toHaveBeenCalledWith({ rito: 'Rito de York' });
  });
});
