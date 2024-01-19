let electron = require('electron');

let app = electron.app;

let BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('ready',() => {

    mainWindow = new BrowserWindow({width:800, height:600});

    mainWindow.loadFile('index.html');

    mainWindow.on('closed',() => {
        mainWindow = null;
    })
})