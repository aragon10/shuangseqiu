const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadHistory: () => ipcRenderer.invoke('load-history'),
  saveHistory: (records) => ipcRenderer.invoke('save-history', records),
  clearHistory: () => ipcRenderer.invoke('clear-history')
});
