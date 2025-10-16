import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script for secure communication between main and renderer processes
 * Exposes safe APIs to the renderer process through contextBridge
 */

// Define the API interface for type safety
export interface ElectronAPI {
    // App-related APIs
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
    quit: () => Promise<void>;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    getPlatform: () => ipcRenderer.invoke('app:get-platform'),
    quit: () => ipcRenderer.invoke('app:quit')
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declarations for the renderer process
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
