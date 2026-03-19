import { beforeEach, describe, expect, it, vi } from 'vitest';

const appMock = vi.hoisted(() => ({
  getAppPath: vi.fn(() => '/app'),
  getPath: vi.fn(() => '/user-data'),
  setAboutPanelOptions: vi.fn(),
  whenReady: vi.fn(() => Promise.resolve()),
  on: vi.fn(),
  quit: vi.fn(),
  isPackaged: false,
}));

const webContentsMock = vi.hoisted(() => ({
  on: vi.fn(),
  setWindowOpenHandler: vi.fn(),
  getURL: vi.fn(() => 'http://localhost:5173'),
}));

const browserWindowInstance = vi.hoisted(() => ({
  webContents: webContentsMock,
  loadURL: vi.fn(),
  loadFile: vi.fn(),
  on: vi.fn(),
}));

const BrowserWindowMock = vi.hoisted(() =>
  vi.fn(() => ({
    ...browserWindowInstance,
    webContents: webContentsMock,
  })),
);

const ipcMainMock = vi.hoisted(() => ({
  on: vi.fn(),
  removeAllListeners: vi.fn(),
}));

vi.mock('electron', () => ({
  app: appMock,
  BrowserWindow: Object.assign(BrowserWindowMock, {
    getAllWindows: vi.fn(() => []),
  }),
  ipcMain: ipcMainMock,
}));

describe('electron main security', () => {
  beforeEach(() => {
    vi.resetModules();
    BrowserWindowMock.mockClear();
    webContentsMock.on.mockClear();
    webContentsMock.setWindowOpenHandler.mockClear();
    browserWindowInstance.loadURL.mockClear();
    browserWindowInstance.loadFile.mockClear();
    browserWindowInstance.on.mockClear();
    ipcMainMock.on.mockClear();
    ipcMainMock.removeAllListeners.mockClear();
    appMock.getAppPath.mockReturnValue('/app');
    appMock.getPath.mockReturnValue('/user-data');
    appMock.isPackaged = false;
  });

  it('configura a janela principal com sandbox, isolamento e preload', async () => {
    const { createMainWindow } = await import('./main');

    createMainWindow();

    expect(BrowserWindowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        webPreferences: expect.objectContaining({
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          preload: '/app/dist-electron/preload.js',
        }),
      }),
    );
    expect(browserWindowInstance.loadURL).toHaveBeenCalledWith('http://localhost:5173');
  });

  it('bloqueia navegacao externa pela regra de will-navigate', async () => {
    const { createMainWindow } = await import('./main');

    createMainWindow();

    const willNavigateHandler = webContentsMock.on.mock.calls.find(
      ([eventName]) => eventName === 'will-navigate',
    )?.[1];
    const event = { preventDefault: vi.fn() };

    willNavigateHandler?.(event, 'https://example.com');

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('nega abertura de novas janelas pela regra de window open', async () => {
    const { createMainWindow } = await import('./main');

    createMainWindow();

    const handler = webContentsMock.setWindowOpenHandler.mock.calls[0]?.[0];

    expect(handler?.({ url: 'https://example.com' })).toEqual({ action: 'deny' });
  });

  it('registra canais de storage apenas para sender confiavel e chave permitida', async () => {
    const { registerStorageHandlers, STORAGE_CHANNELS } = await import('./main');

    const fileSystem = {
      existsSync: vi.fn(() => true),
      mkdirSync: vi.fn(),
      readFileSync: vi.fn(() => JSON.stringify({ officersConfig: { vm: 'Mestre' } })),
      writeFileSync: vi.fn(),
    };

    registerStorageHandlers('/user-data', fileSystem);

    const loadHandler = ipcMainMock.on.mock.calls.find(
      ([channel]) => channel === STORAGE_CHANNELS.load,
    )?.[1];
    const trustedEvent = {
      senderFrame: { url: 'http://localhost:5173' },
      sender: { getURL: vi.fn(() => 'http://localhost:5173') },
      returnValue: undefined,
    };
    const untrustedEvent = {
      senderFrame: { url: 'https://evil.example' },
      sender: { getURL: vi.fn(() => 'https://evil.example') },
      returnValue: undefined,
    };

    loadHandler?.(trustedEvent, 'officersConfig');
    expect(trustedEvent.returnValue).toEqual({ vm: 'Mestre' });

    loadHandler?.(trustedEvent, 'forbiddenKey');
    expect(trustedEvent.returnValue).toBeNull();

    loadHandler?.(untrustedEvent, 'officersConfig');
    expect(untrustedEvent.returnValue).toBeNull();
  });
});
