import { Note, CreateNoteRequest, UpdateNoteRequest } from '@shared/types'
import { DatabaseService } from '../database/DatabaseService'
import { randomUUID } from 'crypto'

export class NoteService {
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
            this.db.save() // Save after each operation
            return rows
        } catch (error) {
            console.error('NoteService executeQuery error:', { query, params, error })
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
            console.error('NoteService executeUpdate error:', { query, params, error })
            if (stmt) stmt.free()
            throw error
        }
    }

    getAllNotes(): Note[] {
        const query = `
      SELECT id, title, content, folder_id as folderId, 
             created_at as createdAt, updated_at as updatedAt
      FROM notes 
      ORDER BY updated_at DESC
    `
        const rows = this.executeQuery(query)

        return rows.map(row => ({
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        })) as Note[]
    }

    getNoteById(id: string): Note | null {
        const query = `
      SELECT id, title, content, folder_id as folderId, 
             created_at as createdAt, updated_at as updatedAt
      FROM notes 
      WHERE id = ?
    `
        const rows = this.executeQuery(query, [id])

        if (rows.length === 0) return null

        const row = rows[0]
        return {
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        } as Note
    }

    createNote(request: CreateNoteRequest): Note {
        try {
            const id = randomUUID()
            const now = new Date().toISOString()

            console.log('NoteService creating note:', { id, title: request.title, folderId: request.folderId })

            const query = `
              INSERT INTO notes (id, title, content, folder_id, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)
            `

            this.executeUpdate(query, [
                id,
                request.title,
                request.content || '',
                request.folderId || null,
                now,
                now
            ])

            console.log('NoteService note created successfully:', id)

            return {
                id,
                title: request.title,
                content: request.content || '',
                folderId: request.folderId,
                createdAt: new Date(now),
                updatedAt: new Date(now)
            }
        } catch (error) {
            console.error('NoteService failed to create note:', error)
            throw error
        }
    }

    updateNote(request: UpdateNoteRequest): Note | null {
        const existingNote = this.getNoteById(request.id)
        if (!existingNote) return null

        const now = new Date().toISOString()
        const updates: string[] = []
        const values: any[] = []

        if (request.title !== undefined) {
            updates.push('title = ?')
            values.push(request.title)
        }

        if (request.content !== undefined) {
            updates.push('content = ?')
            values.push(request.content)
        }

        if (request.folderId !== undefined) {
            updates.push('folder_id = ?')
            values.push(request.folderId || null)
        }

        updates.push('updated_at = ?')
        values.push(now)
        values.push(request.id)

        const query = `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`
        this.executeUpdate(query, values)

        return this.getNoteById(request.id)
    }

    deleteNote(id: string): boolean {
        const query = 'DELETE FROM notes WHERE id = ?'
        const changes = this.executeUpdate(query, [id])
        return changes > 0
    }

    searchNotes(searchQuery: string): Note[] {
        const query = `
      SELECT id, title, content, folder_id as folderId, 
             created_at as createdAt, updated_at as updatedAt
      FROM notes 
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY updated_at DESC
    `
        const likeQuery = `%${searchQuery}%`
        const rows = this.executeQuery(query, [likeQuery, likeQuery])

        return rows.map(row => ({
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        })) as Note[]
    }

    getNotesByFolderId(folderId: string): Note[] {
        const query = `
      SELECT id, title, content, folder_id as folderId, 
             created_at as createdAt, updated_at as updatedAt
      FROM notes 
      WHERE folder_id = ?
      ORDER BY updated_at DESC
    `
        const rows = this.executeQuery(query, [folderId])

        return rows.map(row => ({
            ...row,
            createdAt: new Date(row.createdAt as string),
            updatedAt: new Date(row.updatedAt as string)
        })) as Note[]
    }
}