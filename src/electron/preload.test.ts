import { beforeEach, describe, expect, it, vi } from 'vitest';

const contextBridgeMock = vi.hoisted(() => ({
  exposeInMainWorld: vi.fn(),
}));

const ipcRendererMock = vi.hoisted(() => ({
  sendSync: vi.fn(),
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
  });

  it('expõe apenas uma API mínima de storage no renderer', async () => {
    const { electronApi } = await import('./preload');

    expect(Object.keys(electronApi)).toEqual(['storage']);
    expect(Object.keys(electronApi.storage)).toEqual(['load', 'save', 'remove', 'clear']);
  });

  it('mapeia chamadas de storage para canais síncronos específicos', async () => {
    const { electronApi, STORAGE_CHANNELS } = await import('./preload');

    electronApi.storage.load('officersConfig');
    electronApi.storage.save('lojaConfig', { nomeLoja: 'Teste' });
    electronApi.storage.remove('officersConfig');
    electronApi.storage.clear();

    expect(ipcRendererMock.sendSync).toHaveBeenNthCalledWith(
      1,
      STORAGE_CHANNELS.load,
      'officersConfig',
    );
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
