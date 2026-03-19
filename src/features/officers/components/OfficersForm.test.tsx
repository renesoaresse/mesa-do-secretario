import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeOfficers } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { OfficersForm } from './OfficersForm';

describe('OfficersForm', () => {
  it('emite patch parcial para cada campo', () => {
    const onChange = vi.fn();
    renderWithUser(<OfficersForm value={makeOfficers()} onChange={onChange} />);

    fireEvent.change(screen.getByDisplayValue('Veneravel'), { target: { value: 'Novo VM' } });
    fireEvent.change(screen.getByDisplayValue('Primeiro'), { target: { value: 'Novo 1' } });
    fireEvent.change(screen.getByDisplayValue('Segundo'), { target: { value: 'Novo 2' } });
    fireEvent.change(screen.getByDisplayValue('Orador'), { target: { value: 'Novo Orador' } });
    fireEvent.change(screen.getByDisplayValue('Secretario'), { target: { value: 'Novo Sec' } });

    expect(onChange).toHaveBeenCalledWith({ vm: 'Novo VM' });
    expect(onChange).toHaveBeenCalledWith({ vig1: 'Novo 1' });
    expect(onChange).toHaveBeenCalledWith({ vig2: 'Novo 2' });
    expect(onChange).toHaveBeenCalledWith({ or: 'Novo Orador' });
    expect(onChange).toHaveBeenCalledWith({ sec: 'Novo Sec' });
  });
});
