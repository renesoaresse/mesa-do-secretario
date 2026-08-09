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
  handle: vi.fn(),
  removeAllListeners: vi.fn(),
  removeHandler: vi.fn(),
}));

const dialogMock = vi.hoisted(() => ({
  showSaveDialog: vi.fn(),
}));

vi.mock('electron', () => ({
  app: appMock,
  BrowserWindow: Object.assign(BrowserWindowMock, {
    getAllWindows: vi.fn(() => []),
  }),
  ipcMain: ipcMainMock,
  dialog: dialogMock,
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
    ipcMainMock.handle.mockClear();
    ipcMainMock.removeAllListeners.mockClear();
    ipcMainMock.removeHandler.mockClear();
    dialogMock.showSaveDialog.mockReset();
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
          preload: '/app/dist-electron/preload.cjs',
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
      readFileSync: vi.fn(() =>
        JSON.stringify({ ataDraft: { sessionType: 'magna' }, officersConfig: { vm: 'Mestre' } }),
      ),
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

    loadHandler?.(trustedEvent, 'ataDraft');
    expect(trustedEvent.returnValue).toEqual({ sessionType: 'magna' });

    loadHandler?.(trustedEvent, 'forbiddenKey');
    expect(trustedEvent.returnValue).toBeNull();

    loadHandler?.(untrustedEvent, 'officersConfig');
    expect(untrustedEvent.returnValue).toBeNull();
  });

  it('renderiza o PDF pela mesma folha de estilo da impressao e so para sender confiavel', async () => {
    const { registerPdfHandlers, PDF_CHANNELS } = await import('./main');

    registerPdfHandlers('/downloads');

    const renderHandler = ipcMainMock.handle.mock.calls.find(
      ([channel]) => channel === PDF_CHANNELS.render,
    )?.[1];

    const printToPDF = vi.fn(async () => new Uint8Array([37, 80, 68, 70]));
    const trustedEvent = {
      senderFrame: { url: 'http://localhost:5173' },
      sender: { getURL: vi.fn(() => 'http://localhost:5173'), printToPDF },
    };
    const untrustedEvent = {
      senderFrame: { url: 'https://evil.example' },
      sender: { getURL: vi.fn(() => 'https://evil.example'), printToPDF },
    };

    await expect(renderHandler?.(trustedEvent)).resolves.toEqual(new Uint8Array([37, 80, 68, 70]));
    expect(printToPDF).toHaveBeenCalledWith({
      printBackground: true,
      preferCSSPageSize: true,
      pageSize: 'A4',
    });

    await expect(renderHandler?.(untrustedEvent)).resolves.toBeNull();
    expect(printToPDF).toHaveBeenCalledTimes(1);
  });

  it('grava o PDF cifrado apenas apos o dialogo de salvar ser confirmado', async () => {
    const { registerPdfHandlers, PDF_CHANNELS } = await import('./main');

    const fileSystem = { writeFileSync: vi.fn() };
    registerPdfHandlers('/downloads', dialogMock, fileSystem);

    const saveHandler = ipcMainMock.handle.mock.calls.find(
      ([channel]) => channel === PDF_CHANNELS.save,
    )?.[1];

    const event = {
      senderFrame: { url: 'http://localhost:5173' },
      sender: { getURL: vi.fn(() => 'http://localhost:5173'), printToPDF: vi.fn() },
    };
    const data = new Uint8Array([1, 2, 3]);

    dialogMock.showSaveDialog.mockResolvedValueOnce({
      canceled: false,
      filePath: '/downloads/ata-sessao-7.pdf',
    });

    await expect(
      saveHandler?.(event, { fileName: '../../etc/ata-sessao-7.pdf', data }),
    ).resolves.toEqual({ saved: true, filePath: '/downloads/ata-sessao-7.pdf' });

    expect(dialogMock.showSaveDialog).toHaveBeenCalledWith(
      expect.objectContaining({ defaultPath: '/downloads/ata-sessao-7.pdf' }),
    );
    expect(fileSystem.writeFileSync).toHaveBeenCalledWith('/downloads/ata-sessao-7.pdf', data);

    dialogMock.showSaveDialog.mockResolvedValueOnce({ canceled: true });
    await expect(saveHandler?.(event, { fileName: 'ata.pdf', data })).resolves.toEqual({
      saved: false,
    });
    expect(fileSystem.writeFileSync).toHaveBeenCalledTimes(1);
  });

  it('recusa salvar PDF de sender nao confiavel ou com payload invalido', async () => {
    const { registerPdfHandlers, PDF_CHANNELS } = await import('./main');

    const fileSystem = { writeFileSync: vi.fn() };
    registerPdfHandlers('/downloads', dialogMock, fileSystem);

    const saveHandler = ipcMainMock.handle.mock.calls.find(
      ([channel]) => channel === PDF_CHANNELS.save,
    )?.[1];

    const untrustedEvent = {
      senderFrame: { url: 'https://evil.example' },
      sender: { getURL: vi.fn(() => 'https://evil.example'), printToPDF: vi.fn() },
    };
    const trustedEvent = {
      senderFrame: { url: 'http://localhost:5173' },
      sender: { getURL: vi.fn(() => 'http://localhost:5173'), printToPDF: vi.fn() },
    };

    await expect(
      saveHandler?.(untrustedEvent, { fileName: 'ata.pdf', data: new Uint8Array([1]) }),
    ).resolves.toEqual({ saved: false });

    await expect(
      saveHandler?.(trustedEvent, { fileName: 'ata.pdf', data: 'nao-e-binario' }),
    ).resolves.toEqual({ saved: false });

    expect(dialogMock.showSaveDialog).not.toHaveBeenCalled();
    expect(fileSystem.writeFileSync).not.toHaveBeenCalled();
  });

  it('sanitiza o nome do arquivo vindo do renderer', async () => {
    const { sanitizePdfFileName } = await import('./main');

    expect(sanitizePdfFileName('ata-sessao-7.pdf')).toBe('ata-sessao-7.pdf');
    expect(sanitizePdfFileName('../../../etc/passwd')).toBe('passwd.pdf');
    expect(sanitizePdfFileName('C:\\Windows\\system32\\ata.pdf')).toBe('ata.pdf');
    expect(sanitizePdfFileName('...')).toBe('ata.pdf');
    expect(sanitizePdfFileName(42)).toBe('ata.pdf');
  });
});
