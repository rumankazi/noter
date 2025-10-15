import { contextBridge, ipcRenderer } from 'electron'

// Define the API that will be exposed to the renderer process
const electronAPI = {
    // Platform info
    platform: process.platform,

    // Notes
    notes: {
        getAll: () => ipcRenderer.invoke('notes:getAll'),
        getById: (id: string) => ipcRenderer.invoke('notes:getById', id),
        create: (note: any) => ipcRenderer.invoke('notes:create', note),
        update: (note: any) => ipcRenderer.invoke('notes:update', note),
        delete: (id: string) => ipcRenderer.invoke('notes:delete', id),
        search: (query: string) => ipcRenderer.invoke('notes:search', query)
    },

    // Folders
    folders: {
        getAll: () => ipcRenderer.invoke('folders:getAll'),
        create: (folder: any) => ipcRenderer.invoke('folders:create', folder),
        update: (folder: any) => ipcRenderer.invoke('folders:update', folder),
        delete: (id: string) => ipcRenderer.invoke('folders:delete', id)
    },

    // Settings
    settings: {
        getDataLocation: () => ipcRenderer.invoke('settings:getDataLocation'),
        setDataLocation: (path: string) => ipcRenderer.invoke('settings:setDataLocation', path),
        openDirectoryDialog: () => ipcRenderer.invoke('settings:openDirectoryDialog'),
        getDatabaseSize: () => ipcRenderer.invoke('settings:getDatabaseSize'),
        getAutoSaveSettings: () => ipcRenderer.invoke('settings:getAutoSaveSettings'),
        setAutoSaveSettings: (settings: any) => ipcRenderer.invoke('settings:setAutoSaveSettings', settings),
        exportData: () => ipcRenderer.invoke('settings:exportData'),
        importData: () => ipcRenderer.invoke('settings:importData')
    },

    // Menu events
    onMenuEvent: (callback: (event: string) => void) => {
        ipcRenderer.on('menu:new-note', () => callback('new-note'))
        ipcRenderer.on('menu:new-folder', () => callback('new-folder'))
        ipcRenderer.on('menu:save', () => callback('save'))
        ipcRenderer.on('menu:command-palette', () => callback('command-palette'))
    },

    removeAllListeners: () => {
        ipcRenderer.removeAllListeners('menu:new-note')
        ipcRenderer.removeAllListeners('menu:new-folder')
        ipcRenderer.removeAllListeners('menu:save')
        ipcRenderer.removeAllListeners('menu:command-palette')
    }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Type definition for the renderer process
export type ElectronAPI = typeof electronAPI
