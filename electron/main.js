const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const http = require('http')
const express = require('express')
const {
  selectFolderAndSaveToLocal,
  saveFileWithPathFromLocal,
  openFileExplorer,
  getFolders,
} = require('./services/file')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  })

  // Membuat server lokal dengan Express untuk melayani file statis
  const expressApp = express()
  expressApp.use(express.static(path.join(__dirname, 'web-build'))) // Ganti 'web-build' dengan nama folder hasil build Expo
  const server = http.createServer(expressApp)

  server.listen(8081, () => {
    console.log('Server running on http://localhost:8081')
    // Load URL localhost:8081 di Electron
    mainWindow.loadURL('http://localhost:8081')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Services
ipcMain.handle('select-folder', async () => {
  return await selectFolderAndSaveToLocal()
})

ipcMain.handle('save-file', async (event, folderName, fileName, content) => {
  return await saveFileWithPathFromLocal(folderName, fileName, content)
})

ipcMain.handle('open-file-explorer', async () => {
  return await openFileExplorer()
})

ipcMain.handle('get-folders', async () => {
  return await getFolders()
})
