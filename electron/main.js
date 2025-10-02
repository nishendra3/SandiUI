// Electron main process
const { app, BrowserWindow, Menu, shell } = require('electron');
const { ipcMain, dialog } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let lastContentSize = { w: 0, h: 0 };
let frameDeltaH = 0;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

if (process.platform === 'win32') {
  app.setAppUserModelId('com.sandstrahl.sandiui');
}

function getReactiveBuffer(_contentHeight) {
  return 0;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 480,
    minHeight: 360,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, '..', 'preload.js'),
      webSecurity: true
    },
    icon: path.join(__dirname, '..', 'assets', process.platform === 'win32' ? 'sand.ico' : 'icon1.png'),
    title: 'Sandi UI',
    show: false,
    frame: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
  });

  const indexPath = path.join(__dirname, '..', 'renderer', 'index.html');
  mainWindow.loadFile(indexPath).catch(err => {
    console.error('Failed to load index.html:', err);
  });

  const updateMaxHeightToContent = () => {};

  const resizeToContent = async () => {
    try {
      const result = await mainWindow.webContents.executeJavaScript(
        `
        (function() {
          const el = document.getElementById('app-content')
                 || document.getElementById('root')
                 || document.body;
          const rect = el.getBoundingClientRect();
          const w = Math.ceil(rect.width);
          const h = Math.ceil(rect.height);
          return { w, h };
        })();
        `,
        true
      );

      if (result && typeof result.w === 'number' && typeof result.h === 'number') {
        lastContentSize = { w: result.w, h: result.h };
        const targetW = Math.max(Math.floor(result.w), 400);
        const targetH = Math.max(Math.floor(result.h), 300);

        mainWindow.setContentSize(targetW, targetH);
        updateMaxHeightToContent();
        mainWindow.center();
      }
    } catch (error) {
      console.error('resizeToContent error:', error);
    }
  };

  mainWindow.once('ready-to-show', async () => {
    mainWindow.show();
    setTimeout(async () => { await resizeToContent(); }, 500);
  });

  mainWindow.webContents.on('did-finish-load', () => setTimeout(resizeToContent, 100));
  mainWindow.webContents.on('dom-ready', () => setTimeout(resizeToContent, 150));

  // Removed dynamic maximum height clamp to allow free resizing

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault();
    mainWindow.setTitle('Sandi UI');
  });

  mainWindow.on('closed', () => { mainWindow = null; });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  ipcMain.handle('pick-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select CAD File',
      properties: ['openFile'],
      filters: [
        { name: 'CAD/Text/PDF', extensions: ['pdf', 'txt', 'step', 'stp'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    if (canceled || !filePaths.length) return null;
    const filePath = filePaths[0];
    let size = null;
    try { size = require('fs').statSync(filePath).size; } catch {}
    return { path: filePath, name: path.basename(filePath), size };
  });

  ipcMain.handle('pick-folder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Output Folder',
      properties: ['openDirectory', 'createDirectory']
    });
    if (canceled || !filePaths.length) return null;
    return filePaths[0];
  });

  ipcMain.handle('submit', async (_event, payload) => {
    console.log('Form Data Submitted:', JSON.stringify(payload, null, 2));
    return true;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


