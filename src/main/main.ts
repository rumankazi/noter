import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { isDev } from './utils/environment';

// Fix GPU process issues on Windows
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');
app.disableHardwareAcceleration();

/**
 * Main Electron process entry point
 * Handles application lifecycle and window management
 */
class NoterApplication {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initializeApp();
  }

  /**
   * Initialize the Electron application
   */
  private initializeApp(): void {
    // Handle app ready event
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupIpcHandlers();

      app.on('activate', () => {
        // On macOS, re-create window when dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // Handle window closed events
    app.on('window-all-closed', () => {
      // On macOS, keep app running even when all windows are closed
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  /**
   * Create the main application window
   */
  private createMainWindow(): void {
    // Simple window configuration to avoid rendering issues
    const windowConfig: Electron.BrowserWindowConstructorOptions = {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      show: false, // Don't show until ready
      resizable: true,
      maximizable: true,
      minimizable: true,
      closable: true,
      fullscreenable: true,
    };

    // Keep platform-specific configurations minimal to avoid rendering issues
    if (process.platform === 'darwin') {
      // macOS specific configurations - only add if needed
      windowConfig.titleBarStyle = 'hiddenInset';
      windowConfig.trafficLightPosition = { x: 20, y: 20 };
    } else if (process.platform === 'linux') {
      // Linux specific configurations
      windowConfig.icon = path.join(__dirname, '../renderer/assets/icon.png');
    }
    // Windows uses default settings - no special configuration needed

    this.mainWindow = new BrowserWindow(windowConfig);

    // Add debugging for renderer process
    this.mainWindow.webContents.on('did-start-loading', () => {
      console.log('Renderer: Started loading');
    });

    this.mainWindow.webContents.on('did-finish-load', () => {
      console.log('Renderer: Finished loading');
    });

    this.mainWindow.webContents.on(
      'did-fail-load',
      (event, errorCode, errorDescription, validatedURL) => {
        console.error(
          'Renderer: Failed to load',
          errorCode,
          errorDescription,
          validatedURL
        );
      }
    );

    this.mainWindow.webContents.on('dom-ready', () => {
      console.log('Renderer: DOM ready');
    });

    this.mainWindow.webContents.on('page-title-updated', (event, title) => {
      console.log('Renderer: Page title updated to:', title);
    });

    // Load the renderer process
    if (isDev()) {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Show window when ready to prevent visual flash
    this.mainWindow.once('ready-to-show', () => {
      if (this.mainWindow) {
        this.mainWindow.show();
        this.mainWindow.focus();
        console.log('Noter application started successfully');
      }
    }); // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle window state changes
    this.setupWindowStateHandlers();

    // Setup platform-specific menu
    this.setupApplicationMenu();
  }

  /**
   * Setup window state event handlers
   */
  private setupWindowStateHandlers(): void {
    if (!this.mainWindow) return;

    // Save window bounds when resized or moved
    this.mainWindow.on('resize', () => {
      if (this.mainWindow) {
        const bounds = this.mainWindow.getBounds();
        console.log('Window resized:', bounds);
      }
    });

    this.mainWindow.on('move', () => {
      if (this.mainWindow) {
        const bounds = this.mainWindow.getBounds();
        console.log('Window moved:', bounds);
      }
    });

    // Handle maximize/unmaximize
    this.mainWindow.on('maximize', () => {
      console.log('Window maximized');
    });

    this.mainWindow.on('unmaximize', () => {
      console.log('Window unmaximized');
    });

    // Handle minimize/restore
    this.mainWindow.on('minimize', () => {
      console.log('Window minimized');
    });

    this.mainWindow.on('restore', () => {
      console.log('Window restored');
      // Ensure window is properly focused when restored
      if (this.mainWindow) {
        this.mainWindow.focus();
      }
    });
  }

  /**
   * Setup platform-specific application menu
   */
  private setupApplicationMenu(): void {
    if (process.platform === 'darwin') {
      // macOS menu bar
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Menu } = require('electron');
      const template = [
        {
          label: 'Noter',
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
        {
          label: 'File',
          submenu: [
            { label: 'New Note', accelerator: 'CmdOrCtrl+N' },
            { type: 'separator' },
            { role: 'close' },
          ],
        },
        {
          label: 'Edit',
          submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectall' },
          ],
        },
        {
          label: 'View',
          submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
          ],
        },
        {
          label: 'Window',
          submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' },
          ],
        },
      ];

      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    } else {
      // Remove menu bar on Windows/Linux for cleaner look
      this.mainWindow?.setMenuBarVisibility(false);
    }
  }

  /**
   * Setup IPC (Inter-Process Communication) handlers
   */
  private setupIpcHandlers(): void {
    // Hello World IPC handler for testing
    ipcMain.handle('app:get-version', () => {
      return app.getVersion();
    });

    ipcMain.handle('app:get-platform', () => {
      return process.platform;
    });

    // Graceful shutdown handler
    ipcMain.handle('app:quit', () => {
      app.quit();
    });
  }
}

// Create and start the application
new NoterApplication();
