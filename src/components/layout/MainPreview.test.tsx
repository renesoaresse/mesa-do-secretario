import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { installMockElectronApi, removeMockElectronApi } from '../../test/electron';
import { makePreviewData } from '../../test/factories';
import { MainPreview } from './MainPreview';

describe('MainPreview', () => {
  it('renderiza a toolbar e o preview do documento', () => {
    removeMockElectronApi();

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

  it('continua renderizando com a API segura do Electron disponivel', () => {
    installMockElectronApi();

    render(
      <MainPreview
        sessionType="economica"
        zoom={1}
        onZoomChange={vi.fn()}
        dataDocument={makePreviewData()}
      />,
    );

    expect(screen.getByLabelText('Pré-visualização do documento')).toBeInTheDocument();
  });

  it('bloqueia cliques em links externos capturados no container principal', () => {
    const { container } = render(
      <MainPreview
        sessionType="economica"
        zoom={1}
        onZoomChange={vi.fn()}
        dataDocument={makePreviewData()}
      />,
    );

    const main = container.querySelector('main');
    const link = document.createElement('a');
    link.href = 'https://example.com';
    link.target = '_blank';
    main?.appendChild(link);

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

    fireEvent(link, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
