import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeDocumentDraft } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { DocumentForm } from './DocumentForm';

describe('DocumentForm', () => {
  it('emite patches e chama onAdd', async () => {
    const onDraftChange = vi.fn();
    const onAdd = vi.fn();
    const { user } = renderWithUser(
      <DocumentForm draft={makeDocumentDraft()} onDraftChange={onDraftChange} onAdd={onAdd} />,
    );

    fireEvent.change(screen.getByDisplayValue('Prancha/Edital'), {
      target: { value: 'Comunicação' },
    });
    fireEvent.change(screen.getByDisplayValue('001'), { target: { value: '999' } });
    fireEvent.change(screen.getByDisplayValue('GLMESE'), { target: { value: 'CMSB' } });
    fireEvent.change(screen.getByDisplayValue('Assunto'), { target: { value: 'Novo assunto' } });
    await user.click(screen.getByRole('button', { name: /adicionar/i }));

    expect(onDraftChange).toHaveBeenCalledWith({ type: 'Comunicação' });
    expect(onDraftChange).toHaveBeenCalledWith({ number: '999' });
    expect(onDraftChange).toHaveBeenCalledWith({ origin: 'CMSB' });
    expect(onDraftChange).toHaveBeenCalledWith({ subject: 'Novo assunto' });
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('desabilita controles quando disabled=true', () => {
    renderWithUser(
      <DocumentForm draft={makeDocumentDraft()} onDraftChange={vi.fn()} onAdd={vi.fn()} disabled />,
    );

    expect(screen.getByRole('button', { name: /adicionar/i })).toBeDisabled();
  });
});
