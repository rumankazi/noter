/**
 * Shared type definitions for the Noter application
 * Used across both main and renderer processes
 */

// Electron API interface for the renderer process
export interface ElectronAPI {
    // App-related APIs
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
    quit: () => Promise<void>;
}

// Global window interface extension
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

// Platform types
export type Platform = 'win32' | 'darwin' | 'linux';

// Application configuration
export interface AppConfig {
    name: string;
    version: string;
    platform: Platform;
    isDevelopment: boolean;
}
