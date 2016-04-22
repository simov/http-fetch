
var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow

var win
function createWindow () {
  win = new BrowserWindow({})
  win.maximize()
  win.loadURL('file://' + __dirname + '/index.html')
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
