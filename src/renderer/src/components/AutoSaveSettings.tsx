import React, { useState, useEffect } from 'react'
import { Save, Clock, Focus } from 'lucide-react'

interface AutoSaveSettingsData {
    enabled: boolean
    onFocusChange: boolean
    intervalSeconds: number
    intervalEnabled: boolean
}

export const AutoSaveSettings: React.FC = () => {
    const [settings, setSettings] = useState<AutoSaveSettingsData>({
        enabled: true,
        onFocusChange: true,
        intervalSeconds: 120,
        intervalEnabled: true
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            console.log('Loading auto-save settings...')
            if (window.electronAPI?.settings) {
                const savedSettings = await window.electronAPI.settings.getAutoSaveSettings()
                console.log('Loaded settings:', savedSettings)
                if (savedSettings) {
                    setSettings(savedSettings)
                }
            }
        } catch (error) {
            console.error('Failed to load auto-save settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateSettings = async (newSettings: AutoSaveSettingsData) => {
        try {
            console.log('Saving auto-save settings:', newSettings)
            if (window.electronAPI?.settings) {
                await window.electronAPI.settings.setAutoSaveSettings(newSettings)
                setSettings(newSettings)
                console.log('Settings saved successfully')
            }
        } catch (error) {
            console.error('Failed to save auto-save settings:', error)
        }
    }

    const handleFocusChangeToggle = () => {
        const newSettings = { ...settings, onFocusChange: !settings.onFocusChange }
        updateSettings(newSettings)
    }

    const handleIntervalToggle = () => {
        const newSettings = { ...settings, intervalEnabled: !settings.intervalEnabled }
        updateSettings(newSettings)
    }

    const handleIntervalChange = (value: number) => {
        const clampedValue = Math.max(1, Math.min(3600, value))
        const newSettings = { ...settings, intervalSeconds: clampedValue }
        updateSettings(newSettings)
    }

    if (loading) {
        return (
            <div className="p-4">
                <div className="text-vscode-foreground">Loading auto-save settings...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <Save size={20} className="text-vscode-foreground" />
                <h3 className="text-lg font-medium text-vscode-foreground">Auto-Save</h3>
            </div>

            {/* Focus Change Auto-Save */}
            <div className="bg-vscode-inputBackground border border-vscode-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <Focus size={16} className="text-vscode-foreground opacity-70" />
                        <label
                            htmlFor="focus-change-toggle"
                            className="text-sm font-medium text-vscode-foreground cursor-pointer"
                        >
                            Auto-save on focus change
                        </label>
                    </div>
                    <button
                        id="focus-change-toggle"
                        onClick={handleFocusChangeToggle}
                        className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${settings.onFocusChange ? 'bg-vscode-accent' : 'bg-vscode-border'}
                        `}
                        aria-checked={settings.onFocusChange}
                        role="switch"
                        aria-label="Auto-save on focus change"
                    >
                        <span
                            className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${settings.onFocusChange ? 'translate-x-6' : 'translate-x-1'}
                            `}
                        />
                    </button>
                </div>
                <p className="text-xs text-vscode-foreground opacity-60">
                    Automatically save notes when switching between notes or losing focus
                </p>
            </div>

            {/* Interval Auto-Save */}
            <div className="bg-vscode-inputBackground border border-vscode-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <Clock size={16} className="text-vscode-foreground opacity-70" />
                        <label
                            htmlFor="interval-toggle"
                            className="text-sm font-medium text-vscode-foreground cursor-pointer"
                        >
                            Auto-save at regular intervals
                        </label>
                    </div>
                    <button
                        id="interval-toggle"
                        onClick={handleIntervalToggle}
                        className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${settings.intervalEnabled ? 'bg-vscode-accent' : 'bg-vscode-border'}
                        `}
                        aria-checked={settings.intervalEnabled}
                        role="switch"
                        aria-label="Auto-save at regular intervals"
                    >
                        <span
                            className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${settings.intervalEnabled ? 'translate-x-6' : 'translate-x-1'}
                            `}
                        />
                    </button>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                    <span className="text-sm text-vscode-foreground">Every</span>
                    <input
                        type="number"
                        min="1"
                        max="3600"
                        value={settings.intervalSeconds}
                        onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
                        disabled={!settings.intervalEnabled}
                        className="
                            w-20 px-2 py-1 
                            bg-vscode-background 
                            border border-vscode-border 
                            rounded 
                            text-vscode-foreground 
                            text-sm
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-vscode-accent
                            disabled:opacity-50 
                            disabled:cursor-not-allowed
                        "
                    />
                    <span className="text-sm text-vscode-foreground">seconds</span>
                </div>

                <p className="text-xs text-vscode-foreground opacity-60">
                    Automatically save notes at regular intervals while editing
                </p>
            </div>
        </div>
    )
}