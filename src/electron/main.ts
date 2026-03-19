import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

let mainWindow: BrowserWindow | null = null;

export const STORAGE_CHANNELS = {
  load: 'storage:load',
  save: 'storage:save',
  remove: 'storage:remove',
  clear: 'storage:clear',
} as const;

export const ALLOWED_STORAGE_KEYS = ['ataDraft', 'officersConfig', 'lojaConfig'] as const;

type AllowedStorageKey = (typeof ALLOWED_STORAGE_KEYS)[number];

type FileSystemLike = {
  existsSync: (path: string) => boolean;
  mkdirSync: (path: string, options: { recursive: true }) => void;
  readFileSync: (path: string, encoding: 'utf-8') => string;
  writeFileSync: (path: string, data: string, encoding: 'utf-8') => void;
};

type SyncEventLike = {
  senderFrame?: { url: string } | null;
  sender: { getURL: () => string };
  returnValue: unknown;
};

function getPreloadPath() {
  const preloadPath = path.join(app.getAppPath(), 'dist-electron', 'preload.cjs');
  console.log('Preload path:', preloadPath);
  console.log('App is packaged:', app.isPackaged);
  console.log('App path:', app.getAppPath());
  return preloadPath;
}

function getStorageFilePath(userDataPath: string) {
  return path.join(userDataPath, 'mesa-do-secretario-storage.json');
}

export function isTrustedAppUrl(url: string) {
  return url.startsWith('http://localhost:5173') || url.startsWith('file://');
}

function isAllowedStorageKey(key: string): key is AllowedStorageKey {
  return ALLOWED_STORAGE_KEYS.includes(key as AllowedStorageKey);
}

function resolveSenderUrl(event: SyncEventLike) {
  return event.senderFrame?.url ?? event.sender.getURL() ?? '';
}

function readStorageFile(
  userDataPath: string,
  fileSystem: FileSystemLike,
): Partial<Record<AllowedStorageKey, unknown>> {
  const filePath = getStorageFilePath(userDataPath);

  if (!fileSystem.existsSync(filePath)) {
    return {};
  }

  try {
    const raw = fileSystem.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Partial<Record<AllowedStorageKey, unknown>>;
  } catch {
    return {};
  }
}

function writeStorageFile(
  userDataPath: string,
  data: Partial<Record<AllowedStorageKey, unknown>>,
  fileSystem: FileSystemLike,
) {
  const filePath = getStorageFilePath(userDataPath);
  fileSystem.mkdirSync(path.dirname(filePath), { recursive: true });
  fileSystem.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function registerStorageHandlers(userDataPath: string, fileSystem: FileSystemLike = fs) {
  const channels = Object.values(STORAGE_CHANNELS);

  channels.forEach((channel) => {
    ipcMain.removeAllListeners(channel);
  });

  ipcMain.on(STORAGE_CHANNELS.load, (event: SyncEventLike, key: string) => {
    if (!isTrustedAppUrl(resolveSenderUrl(event)) || !isAllowedStorageKey(key)) {
      event.returnValue = null;
      return;
    }

    const store = readStorageFile(userDataPath, fileSystem);
    event.returnValue = store[key] ?? null;
  });

  ipcMain.on(
    STORAGE_CHANNELS.save,
    (event: SyncEventLike, payload: { key: string; value: unknown }) => {
      if (!isTrustedAppUrl(resolveSenderUrl(event)) || !isAllowedStorageKey(payload.key)) {
        event.returnValue = false;
        return;
      }

      const store = readStorageFile(userDataPath, fileSystem);
      store[payload.key] = payload.value;
      writeStorageFile(userDataPath, store, fileSystem);
      event.returnValue = true;
    },
  );

  ipcMain.on(STORAGE_CHANNELS.remove, (event: SyncEventLike, key: string) => {
    if (!isTrustedAppUrl(resolveSenderUrl(event)) || !isAllowedStorageKey(key)) {
      event.returnValue = false;
      return;
    }

    const store = readStorageFile(userDataPath, fileSystem);
    delete store[key];
    writeStorageFile(userDataPath, store, fileSystem);
    event.returnValue = true;
  });

  ipcMain.on(STORAGE_CHANNELS.clear, (event: SyncEventLike) => {
    if (!isTrustedAppUrl(resolveSenderUrl(event))) {
      event.returnValue = false;
      return;
    }

    writeStorageFile(userDataPath, {}, fileSystem);
    event.returnValue = true;
  });
}

export function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(app.getAppPath(), 'build', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: getPreloadPath(),
    },
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isTrustedAppUrl(url)) {
      event.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('did-fail-load', { code, desc, url });
  });

  mainWindow.webContents.on('render-process-gone', (_e, details) => {
    console.error('render-process-gone', details);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.error('window-unresponsive');
  });

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
    console.log('Loading index.html from:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.webContents.on('console-message', (_event, level, message) => {
    if (level >= 2) {
      console.log('Console error:', message);
    }
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('Render process gone:', details);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

export function initializeElectronApp() {
  return app.whenReady().then(() => {
    app.setAboutPanelOptions({
      applicationName: 'Mesa do Secretário',
      applicationVersion: app.getVersion(),
      version: app.getVersion(),
      credits: `Responsáveis
Marcio Alves de Andrade 
Loja Maçônica Luzes do Cruzeiro nº 29

Renê Rocha Soares Neto
Loja Maçônica Hans Werner Menna Barreto König nº 19`,
      copyright: '© 2026 Mesa do Secretário',
    });

    registerStorageHandlers(app.getPath('userData'));
    createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
}

if (process.env.VITEST !== 'true') {
  void initializeElectronApp();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
