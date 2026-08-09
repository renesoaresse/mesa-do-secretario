import { beforeEach, describe, expect, it, vi } from 'vitest';

const contextBridgeMock = vi.hoisted(() => ({
  exposeInMainWorld: vi.fn(),
}));

const ipcRendererMock = vi.hoisted(() => ({
  sendSync: vi.fn(),
  invoke: vi.fn(),
}));

vi.mock('electron', () => ({
  contextBridge: contextBridgeMock,
  ipcRenderer: ipcRendererMock,
}));

describe('electron preload', () => {
  beforeEach(() => {
    vi.resetModules();
    contextBridgeMock.exposeInMainWorld.mockClear();
    ipcRendererMock.sendSync.mockClear();
    ipcRendererMock.invoke.mockClear();
  });

  it('expõe apenas uma API mínima de storage e pdf no renderer', async () => {
    const { electronApi } = await import('./preload');

    expect(Object.keys(electronApi)).toEqual(['storage', 'pdf']);
    expect(Object.keys(electronApi.storage)).toEqual(['load', 'save', 'remove', 'clear']);
    expect(Object.keys(electronApi.pdf)).toEqual(['render', 'save']);
  });

  it('mapeia as chamadas de pdf para canais assíncronos', async () => {
    const { electronApi, PDF_CHANNELS } = await import('./preload');
    const data = new Uint8Array([1, 2, 3]);

    void electronApi.pdf.render();
    void electronApi.pdf.save({ fileName: 'ata-sessao-7.pdf', data });

    expect(ipcRendererMock.invoke).toHaveBeenNthCalledWith(1, PDF_CHANNELS.render);
    expect(ipcRendererMock.invoke).toHaveBeenNthCalledWith(2, PDF_CHANNELS.save, {
      fileName: 'ata-sessao-7.pdf',
      data,
    });
  });

  it('mapeia chamadas de storage para canais síncronos específicos', async () => {
    const { electronApi, STORAGE_CHANNELS } = await import('./preload');

    electronApi.storage.load('ataDraft');
    electronApi.storage.save('lojaConfig', { nomeLoja: 'Teste' });
    electronApi.storage.remove('officersConfig');
    electronApi.storage.clear();

    expect(ipcRendererMock.sendSync).toHaveBeenNthCalledWith(1, STORAGE_CHANNELS.load, 'ataDraft');
    expect(ipcRendererMock.sendSync).toHaveBeenNthCalledWith(2, STORAGE_CHANNELS.save, {
      key: 'lojaConfig',
      value: { nomeLoja: 'Teste' },
    });
    expect(ipcRendererMock.sendSync).toHaveBeenNthCalledWith(
      3,
      STORAGE_CHANNELS.remove,
      'officersConfig',
    );
    expect(ipcRendererMock.sendSync).toHaveBeenNthCalledWith(4, STORAGE_CHANNELS.clear);
  });

  it('registra a API segura no contexto global', async () => {
    const { electronApi } = await import('./preload');

    expect(contextBridgeMock.exposeInMainWorld).toHaveBeenCalledWith('electronAPI', electronApi);
  });
});
