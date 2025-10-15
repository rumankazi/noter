import { DatabaseService } from '../database/DatabaseService'

export interface AutoSaveSettings {
    enabled: boolean
    onFocusChange: boolean
    intervalSeconds: number
    intervalEnabled: boolean
}

export class SettingsService {
    private db: DatabaseService

    constructor(databaseService: DatabaseService) {
        this.db = databaseService
    }

    initialize(): void {
        try {
            // Create settings table
            this.db.getDatabase().exec(`
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `)
            console.log('Settings table initialized')
        } catch (error) {
            console.error('Failed to initialize settings table:', error)
            throw error
        }
    }

    getAutoSaveSettings(): AutoSaveSettings {
        try {
            const result = this.db.getDatabase().exec(
                'SELECT value FROM settings WHERE key = ?',
                ['autoSaveSettings']
            )

            if (result.length > 0 && result[0].values.length > 0) {
                const value = result[0].values[0][0] as string
                return JSON.parse(value)
            }

            // Return default settings
            return {
                enabled: true,
                onFocusChange: true,
                intervalSeconds: 120, // 2 minutes
                intervalEnabled: true
            }
        } catch (error) {
            console.error('Failed to get auto-save settings:', error)
            return {
                enabled: true,
                onFocusChange: true,
                intervalSeconds: 120,
                intervalEnabled: true
            }
        }
    }

    setAutoSaveSettings(settings: AutoSaveSettings): void {
        try {
            const value = JSON.stringify(settings)
            const now = new Date().toISOString()

            this.db.getDatabase().exec(`
                INSERT OR REPLACE INTO settings (key, value, updated_at)
                VALUES ('autoSaveSettings', '${value.replace(/'/g, "''")}', '${now}')
            `)

            this.db.save()
            console.log('Auto-save settings saved:', settings)
        } catch (error) {
            console.error('Failed to save auto-save settings:', error)
            throw error
        }
    }

    getSetting(key: string, defaultValue: string = ''): string {
        try {
            const result = this.db.getDatabase().exec(
                'SELECT value FROM settings WHERE key = ?',
                [key]
            )

            if (result.length > 0 && result[0].values.length > 0) {
                return result[0].values[0][0] as string
            }

            return defaultValue
        } catch (error) {
            console.error(`Failed to get setting ${key}:`, error)
            return defaultValue
        }
    }

    setSetting(key: string, value: string): void {
        try {
            const now = new Date().toISOString()

            this.db.getDatabase().exec(`
                INSERT OR REPLACE INTO settings (key, value, updated_at)
                VALUES ('${key}', '${value.replace(/'/g, "''")}', '${now}')
            `)

            this.db.save()
        } catch (error) {
            console.error(`Failed to save setting ${key}:`, error)
            throw error
        }
    }
}
