import { app, BrowserWindow, ipcMain } from 'electron'

const { autoUpdater } = require("electron-updater");



/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      devTools: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', function () {

  createWindow();

  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdatesAndNotify()
  
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', "1.5.0")
  })

  /*
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('checkUpdate')
  })
  */

})

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('updateReady')
  })


});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


autoUpdater.on('checking-for-update', () => {
  dispatch('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  dispatch('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  dispatch('Update not available.')
})

autoUpdater.on('error', (err) => {
  dispatch('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  // let log_message = "Download speed: " + progressObj.bytesPerSecond
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  // dispatch(log_message)

  mainWindow.webContents.send('download-progress', progressObj.percent)

})

autoUpdater.on('update-downloaded', (info) => {
  dispatch('Update downloaded')
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
