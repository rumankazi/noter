import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NoteItem } from '../renderer/src/components/NoteItem'

// Mock the app store
const mockUseAppStore = vi.fn()
vi.mock('../renderer/src/stores/appStore', () => ({
    useAppStore: () => mockUseAppStore()
}))

describe('NoteItem - Delete Functionality', () => {
    const mockNote = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folderId: null
    }

    const mockStoreActions = {
        deleteNote: vi.fn(),
        setSelectedNote: vi.fn(),
        showConfirmDialog: vi.fn(),
        selectedNoteId: 'note-1'
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseAppStore.mockReturnValue(mockStoreActions)
    })

    it('should show delete button on hover', async () => {
        render(<NoteItem note={mockNote} />)

        const noteItem = screen.getByTestId('note-item')
        fireEvent.mouseEnter(noteItem)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
        })
    })

    it('should show confirmation dialog when delete button is clicked', () => {
        render(<NoteItem note={mockNote} />)

        const noteItem = screen.getByTestId('note-item')
        fireEvent.mouseEnter(noteItem)

        const deleteButton = screen.getByRole('button', { name: /delete/i })
        fireEvent.click(deleteButton)

        expect(mockStoreActions.showConfirmDialog).toHaveBeenCalledWith(
            'Delete Note',
            `Are you sure you want to delete "${mockNote.title}"? This action cannot be undone.`,
            expect.any(Function)
        )
    })

    it('should delete note when confirmed', () => {
        render(<NoteItem note={mockNote} />)

        const noteItem = screen.getByTestId('note-item')
        fireEvent.mouseEnter(noteItem)

        const deleteButton = screen.getByRole('button', { name: /delete/i })
        fireEvent.click(deleteButton)

        // Get the confirmation callback
        const confirmCallback = mockStoreActions.showConfirmDialog.mock.calls[0][2]
        confirmCallback()

        expect(mockStoreActions.deleteNote).toHaveBeenCalledWith(mockNote.id)
    })

    it('should support keyboard shortcut for delete', () => {
        render(<NoteItem note={mockNote} />)

        const noteItem = screen.getByTestId('note-item')
        fireEvent.focus(noteItem)
        fireEvent.keyDown(noteItem, { key: 'Delete' })

        expect(mockStoreActions.showConfirmDialog).toHaveBeenCalled()
    })
})