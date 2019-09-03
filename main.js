const { app, BrowserWindow, BrowserView } = require('electron');

function createWindow() {
    let browserWindow = new BrowserWindow(
        { 
            fullscreen: false, 
            webPreferences: 
            { 
                devTools: true,
                webviewTag: true
            } 
        }
    );
    browserWindow.maximize();
    browserWindow.setResizable(false);
    let pos = {
        x: 100,
        y: 0
    };
    browserWindow.webContents.loadFile("content.html");
    browserWindow.on('closed', function () { browserWindow = null; });
}

app.on('ready', createWindow);
