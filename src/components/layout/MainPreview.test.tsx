import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makePreviewData } from '../../test/factories';
import { MainPreview } from './MainPreview';

describe('MainPreview', () => {
  it('renderiza a toolbar e o preview do documento', () => {
    render(
      <MainPreview
        sessionType="economica"
        zoom={1}
        onZoomChange={vi.fn()}
        dataDocument={makePreviewData()}
      />,
    );

    expect(screen.getByRole('group', { name: /ações do preview/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Pré-visualização do documento')).toBeInTheDocument();
  });
});
