import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { DatabaseService } from './database/DatabaseService'
import { NoteService } from './services/NoteService'
import { FolderService } from './services/FolderService'
import { DefaultFolderService } from './services/DefaultFolderService'
import { SettingsService } from './services/SettingsService'

class MainProcess {
    private mainWindow: BrowserWindow | null = null
    private databaseService: DatabaseService
    private noteService: NoteService
    private folderService: FolderService
    private defaultFolderService: DefaultFolderService
    private settingsService: SettingsService
    private isReady = false

    constructor() {
        // Fix GPU process issues on Windows
        app.commandLine.appendSwitch('--disable-gpu')
        app.commandLine.appendSwitch('--disable-gpu-sandbox')
        app.commandLine.appendSwitch('--disable-software-rasterizer')
        app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor')
        app.commandLine.appendSwitch('--disable-gpu-compositing')
        app.commandLine.appendSwitch('--disable-gpu-rasterization')
        app.commandLine.appendSwitch('--no-sandbox')

        this.databaseService = new DatabaseService()
        this.noteService = new NoteService(this.databaseService)
        this.folderService = new FolderService(this.databaseService)
        this.defaultFolderService = new DefaultFolderService(this.databaseService)
        this.settingsService = new SettingsService(this.databaseService)

        this.setupApp()
    }

    private async initializeServices() {
        try {
            console.log('Initializing database...')
            await this.databaseService.initialize()
            console.log('Database initialized successfully')

            console.log('Initializing default folder...')
            await this.defaultFolderService.initialize()
            console.log('Default folder initialized successfully')

            console.log('Initializing settings service...')
            this.settingsService.initialize()
            console.log('Settings service initialized successfully')

            this.setupIPC()
            this.isReady = true
            console.log('Services initialized successfully')
        } catch (error) {
            console.error('Failed to initialize services:', error)
            throw error
        }
    }

    private setupApp() {
        // Add process error handlers
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error)
        })

        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason)
        })

        app.whenReady().then(async () => {
            try {
                console.log('App ready, initializing services...')
                await this.initializeServices()
                console.log('Services initialized, creating window...')
                this.createWindow()
                this.createMenu()
                console.log('Window created successfully')
            } catch (error) {
                console.error('Failed to initialize app:', error)
                app.quit()
            }

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    this.createWindow()
                }
            })
        }).catch(error => {
            console.error('App whenReady failed:', error)
            app.quit()
        })

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })

        app.on('before-quit', () => {
            console.log('App is quitting...')
            if (this.databaseService) {
                this.databaseService.close()
            }
        })
    }

    private createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            },
            titleBarStyle: 'hidden',
            titleBarOverlay: {
                color: '#333333',
                symbolColor: '#cccccc'
            }
        })

        const isDev = process.argv.includes('--dev')

        if (isDev) {
            this.mainWindow.loadURL('http://localhost:3000')
            this.mainWindow.webContents.openDevTools()
        } else {
            this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
        }
    }

    private createMenu() {
        const template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New Note',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => {
                            this.mainWindow?.webContents.send('menu:new-note')
                        }
                    },
                    {
                        label: 'New Folder',
                        accelerator: 'CmdOrCtrl+Shift+N',
                        click: () => {
                            this.mainWindow?.webContents.send('menu:new-folder')
                        }
                    },
                    { type: 'separator' },
                    {
                        label: 'Save',
                        accelerator: 'CmdOrCtrl+S',
                        click: () => {
                            this.mainWindow?.webContents.send('menu:save')
                        }
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Command Palette',
                        accelerator: 'CmdOrCtrl+Shift+P',
                        click: () => {
                            this.mainWindow?.webContents.send('menu:command-palette')
                        }
                    },
                    { type: 'separator' },
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' }
                ]
            }
        ]

        const menu = Menu.buildFromTemplate(template as any)
        Menu.setApplicationMenu(menu)
    }

    private setupIPC() {
        console.log('Setting up IPC handlers...')

        // Notes
        ipcMain.handle('notes:getAll', async () => {
            try {
                console.log('Getting all notes')
                return this.noteService.getAllNotes()
            } catch (error) {
                console.error('Error getting notes:', error)
                throw error
            }
        })

        ipcMain.handle('notes:getById', async (_, id: string) => {
            try {
                return this.noteService.getNoteById(id)
            } catch (error) {
                console.error('Error getting note by id:', error)
                throw error
            }
        })

        ipcMain.handle('notes:create', async (_, note) => {
            try {
                console.log('Creating note:', note)
                const result = this.noteService.createNote(note)
                console.log('Note created:', result)
                return result
            } catch (error) {
                console.error('Error creating note:', error)
                throw error
            }
        })

        ipcMain.handle('notes:update', async (_, note) => {
            return this.noteService.updateNote(note)
        })

        ipcMain.handle('notes:delete', async (_, id: string) => {
            return this.noteService.deleteNote(id)
        })

        ipcMain.handle('notes:search', async (_, query: string) => {
            return this.noteService.searchNotes(query)
        })

        // Folders
        ipcMain.handle('folders:getAll', async () => {
            try {
                console.log('Getting all folders')
                return this.folderService.getAllFolders()
            } catch (error) {
                console.error('Error getting folders:', error)
                throw error
            }
        })

        ipcMain.handle('folders:create', async (_, folder) => {
            try {
                console.log('Creating folder:', folder)
                const result = this.folderService.createFolder(folder)
                console.log('Folder created:', result)
                return result
            } catch (error) {
                console.error('Error creating folder:', error)
                throw error
            }
        })

        ipcMain.handle('folders:update', async (_, folder) => {
            return this.folderService.updateFolder(folder)
        })

        ipcMain.handle('folders:delete', async (_, id: string) => {
            return this.folderService.deleteFolder(id)
        })

        // Settings
        ipcMain.handle('settings:getDataLocation', async () => {
            try {
                return this.databaseService.getDataPath()
            } catch (error) {
                console.error('Error getting data location:', error)
                // Return default path if database service fails
                return path.join(os.homedir(), 'AppData', 'Local', 'Noter')
            }
        })

        ipcMain.handle('settings:getDatabaseSize', async () => {
            try {
                const sizeInBytes = this.databaseService.getDatabaseSize()
                return sizeInBytes
            } catch (error) {
                console.error('Error getting database size:', error)
                return 0
            }
        })

        ipcMain.handle('settings:setDataLocation', async (_, newPath: string) => {
            try {
                const currentPath = this.databaseService.getDataPath()
                const oldDbPath = path.join(currentPath, 'noter.db')
                const newDbPath = path.join(newPath, 'noter.db')

                // Create new directory if it doesn't exist
                if (!fs.existsSync(newPath)) {
                    fs.mkdirSync(newPath, { recursive: true })
                }

                // Copy database file
                if (fs.existsSync(oldDbPath)) {
                    fs.copyFileSync(oldDbPath, newDbPath)
                    console.log('Database copied to new location:', newDbPath)
                }

                this.settingsService.setSetting('dataLocation', newPath)
                return newPath
            } catch (error) {
                console.error('Error setting data location:', error)
                throw error
            }
        })

        ipcMain.handle('settings:openDirectoryDialog', async () => {
            try {
                if (!this.mainWindow) return null

                const result = await dialog.showOpenDialog(this.mainWindow, {
                    properties: ['openDirectory'],
                    title: 'Select Data Storage Location',
                    buttonLabel: 'Select Folder'
                })

                return result.canceled ? null : result.filePaths[0]
            } catch (error) {
                console.error('Error opening directory dialog:', error)
                throw error
            }
        })

        ipcMain.handle('settings:getAutoSaveSettings', async () => {
            try {
                return this.settingsService.getAutoSaveSettings()
            } catch (error) {
                console.error('Error getting auto-save settings:', error)
                throw error
            }
        })

        ipcMain.handle('settings:setAutoSaveSettings', async (_, settings) => {
            try {
                this.settingsService.setAutoSaveSettings(settings)
                return settings
            } catch (error) {
                console.error('Error setting auto-save settings:', error)
                throw error
            }
        })

        ipcMain.handle('settings:exportData', async () => {
            try {
                if (!this.mainWindow) return null

                const result = await dialog.showSaveDialog(this.mainWindow, {
                    title: 'Export Data',
                    defaultPath: `noter-backup-${new Date().toISOString().split('T')[0]}.json`,
                    filters: [{ name: 'JSON Files', extensions: ['json'] }]
                })

                if (result.canceled || !result.filePath) return null

                // Get all notes and folders
                const notes = this.noteService.getAllNotes()
                const folders = this.folderService.getAllFolders()
                const settings = this.settingsService.getAutoSaveSettings()

                const exportData = {
                    version: '1.0',
                    exportDate: new Date().toISOString(),
                    notes,
                    folders,
                    settings
                }

                fs.writeFileSync(result.filePath, JSON.stringify(exportData, null, 2))
                console.log('Data exported to:', result.filePath)

                return result.filePath
            } catch (error) {
                console.error('Error exporting data:', error)
                throw error
            }
        })

        ipcMain.handle('settings:importData', async () => {
            try {
                if (!this.mainWindow) return null

                const result = await dialog.showOpenDialog(this.mainWindow, {
                    title: 'Import Data',
                    filters: [{ name: 'JSON Files', extensions: ['json'] }],
                    properties: ['openFile']
                })

                if (result.canceled || result.filePaths.length === 0) return null

                const filePath = result.filePaths[0]
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                const importData = JSON.parse(fileContent)

                // Validate import data
                if (!importData.notes || !importData.folders) {
                    throw new Error('Invalid backup file format')
                }

                // Import folders first (to maintain relationships)
                let importedFolders = 0
                for (const folder of importData.folders) {
                    try {
                        this.folderService.createFolder({
                            name: folder.name,
                            parentId: folder.parentId
                        })
                        importedFolders++
                    } catch (error) {
                        console.error('Failed to import folder:', folder.name, error)
                    }
                }

                // Import notes
                let importedNotes = 0
                for (const note of importData.notes) {
                    try {
                        this.noteService.createNote({
                            title: note.title,
                            content: note.content,
                            folderId: note.folderId
                        })
                        importedNotes++
                    } catch (error) {
                        console.error('Failed to import note:', note.title, error)
                    }
                }

                console.log(`Import completed: ${importedNotes} notes, ${importedFolders} folders`)

                return {
                    success: true,
                    importedNotes,
                    importedFolders
                }
            } catch (error) {
                console.error('Error importing data:', error)
                throw error
            }
        })
    }
}

new MainProcess()