const { app, BrowserWindow, BrowserView } = require('electron');

let popup = null;

function afterStartup(e, content){
    if(content.getType()=='webview'){
        content.on('new-window', function(e, url){
            e.preventDefault();
            if(popup==null){
                popup = new BrowserWindow({
                    width: 1100,
                    height: 800
                });
                popup.on('closed', function(){ popup = null;})
            }
            popup.loadURL(url);
            popup.focus();
        });
        content.on("dom-ready", function(e){
            content.insertCSS(
              "::-webkit-scrollbar {width: 3px !important; background: transparent !important;}\n::-webkit-scrollbar-thumb {background-color: #888888 !important;} "
            );
        });
    }
}

function createWindow() {
    let browserWindow = new BrowserWindow(
        { 
            icon: 'build/icon.ico',
            fullscreen: false,
            show: false, 
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
    browserWindow.on('closed', function () { 
        if(popup!=null){
            popup.close();
            popup=null;
        }
        browserWindow = null; 
    });
    browserWindow.once('ready-to-show', function () {
       browserWindow.show(); 
    });
}

app.on('ready', createWindow);
app.on('web-contents-created', afterStartup);

