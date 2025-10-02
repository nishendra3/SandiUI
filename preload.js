const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sandi', {
  pickFile: () => ipcRenderer.invoke('pick-file'),
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  submit: (payload) => ipcRenderer.invoke('submit', payload)
});




