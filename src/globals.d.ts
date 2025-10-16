// Global type declarations
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Electron: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electronAPI: any;
  }
}

export {};
