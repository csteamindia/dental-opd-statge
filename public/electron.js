const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const { fork } = require('child_process');

let mainWindow;
let apiProcess;

function startAPI() {
    const apiPath = isDev
        ? path.join(__dirname, '../api/src/server.js')
        : path.join(process.resourcesPath, 'api/src/server.js');

    console.log('Starting API from:', apiPath);

    apiProcess = fork(apiPath, [], {
        env: {
            ...process.env,
            APP_PORT: 4017,
            NODE_ENV: isDev ? 'development' : 'production',
            DATABASE_DIALECT: 'sqlite',
            DATABASE_STORAGE: path.join(app.getPath('userData'), 'database.sqlite')
        },
    });

    apiProcess.on('message', (msg) => {
        console.log('API Message:', msg);
    });

    apiProcess.on('error', (err) => {
        console.error('API Error:', err);
    });
}

function createWindow() {
    startAPI();

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (apiProcess) {
        apiProcess.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('will-quit', () => {
    if (apiProcess) {
        apiProcess.kill();
    }
});
