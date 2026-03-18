import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makePbo } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { PalavraBemDaOrdemPanel } from './PalavraBemDaOrdemPanel';

describe('PalavraBemDaOrdemPanel', () => {
  it('renderiza as tres colunas e emite patch parcial', () => {
    const onChange = vi.fn();
    renderWithUser(<PalavraBemDaOrdemPanel value={makePbo()} onChange={onChange} />);

    const textareas = screen.getAllByRole('textbox');
    expect(textareas).toHaveLength(3);

    fireEvent.change(textareas[0], { target: { value: 'Sul atualizado' } });
    fireEvent.change(textareas[1], { target: { value: 'Norte atualizado' } });
    fireEvent.change(textareas[2], { target: { value: 'Oriente atualizado' } });

    expect(onChange).toHaveBeenCalledWith({ sul: 'Sul atualizado' });
    expect(onChange).toHaveBeenCalledWith({ norte: 'Norte atualizado' });
    expect(onChange).toHaveBeenCalledWith({ oriente: 'Oriente atualizado' });
  });
});
