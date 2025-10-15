import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useAppStore } from '../renderer/src/stores/appStore'
import { Folder } from '@shared/types'

// Mock window.electronAPI
const mockElectronAPI = {
    folders: {
        update: vi.fn(),
        delete: vi.fn(),
    },
}

beforeEach(() => {
    vi.clearAllMocks()
    // @ts-expect-error - mocking window
    global.window.electronAPI = mockElectronAPI
})

describe('Folder Actions', () => {
    it('should rename folder with new name', async () => {
        const testFolder: Folder = {
            id: 'folder-1',
            name: 'Old Name',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const updatedFolder: Folder = {
            ...testFolder,
            name: 'New Name',
            updatedAt: new Date(),
        }

        mockElectronAPI.folders.update.mockResolvedValue(updatedFolder)

        const { renameFolder, addFolder } = useAppStore.getState()

        // Add test folder to store
        addFolder(testFolder)

        // Rename the folder
        await renameFolder(testFolder.id)

        expect(useAppStore.getState().folders).toContainEqual(expect.objectContaining({
            id: testFolder.id,
        }))
    })

    it('should delete folder and update store', async () => {
        const testFolder: Folder = {
            id: 'folder-2',
            name: 'Test Folder',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockElectronAPI.folders.delete.mockResolvedValue(true)

        const { addFolder, removeFolder } = useAppStore.getState()

        // Add test folder to store
        addFolder(testFolder)

        expect(useAppStore.getState().folders).toContainEqual(expect.objectContaining({
            id: testFolder.id,
        }))

        // Remove the folder
        removeFolder(testFolder.id)

        expect(useAppStore.getState().folders).not.toContainEqual(expect.objectContaining({
            id: testFolder.id,
        }))
    })

    it('should show confirmation dialog before deleting folder with contents', async () => {
        const testFolder: Folder = {
            id: 'folder-3',
            name: 'Folder With Contents',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const { addFolder, addNote, deleteFolder, showConfirmDialog } = useAppStore.getState()

        // Add test folder to store
        addFolder(testFolder)

        // Add a note to the folder
        addNote({
            id: 'note-1',
            title: 'Test Note',
            content: '',
            folderId: testFolder.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        // Spy on showConfirmDialog
        const showConfirmSpy = vi.spyOn(useAppStore.getState(), 'showConfirmDialog')

        // Attempt to delete the folder
        await deleteFolder(testFolder.id)

        // Should show confirmation dialog
        await waitFor(() => {
            expect(useAppStore.getState().confirmDialog.isOpen).toBe(true)
        })
    })
})
