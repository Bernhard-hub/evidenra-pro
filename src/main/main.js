const { app, BrowserWindow, dialog, ipcMain, shell, session } = require('electron');
const path = require('path');
const LicenseValidator = require('./licenseValidator');

let mainWindow;
let licenseValidator;

const PRODUCT_ID = 'BAHleQbgEXcGPy68OhfynQ==';
licenseValidator = new LicenseValidator(PRODUCT_ID);

const PROTOCOL = 'evidenra';
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

function handleAuthCallback(url) {
  if (!url || !mainWindow) return;
  try {
    const urlObj = new URL(url);
    let accessToken = urlObj.searchParams.get('access_token');
    let refreshToken = urlObj.searchParams.get('refresh_token');
    if (!accessToken || !refreshToken) {
      const hash = urlObj.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      accessToken = hashParams.get('access_token');
      refreshToken = hashParams.get('refresh_token');
    }
    if (accessToken && refreshToken) {
      console.log('Auth callback received');
      mainWindow.webContents.send('auth-callback', { access_token: accessToken, refresh_token: refreshToken });
      mainWindow.focus();
    }
  } catch (error) {
    console.error('Error parsing auth callback URL:', error);
  }
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    const url = commandLine.find(arg => arg.startsWith(PROTOCOL + '://'));
    if (url) handleAuthCallback(url);
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.commandLine.appendSwitch('--disable-web-security');
app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('--disable-gpu-cache');
app.commandLine.appendSwitch('--disable-http-cache');
app.commandLine.appendSwitch('--disk-cache-size', '0');
app.commandLine.appendSwitch('--media-cache-size', '0');
app.commandLine.appendSwitch('--disable-application-cache');
app.commandLine.appendSwitch('--disable-offline-load-stale-cache');
app.commandLine.appendSwitch('--disable-background-timer-throttling');
app.commandLine.appendSwitch('--force-device-scale-factor', '1');

function createWindow() {
  console.log('Creating EVIDENRA Professional window...');
  const iconPath = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../Logo.ico')
    : path.join(process.resourcesPath, 'Logo.ico');

  mainWindow = new BrowserWindow({
    width: 1400, height: 900, icon: iconPath,
    webPreferences: {
      nodeIntegration: false, contextIsolation: true, webSecurity: false,
      preload: path.join(__dirname, '../preload/preload.js')
    },
    title: 'EVIDENRA Professional - v3.0 Quantum Enhanced',
    autoHideMenuBar: true, show: false
  });

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'microphone', 'audio'];
    callback(allowed.includes(permission));
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.session.clearCache().catch(() => {});
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    const possiblePaths = [
      path.join(__dirname, '../../dist/index.html'),
      path.join(__dirname, '../../public/index.html'),
      path.join(__dirname, '../../src/renderer/index.html')
    ];
    let loaded = false;
    const fs = require('fs');
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        mainWindow.loadFile(filePath);
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      const tempHtml = path.join(__dirname, 'temp.html');
      fs.writeFileSync(tempHtml, '<!DOCTYPE html><html><body><h1>Loading...</h1></body></html>');
      mainWindow.loadFile(tempHtml);
    }
  }
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.webContents.on('crashed', () => { if (mainWindow) mainWindow.reload(); });
}

app.whenReady().then(async () => {
  app.on('open-url', (event, url) => { event.preventDefault(); handleAuthCallback(url); });
  createWindow();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (mainWindow === null) createWindow(); });
process.on('uncaughtException', (error) => { console.error('Uncaught Exception:', error); });
process.on('unhandledRejection', (reason) => { console.error('Unhandled Rejection:', reason); });

ipcMain.handle('validate-license', async (event, licenseKey) => {
  return await licenseValidator.validateLicenseProduction(licenseKey);
});
ipcMain.handle('exit-app', () => app.quit());
ipcMain.handle('start-app', () => {
  createWindow();
  BrowserWindow.getAllWindows().forEach(w => { if (w.getTitle() === 'Enter License Key') w.close(); });
});
ipcMain.handle('clear-license', async () => { await licenseValidator.clearLicenseData(); return { success: true }; });
ipcMain.handle('get-license-info', async () => {
  const data = await licenseValidator.loadLicenseData();
  if (data) return { valid: true, validatedAt: data.validatedAt, uses: data.uses, customerEmail: (data.purchase && data.purchase.email) || 'Unknown' };
  return { valid: false };
});
ipcMain.handle('check-trial-status', async () => await licenseValidator.checkTrialStatus());
ipcMain.handle('toggle-devtools', () => {
  if (mainWindow) {
    if (mainWindow.webContents.isDevToolsOpened()) { mainWindow.webContents.closeDevTools(); return { isOpen: false }; }
    else { mainWindow.webContents.openDevTools(); return { isOpen: true }; }
  }
  return { isOpen: false };
});
ipcMain.handle('open-external', async (event, url) => { await shell.openExternal(url); return { success: true }; });

console.log('EVIDENRA Professional main process loaded');
