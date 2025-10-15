import { Folder, CreateFolderRequest, UpdateFolderRequest } from '@shared/types'
import { DatabaseService } from '../database/DatabaseService'
import { randomUUID } from 'crypto'

export class FolderService {
    private db: DatabaseService

    constructor(databaseService: DatabaseService) {
        this.db = databaseService
    }

    private executeQuery(query: string, params: any[] = []): any[] {
        let stmt: any
        try {
            stmt = this.db.getDatabase().prepare(query)

            if (params.length > 0) {
                stmt.bind(params)
            }

            const rows: any[] = []
            while (stmt.step()) {
                rows.push(stmt.getAsObject())
            }

            stmt.free()
            this.db.save()
            return rows
        } catch (error) {
            console.error('FolderService executeQuery error:', { query, params, error })
            if (stmt) stmt.free()
            throw error
        }
    }

    private executeUpdate(query: string, params: any[] = []): number {
        let stmt: any
        try {
            stmt = this.db.getDatabase().prepare(query)

            if (params.length > 0) {
                stmt.bind(params)
            }

            stmt.run()
            const changes = this.db.getDatabase().getRowsModified()
            stmt.free()
            this.db.save()
            return changes
        } catch (error) {
            console.error('FolderService executeUpdate error:', { query, params, error })
            if (stmt) stmt.free()
            throw error
        }
    }

    getAllFolders(): Folder[] {
        const query = `
      SELECT id, name, parent_id as parentId, 
             created_at as createdAt, updated_at as updatedAt
      FROM folders 
      ORDER BY name ASC
    `
        const rows = this.executeQuery(query)

        return rows.map(row => ({
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        })) as Folder[]
    }

    getFolderById(id: string): Folder | null {
        const query = `
      SELECT id, name, parent_id as parentId, 
             created_at as createdAt, updated_at as updatedAt
      FROM folders 
      WHERE id = ?
    `
        const rows = this.executeQuery(query, [id])

        if (rows.length === 0) return null

        const row = rows[0]
        return {
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        } as Folder
    }

    createFolder(request: CreateFolderRequest): Folder {
        try {
            const id = randomUUID()
            const now = new Date().toISOString()

            console.log('FolderService creating folder:', { id, name: request.name, parentId: request.parentId })

            const query = `
              INSERT INTO folders (id, name, parent_id, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?)
            `

            this.executeUpdate(query, [
                id,
                request.name,
                request.parentId || null,
                now,
                now
            ])

            console.log('FolderService folder created successfully:', id)

            return {
                id,
                name: request.name,
                parentId: request.parentId,
                createdAt: new Date(now),
                updatedAt: new Date(now)
            }
        } catch (error) {
            console.error('FolderService failed to create folder:', error)
            throw error
        }
    }

    updateFolder(request: UpdateFolderRequest): Folder | null {
        const existingFolder = this.getFolderById(request.id)
        if (!existingFolder) return null

        const now = new Date().toISOString()
        const updates: string[] = []
        const values: any[] = []

        if (request.name !== undefined) {
            updates.push('name = ?')
            values.push(request.name)
        }

        if (request.parentId !== undefined) {
            updates.push('parent_id = ?')
            values.push(request.parentId || null)
        }

        updates.push('updated_at = ?')
        values.push(now)
        values.push(request.id)

        const query = `UPDATE folders SET ${updates.join(', ')} WHERE id = ?`
        this.executeUpdate(query, values)

        return this.getFolderById(request.id)
    }

    deleteFolder(id: string): boolean {
        const query = 'DELETE FROM folders WHERE id = ?'
        const changes = this.executeUpdate(query, [id])
        return changes > 0
    }

    getFolderChildren(parentId: string): Folder[] {
        const query = `
      SELECT id, name, parent_id as parentId, 
             created_at as createdAt, updated_at as updatedAt
      FROM folders 
      WHERE parent_id = ?
      ORDER BY name ASC
    `
        const rows = this.executeQuery(query, [parentId])

        return rows.map(row => ({
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        })) as Folder[]
    }

    getRootFolders(): Folder[] {
        const query = `
      SELECT id, name, parent_id as parentId, 
             created_at as createdAt, updated_at as updatedAt
      FROM folders 
      WHERE parent_id IS NULL
      ORDER BY name ASC
    `
        const rows = this.executeQuery(query)

        return rows.map(row => ({
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        })) as Folder[]
    }
}