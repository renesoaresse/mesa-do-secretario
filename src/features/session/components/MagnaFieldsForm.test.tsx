import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeMagnaFields } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { MagnaFieldsForm } from './MagnaFieldsForm';

describe('MagnaFieldsForm', () => {
  it('nao renderiza quando visible=false', () => {
    const { container } = renderWithUser(
      <MagnaFieldsForm visible={false} value={makeMagnaFields()} onChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza campos e emite patches quando visivel', () => {
    const onChange = vi.fn();
    renderWithUser(<MagnaFieldsForm visible value={makeMagnaFields()} onChange={onChange} />);

    fireEvent.change(screen.getByDisplayValue('Tema'), { target: { value: 'Novo Tema' } });
    fireEvent.change(screen.getByDisplayValue('Convidado'), { target: { value: 'Outro' } });

    expect(screen.getByText(/campos da sessão magna/i)).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith({ tema: 'Novo Tema' });
    expect(onChange).toHaveBeenCalledWith({ oradorConvidado: 'Outro' });
  });
});
