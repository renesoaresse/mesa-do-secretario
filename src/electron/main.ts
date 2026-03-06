import { app, BrowserWindow } from "electron";
import path from "node:path";

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(app.getAppPath(), "build", "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.on("did-fail-load", (_e, code, desc, url) => {
    console.error("did-fail-load", { code, desc, url });
  });

  mainWindow.webContents.on("render-process-gone", (_e, details) => {
    console.error("render-process-gone", details);
  });

  mainWindow.webContents.on("unresponsive", () => {
    console.error("window-unresponsive");
  });

  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const indexPath = path.join(app.getAppPath(), "dist", "index.html");
    console.log("Loading index.html from:", indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  app.setAboutPanelOptions({
    applicationName: "Mesa do Secretário",
    applicationVersion: app.getVersion(),
    version: app.getVersion(),
    credits: `Responsáveis
Marcio Alves de Andrade 
Loja Maçônica Luzes do Cruzeiro nº 29

Renê Rocha Soares Neto
Loja Maçônica Hans Werner Menna Barreto König nº 19`,
    copyright: "© 2026 Mesa do Secretário",
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});