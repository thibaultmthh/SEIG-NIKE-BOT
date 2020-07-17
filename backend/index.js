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
  "address_id": "ef3473ba-912e-4efb-819b-acec40640ef9",
  "pay_id": "42b64897-fa6d-44c6-92f7-c88aec273fa9",
  "proxy": proxy,
  "status": "waiting",
  "error": {"text": ""}
}





//ef3473ba-912e-4efb-819b-acec40640ef9 id address
//42b64897-fa6d-44c6-92f7-c88aec273fa9  id pay
















function main() {
  mainWindow = mainWin()

  //dashboard
  ipcMain.on("get_region_list", (event, data) => {console.log("okkay");
    mainWindow.webContents.send("region_list", Object.keys(perm_data.region_info))
  })

  ipcMain.on("get_upcoming", (event, data)=> {
    get_upcoming(perm_data.region_info[data], mainWindow)
  })




  //address managment
  ipcMain.on("set_address", (event, data)=> {address_ds.add_D(data)})
  ipcMain.on("get_all_address", ()=>{mainWindow.webContents.send("all_address", address_ds.datas)})
  ipcMain.on("update_address", (event, data)=> {address_ds.update_D(data)})
  ipcMain.on("remove_address", (event, data)=>{address_ds.remove_D(data);})
  //pay method managment
  ipcMain.on("set_pay", (event, data)=> {payment_methods_ds.add_D(data)})
  ipcMain.on("get_all_pay", ()=>{mainWindow.webContents.send("all_pay", payment_methods_ds.datas)})
  ipcMain.on("update_pay", (event, data)=> {payment_methods_ds.update_D(data)})
  ipcMain.on("remove_pay", (event, data)=>{address_ds.remove_D(data)})


  //user managment
  ipcMain.on("set_user", (event, data)=> {add_account(data, user_ds,payment_methods_ds, address_ds )})
  ipcMain.on("get_all_users", ()=>{mainWindow.webContents.send("all_users", user_ds.datas)})





}









app.whenReady().then(main)
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length === 0) main()
})
