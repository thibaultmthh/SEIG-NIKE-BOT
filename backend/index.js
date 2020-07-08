const {
  app,
  BrowserWindow
} = require('electron')
const ipcMain = require('electron').ipcMain;

const {get_upcoming} = require("./get_info.js")

const {Perm_data} = require("./data_management.js")
const {Users_DS, Payment_methods_DS,Address_DS} = require("./data_management.js")

const {add_account} = require("./add_account.js")

perm_data = new Perm_data()
users_ds = new Users_DS()
payment_methods_ds = new Payment_methods_DS()
address_ds = new Address_DS()




function mainWin() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1550,
    height: 850,
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
  mainWindow.webContents.openDevTools()

  return mainWindow
}








//Acceuil



console.log(perm_data);


















var proxy = {
  domain: "lunar.astroproxies.com",
  port: "7777",
  username: "customer-astro_4198358-cc-fr-sessid-hXaiLFh3ujBH",
  password: "bdc984c262"
}

var profile = {
  "username": "bastiTricky@gmx.de",
  'password': "Schuhe123#",
  "proxy": proxy,
  "payment_method": card_info,
  "address": address,
  "nike_pay_id": "",
  "nike_address_id": "",
  "nike_user_id":"",
  "status": "waiting",
  "error": {"text": ""}
}

 //d471ca3b-fbed-4c33-9b3e-c7ee2959b4ad address
 //5ff6f19e-7cac-4b52-ad48-f7b038599b2e card




//
















function main() {
  mainWindow = mainWin()





  ipcMain.on("get_region_list", (event, data) => {
    mainWindow.webContents.send("region_list", Object.keys(perm_data.region_info))
  })

  ipcMain.on("get_upcoming", (event, data)=> {
    get_upcoming(perm_data.region_info[data], mainWindow)
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
