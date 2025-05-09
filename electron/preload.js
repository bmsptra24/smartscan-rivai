const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveFile: (fileName, content) =>
    ipcRenderer.invoke('save-file', fileName, content),
  openFileExplorer: () => ipcRenderer.invoke('open-file-explorer'),
})
