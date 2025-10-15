import { DatabaseService } from '../database/DatabaseService'
import { v4 as uuidv4 } from 'uuid'

export class DefaultFolderService {
    private databaseService: DatabaseService
    private defaultFolderId: string | null = null

    constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService
    }

    async initialize(): Promise<void> {
        await this.ensureDefaultFolder()
    }

    async ensureDefaultFolder(): Promise<string> {
        const db = this.databaseService.getDatabase()

        // Check if 'General' folder exists
        const result = db.exec('SELECT * FROM folders WHERE name = "General" AND parent_id IS NULL')

        if (result.length > 0 && result[0].values.length > 0) {
            const existingFolder = result[0].values[0]
            this.defaultFolderId = existingFolder[0] as string // id is first column
            return existingFolder[0] as string
        }

        // Create default 'General' folder
        const folderId = uuidv4()
        const now = new Date().toISOString()

        db.exec(`
            INSERT INTO folders (id, name, parent_id, created_at, updated_at)
            VALUES ("${folderId}", "General", NULL, "${now}", "${now}")
        `)

        this.databaseService.save()

        this.defaultFolderId = folderId
        return folderId
    }

    async getDefaultFolderId(): Promise<string | null> {
        if (this.defaultFolderId) {
            return this.defaultFolderId
        }

        const db = this.databaseService.getDatabase()
        const result = db.exec('SELECT id FROM folders WHERE name = "General" AND parent_id IS NULL')

        if (result.length > 0 && result[0].values.length > 0) {
            const folderId = result[0].values[0][0] as string
            this.defaultFolderId = folderId
            return folderId
        }

        return null
    }

    async getAssignedFolderId(requestedFolderId?: string | null): Promise<string> {
        if (requestedFolderId) {
            return requestedFolderId
        }

        // If no folder specified, use default folder
        const defaultFolderId = await this.getDefaultFolderId()
        if (defaultFolderId) {
            return defaultFolderId
        }

        // If default folder doesn't exist, create it
        return await this.ensureDefaultFolder()
    }
}