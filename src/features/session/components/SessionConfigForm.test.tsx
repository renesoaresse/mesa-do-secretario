import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeSessionConfig } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { SessionConfigForm } from './SessionConfigForm';

describe('SessionConfigForm', () => {
  it('emite patch parcial ao alterar os campos', () => {
    const onChange = vi.fn();
    renderWithUser(<SessionConfigForm value={makeSessionConfig()} onChange={onChange} />);

    fireEvent.change(screen.getByDisplayValue('Aprendiz'), { target: { value: 'Mestre' } });
    fireEvent.change(screen.getByDisplayValue('42'), { target: { value: '99' } });
    fireEvent.change(screen.getByDisplayValue('2026-03-18'), { target: { value: '2026-03-19' } });
    fireEvent.change(screen.getByDisplayValue('12'), { target: { value: '18' } });
    fireEvent.change(screen.getByDisplayValue('19:30'), { target: { value: '20:00' } });
    fireEvent.change(screen.getByDisplayValue('21:00'), { target: { value: '22:00' } });

    expect(onChange).toHaveBeenCalledWith({ grau: 'Mestre' });
    expect(onChange).toHaveBeenCalledWith({ numSessao: 99 });
    expect(onChange).toHaveBeenCalledWith({ dataISO: '2026-03-19' });
    expect(onChange).toHaveBeenCalledWith({ numPresenca: 18 });
    expect(onChange).toHaveBeenCalledWith({ horaInicio: '20:00' });
    expect(onChange).toHaveBeenCalledWith({ horaEnc: '22:00' });
  });
});
