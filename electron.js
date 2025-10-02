const { app, BrowserWindow, Menu, protocol } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let lastContentSize = { w: 0, h: 0 };
let frameDeltaH = 0;

function getReactiveBuffer(contentHeight) {
  // 10% of content height, clamped between 24px and 128px
  const pct = Math.floor(contentHeight * 0.10);
  return Math.max(24, Math.min(pct, 128));
}

function createWindow() {
  // Create the browser window
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
      webSecurity: false
    },
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'sand.ico' : 'icon1.png'),
    title: 'Sandi UI',
    show: false,
    frame: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
  });

  const updateMaxHeightToContent = () => {
    try {
      const [outerW, outerH] = mainWindow.getSize();
      const [innerW, innerH] = mainWindow.getContentSize();
      frameDeltaH = Math.max(0, outerH - innerH);
      const baseH = lastContentSize.h;
      const buffer = getReactiveBuffer(baseH);
      const maxW = 10000;
      const maxH = Math.max(300, Math.floor(baseH + buffer + frameDeltaH));
      mainWindow.setMaximumSize(maxW, maxH);
    } catch (_) {}
  };

  if (isDev) {
    mainWindow.loadURL('http://localhost:19007');
    if (process.env.SHOW_DEVTOOLS === '1') {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadURL('app://index.html');
  }

  const resizeToContent = async () => {
    try {
      const result = await mainWindow.webContents.executeJavaScript(`
        (function() {
          const el = document.getElementById('app-content') || document.getElementById('root') || document.body;
          const rect = el.getBoundingClientRect();
          const w = Math.ceil(rect.width);
          const h = Math.ceil(rect.height);
          return { w, h };
        })();
      `, true);
      if (result && typeof result.w === 'number' && typeof result.h === 'number') {
        lastContentSize = { w: result.w, h: result.h };
        const [curInnerW, curInnerH] = mainWindow.getContentSize();
        const targetW = Math.max(Math.floor(result.w), 400);
        const targetH = Math.max(Math.floor(result.h), 300);
        
        // Debug logging
        console.log('Content size:', result);
        console.log('Target size:', { targetW, targetH });
        console.log('Current size:', { curInnerW, curInnerH });
        
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
    // Wait a bit for content to render before resizing
    setTimeout(async () => {
      await resizeToContent();
    }, 500);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(resizeToContent, 100);
  });
  mainWindow.webContents.on('dom-ready', () => {
    setTimeout(resizeToContent, 150);
  });

  mainWindow.on('will-resize', (event, newBounds) => {
    const baseH = lastContentSize.h;
    const buffer = getReactiveBuffer(baseH);
    const maxH = Math.max(300, Math.floor(baseH + buffer + frameDeltaH));
    if (newBounds.height > maxH) {
      event.preventDefault();
      mainWindow.setSize(newBounds.width, maxH);
    }
  });

  // Removed resize event handler to prevent feedback loop
  // The window will only resize based on content changes, not user resizing

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault();
    mainWindow.setTitle('Sandi UI');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6);
    callback({ path: path.normalize(path.join(__dirname, 'dist', url)) });
  });
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    require('electron').shell.openExternal(navigationUrl);
  });
});

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
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
