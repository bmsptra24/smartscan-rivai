const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveFile: (folderName, fileName, content) =>
    ipcRenderer.invoke('save-file', folderName, fileName, content),
  openFileExplorer: () => ipcRenderer.invoke('open-file-explorer'),
  getFolders: () => ipcRenderer.invoke('get-folders'),
})
