const {
  app,
  BrowserWindow
} = require('electron')
const ipc = require('electron').ipcMain;



function main() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1250,
    height: 775,
    frame: false,
    movable: true,
    backgroundColor: "#091821",
    webPreferences: {
      nodeIntegration: true,
      affinity: "window"
    }

  })
  mainWindow.setResizable(false)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  // and load the index.html of the app.
  mainWindow.loadFile('./frontend/main.html')
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  return mainWindow
}


app.whenReady().then(main)
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length === 0) main()
})
