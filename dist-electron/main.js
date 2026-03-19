import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
let mainWindow = null;
export const STORAGE_CHANNELS = {
    load: 'storage:load',
    save: 'storage:save',
    remove: 'storage:remove',
    clear: 'storage:clear',
};
export const ALLOWED_STORAGE_KEYS = ['officersConfig', 'lojaConfig'];
function getPreloadPath() {
    return path.join(app.getAppPath(), 'dist-electron', 'preload.js');
}
function getStorageFilePath(userDataPath) {
    return path.join(userDataPath, 'mesa-do-secretario-storage.json');
}
export function isTrustedAppUrl(url) {
    return url.startsWith('http://localhost:5173') || url.startsWith('file://');
}
function isAllowedStorageKey(key) {
    return ALLOWED_STORAGE_KEYS.includes(key);
}
function resolveSenderUrl(event) {
    return event.senderFrame?.url ?? event.sender.getURL() ?? '';
}
function readStorageFile(userDataPath, fileSystem) {
    const filePath = getStorageFilePath(userDataPath);
    if (!fileSystem.existsSync(filePath)) {
        return {};
    }
    try {
        const raw = fileSystem.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
function writeStorageFile(userDataPath, data, fileSystem) {
    const filePath = getStorageFilePath(userDataPath);
    fileSystem.mkdirSync(path.dirname(filePath), { recursive: true });
    fileSystem.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
export function registerStorageHandlers(userDataPath, fileSystem = fs) {
    const channels = Object.values(STORAGE_CHANNELS);
    channels.forEach((channel) => {
        ipcMain.removeAllListeners(channel);
    });
    ipcMain.on(STORAGE_CHANNELS.load, (event, key) => {
        if (!isTrustedAppUrl(resolveSenderUrl(event)) || !isAllowedStorageKey(key)) {
            event.returnValue = null;
            return;
        }
        const store = readStorageFile(userDataPath, fileSystem);
        event.returnValue = store[key] ?? null;
    });
    ipcMain.on(STORAGE_CHANNELS.save, (event, payload) => {
        if (!isTrustedAppUrl(resolveSenderUrl(event)) || !isAllowedStorageKey(payload.key)) {
            event.returnValue = false;
            return;
        }
        const store = readStorageFile(userDataPath, fileSystem);
        store[payload.key] = payload.value;
        writeStorageFile(userDataPath, store, fileSystem);
        event.returnValue = true;
    });
    ipcMain.on(STORAGE_CHANNELS.remove, (event, key) => {
        if (!isTrustedAppUrl(resolveSenderUrl(event)) || !isAllowedStorageKey(key)) {
            event.returnValue = false;
            return;
        }
        const store = readStorageFile(userDataPath, fileSystem);
        delete store[key];
        writeStorageFile(userDataPath, store, fileSystem);
        event.returnValue = true;
    });
    ipcMain.on(STORAGE_CHANNELS.clear, (event) => {
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
    }
    else {
        const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
        console.log('Loading index.html from:', indexPath);
        mainWindow.loadFile(indexPath);
    }
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
        if (process.platform !== 'darwin')
            app.quit();
    });
}
