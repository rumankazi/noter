import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EnhancedNotesList } from '../renderer/src/components/EnhancedNotesList'

// Mock the app store
const mockUseAppStore = vi.fn()
vi.mock('../renderer/src/stores/appStore', () => ({
    useAppStore: () => mockUseAppStore()
}))

describe('EnhancedNotesList - All Notes with Breadcrumbs', () => {
    const mockNotes = [
        {
            id: 'note-1',
            title: 'Root Note',
            content: 'Content 1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            folderId: null
        },
        {
            id: 'note-2',
            title: 'Folder Note',
            content: 'Content 2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            folderId: 'folder-1'
        },
        {
            id: 'note-3',
            title: 'Nested Note',
            content: 'Content 3',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            folderId: 'folder-2'
        }
    ]

    const mockFolders = [
        {
            id: 'folder-1',
            name: 'Documents',
            parentId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'folder-2',
            name: 'Projects',
            parentId: 'folder-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]

    const mockStoreActions = {
        notes: mockNotes,
        folders: mockFolders,
        setSelectedNote: vi.fn(),
        createNewNote: vi.fn(),
        searchQuery: '',
        selectedNoteId: null
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseAppStore.mockReturnValue(mockStoreActions)
    })

    it('should display all notes regardless of current folder selection', () => {
        render(<EnhancedNotesList />)

        expect(screen.getByText('Root Note')).toBeInTheDocument()
        expect(screen.getByText('Folder Note')).toBeInTheDocument()
        expect(screen.getByText('Nested Note')).toBeInTheDocument()
    })

    it('should show folder categories for notes', () => {
        render(<EnhancedNotesList />)

        // Should show folder headers with counts
        expect(screen.getByText(/General.*\(1\)/i)).toBeInTheDocument()
        expect(screen.getByText(/Documents.*\(1\)/i)).toBeInTheDocument()
        expect(screen.getByText(/Projects.*\(1\)/i)).toBeInTheDocument()
    })

    it('should show note count in header', () => {
        render(<EnhancedNotesList />)

        expect(screen.getByText('All Notes (3)')).toBeInTheDocument()
    })

    it('should filter notes based on search query', () => {
        const storeWithSearch = {
            ...mockStoreActions,
            searchQuery: 'Root'
        }
        mockUseAppStore.mockReturnValue(storeWithSearch)

        render(<EnhancedNotesList />)

        expect(screen.getByText('Root Note')).toBeInTheDocument()
        expect(screen.queryByText('Folder Note')).not.toBeInTheDocument()
        expect(screen.queryByText('Nested Note')).not.toBeInTheDocument()
    })

    it('should select note when clicked', () => {
        render(<EnhancedNotesList />)

        const noteItem = screen.getByText('Root Note')
        fireEvent.click(noteItem.closest('[data-testid=\"note-item\"]')!)

        expect(mockStoreActions.setSelectedNote).toHaveBeenCalledWith('note-1')
    })

    it('should highlight selected note', () => {
        const storeWithSelection = {
            ...mockStoreActions,
            selectedNoteId: 'note-1'
        }
        mockUseAppStore.mockReturnValue(storeWithSelection)

        render(<EnhancedNotesList />)

        const selectedNote = screen.getByText('Root Note').closest('[data-testid=\"note-item\"]')
        expect(selectedNote).toHaveClass('bg-vscode-listActive')
    })

    it('should show empty state when no notes exist', () => {
        const emptyStore = {
            ...mockStoreActions,
            notes: []
        }
        mockUseAppStore.mockReturnValue(emptyStore)

        render(<EnhancedNotesList />)

        expect(screen.getByText('No notes yet')).toBeInTheDocument()
    })

})