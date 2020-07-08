const {
  app,
  BrowserWindow
} = require('electron')
const ipcMain = require('electron').ipcMain;

const {get_upcoming} = require("./get_info.js")

function mainWin() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1250,
    height: 750,
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








//Acceuil

var region_info = {
  "French": {
    "language": "fr",
    "marketplace": "FR"
  },
  "United_States": {
    "language": "en",
    "marketplace": "US"
  },
  "New_Zealand": {
    "language": "en-GB",
    "marketplace": "NZ"
  },
  "Taiwan": {
    "language": "zh-Hant",
    "marketplace": "TW"
  },
  "China": {
    "language": "zh-Hans",
    "marketplace": "CN"

  }
}




function main() {
  mainWindow = mainWin()










  ipcMain.on("get_region_list", (event, data) => {
    mainWindow.webContents.send("region_list", Object.keys(region_info))
  })

  ipcMain.on("get_upcoming", (event, data)=> {
    get_upcoming(region_info[data], mainWindow)
  })

}









app.whenReady().then(main)
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length === 0) main()
})
