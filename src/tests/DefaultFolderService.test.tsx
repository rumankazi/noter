import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DefaultFolderService } from '../main/services/DefaultFolderService'

// Mock database service
const mockExec = vi.fn()
const mockDatabaseService = {
    getDatabase: vi.fn(() => ({
        exec: mockExec,
        prepare: vi.fn(() => ({
            run: vi.fn(),
            get: vi.fn(),
            all: vi.fn()
        }))
    })),
    save: vi.fn()
}

describe('DefaultFolderService', () => {
    let defaultFolderService: DefaultFolderService

    beforeEach(() => {
        vi.clearAllMocks()
        defaultFolderService = new DefaultFolderService(mockDatabaseService as any)
    })

    it('should create default General folder if it does not exist', async () => {
        // Mock exec to return empty result (no existing folder)
        mockExec.mockReturnValue([])

        const folderId = await defaultFolderService.ensureDefaultFolder()

        expect(folderId).toBeDefined()
        expect(mockExec).toHaveBeenCalled()
        expect(mockDatabaseService.save).toHaveBeenCalled()
    })

    it('should not create default folder if General folder already exists', async () => {
        // Mock exec to return existing folder
        mockExec.mockReturnValue([{
            columns: ['id', 'name', 'parent_id', 'created_at', 'updated_at'],
            values: [['general-folder-id', 'General', null, new Date().toISOString(), new Date().toISOString()]]
        }])

        const folderId = await defaultFolderService.ensureDefaultFolder()

        expect(folderId).toBe('general-folder-id')
        expect(mockDatabaseService.save).not.toHaveBeenCalled()
    })

    it('should get default folder ID', async () => {
        // Mock exec to return folder
        mockExec.mockReturnValue([{
            columns: ['id'],
            values: [['general-folder-id']]
        }])

        const folderId = await defaultFolderService.getDefaultFolderId()

        expect(folderId).toBe('general-folder-id')
    })

    it('should return null if default folder does not exist when getting ID', async () => {
        mockExec.mockReturnValue([])

        const folderId = await defaultFolderService.getDefaultFolderId()

        expect(folderId).toBeNull()
    })

    it('should initialize default folder on service startup', async () => {
        mockExec.mockReturnValue([])

        await defaultFolderService.initialize()

        expect(mockExec).toHaveBeenCalled()
        expect(mockDatabaseService.save).toHaveBeenCalled()
    })

    it('should assign notes to default folder when no folder is specified', async () => {
        // Mock exec for ensureDefaultFolder
        mockExec.mockReturnValue([{
            columns: ['id', 'name', 'parent_id', 'created_at', 'updated_at'],
            values: [['general-folder-id', 'General', null, new Date().toISOString(), new Date().toISOString()]]
        }])

        await defaultFolderService.ensureDefaultFolder()

        // Mock for getDefaultFolderId
        mockExec.mockReturnValue([{
            columns: ['id'],
            values: [['general-folder-id']]
        }])

        const assignedFolderId = await defaultFolderService.getAssignedFolderId(null)

        expect(assignedFolderId).toBe('general-folder-id')
    })

    it('should preserve specified folder ID when provided', async () => {
        const specifiedFolderId = 'custom-folder-id'

        const assignedFolderId = await defaultFolderService.getAssignedFolderId(specifiedFolderId)

        expect(assignedFolderId).toBe(specifiedFolderId)
    })
})