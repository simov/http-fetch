
var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow

var window
function createWindow () {
  window = new BrowserWindow({})
  window.maximize()
  window.loadURL('file://' + __dirname + '/index.html')
  window.webContents.openDevTools()
  window.on('closed', () => {
    window = null
  })
}

app.on('ready', createWindow)
