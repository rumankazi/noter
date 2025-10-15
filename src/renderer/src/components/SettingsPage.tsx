import React, { useState, useEffect } from 'react'
import { FolderOpen, Download, Upload, Settings } from 'lucide-react'
import { AutoSaveSettings } from './AutoSaveSettings'

export const SettingsPage: React.FC = () => {
    const [dataLocation, setDataLocation] = useState<string>('')
    const [databaseSize, setDatabaseSize] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            console.log('Loading settings page data...')
            if (window.electronAPI?.settings) {
                const location = await window.electronAPI.settings.getDataLocation()
                console.log('Data location:', location)
                setDataLocation(location)

                // Get database size
                const sizeInBytes = await window.electronAPI.settings.getDatabaseSize()
                console.log('Database size in bytes:', sizeInBytes)
                const sizeInKB = (sizeInBytes / 1024).toFixed(2)
                const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)

                // Show KB for small databases, MB for larger ones
                if (sizeInBytes < 1024 * 1024) {
                    setDatabaseSize(`${sizeInKB} KB`)
                } else {
                    setDatabaseSize(`${sizeInMB} MB`)
                }
                console.log('Database size:', sizeInKB, 'KB /', sizeInMB, 'MB')
            }
        } catch (error) {
            console.error('Failed to load settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBrowseLocation = async () => {
        try {
            if (window.electronAPI?.settings) {
                const newLocation = await window.electronAPI.settings.openDirectoryDialog()
                if (newLocation) {
                    await window.electronAPI.settings.setDataLocation(newLocation)
                    setDataLocation(newLocation)
                }
            }
        } catch (error) {
            console.error('Failed to change data location:', error)
        }
    }

    const handleExportData = async () => {
        try {
            if (window.electronAPI?.settings) {
                const filePath = await window.electronAPI.settings.exportData()
                if (filePath) {
                    alert(`Data exported successfully to:\n${filePath}`)
                }
            }
        } catch (error) {
            console.error('Failed to export data:', error)
            alert('Failed to export data. Please try again.')
        }
    }

    const handleImportData = async () => {
        try {
            if (window.electronAPI?.settings) {
                const result = await window.electronAPI.settings.importData()
                if (result && result.success) {
                    alert(`Import completed successfully!\n\nImported:\n- ${result.importedNotes} notes\n- ${result.importedFolders} folders\n\nPlease refresh the app to see imported data.`)
                    // Reload the app to show imported data
                    window.location.reload()
                }
            }
        } catch (error) {
            console.error('Failed to import data:', error)
            alert('Failed to import data. Please check the file format and try again.')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-vscode-foreground">Loading settings...</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-vscode-background">
            {/* Header */}
            <div className="flex items-center px-6 py-4 border-b border-vscode-border">
                <Settings className="mr-3 text-vscode-foreground" size={24} />
                <h1 className="text-xl font-medium text-vscode-foreground">Settings</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {/* Auto-Save Section */}
                <div className="mb-8">
                    <AutoSaveSettings />
                </div>

                {/* Data Storage Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-vscode-foreground mb-4">
                        Data Storage
                    </h2>

                    <div className="bg-vscode-inputBackground border border-vscode-border rounded-lg p-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-vscode-foreground mb-2">
                                Current Location:
                            </label>
                            <div className="flex items-center space-x-2">
                                <code className="flex-1 px-3 py-2 bg-vscode-background border border-vscode-border rounded text-vscode-foreground font-mono text-sm">
                                    {dataLocation}
                                </code>
                                <button
                                    onClick={handleBrowseLocation}
                                    className="px-4 py-2 bg-vscode-accent hover:bg-vscode-buttonHover text-white rounded transition-colors flex items-center"
                                >
                                    <FolderOpen size={16} className="mr-2" />
                                    Browse
                                </button>
                            </div>
                            <p className="text-xs text-vscode-foreground opacity-60 mt-2">
                                Notes and folders are stored in this directory.
                            </p>
                        </div>

                        <div className="border-t border-vscode-border pt-4">
                            <div className="text-sm text-vscode-foreground">
                                <strong>Database size:</strong> {databaseSize}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Management Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-vscode-foreground mb-4">
                        Data Management
                    </h2>

                    <div className="bg-vscode-inputBackground border border-vscode-border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleExportData}
                                className="flex items-center px-4 py-3 bg-vscode-background hover:bg-vscode-listHover border border-vscode-border rounded transition-colors"
                            >
                                <Download size={16} className="mr-3 text-vscode-foreground" />
                                <div className="text-left">
                                    <div className="text-sm font-medium text-vscode-foreground">
                                        Export Data
                                    </div>
                                    <div className="text-xs text-vscode-foreground opacity-60">
                                        Backup your notes and folders
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={handleImportData}
                                className="flex items-center px-4 py-3 bg-vscode-background hover:bg-vscode-listHover border border-vscode-border rounded transition-colors"
                            >
                                <Upload size={16} className="mr-3 text-vscode-foreground" />
                                <div className="text-left">
                                    <div className="text-sm font-medium text-vscode-foreground">
                                        Import Data
                                    </div>
                                    <div className="text-xs text-vscode-foreground opacity-60">
                                        Restore from backup
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}