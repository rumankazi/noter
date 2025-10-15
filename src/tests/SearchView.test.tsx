import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchView } from '../renderer/src/components/SearchView'
import { useAppStore } from '../renderer/src/stores/appStore'

// Mock the store
vi.mock('../renderer/src/stores/appStore')

describe('SearchView', () => {
    const mockNotes = [
        {
            id: '1',
            title: 'React Hooks Guide',
            content: 'Learn about useState and useEffect',
            folderId: 'folder1',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02')
        },
        {
            id: '2',
            title: 'TypeScript Tutorial',
            content: 'Advanced TypeScript patterns',
            folderId: 'folder1',
            createdAt: new Date('2024-01-03'),
            updatedAt: new Date('2024-01-04')
        },
        {
            id: '3',
            title: 'CSS Flexbox',
            content: 'Modern layout techniques with flexbox',
            createdAt: new Date('2024-01-05'),
            updatedAt: new Date('2024-01-06')
        }
    ]

    const mockFolders = [
        {
            id: 'folder1',
            name: 'Development',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
        }
    ]

    beforeEach(() => {
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: vi.fn(),
            searchQuery: '',
            setSearchQuery: vi.fn()
        } as any)
    })

    it('should render search input', () => {
        render(<SearchView />)
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })

    it('should display all notes when search is empty', () => {
        render(<SearchView />)
        expect(screen.getByText('React Hooks Guide')).toBeInTheDocument()
        expect(screen.getByText('TypeScript Tutorial')).toBeInTheDocument()
        expect(screen.getByText('CSS Flexbox')).toBeInTheDocument()
    })

    it('should filter notes by title', () => {
        const mockSetSearchQuery = vi.fn()
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: vi.fn(),
            searchQuery: 'react',
            setSearchQuery: mockSetSearchQuery
        } as any)

        render(<SearchView />)

        // Should show React note, not TypeScript
        expect(screen.getByText(/React/)).toBeInTheDocument()
        expect(screen.queryByText(/TypeScript Tutorial/)).not.toBeInTheDocument()

        // Should be able to change search
        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'new search' } })
        expect(mockSetSearchQuery).toHaveBeenCalledWith('new search')
    })

    it('should filter notes by content', () => {
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: vi.fn(),
            searchQuery: 'flexbox',
            setSearchQuery: vi.fn()
        } as any)

        render(<SearchView />)
        expect(screen.getByText(/Flexbox/)).toBeInTheDocument()
        expect(screen.queryByText(/React/)).not.toBeInTheDocument()
    })

    it('should show no results message when no matches', () => {
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: vi.fn(),
            searchQuery: 'nonexistent',
            setSearchQuery: vi.fn()
        } as any)

        render(<SearchView />)
        expect(screen.getByText(/no results found/i)).toBeInTheDocument()
    })

    it('should display folder name for notes with folders', () => {
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: vi.fn(),
            searchQuery: '',
            setSearchQuery: vi.fn()
        } as any)

        render(<SearchView />)
        const devFolders = screen.getAllByText(/development/i)
        expect(devFolders.length).toBeGreaterThan(0)
    })

    it('should show content preview for each result', () => {
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: vi.fn(),
            searchQuery: '',
            setSearchQuery: vi.fn()
        } as any)

        render(<SearchView />)
        expect(screen.getByText(/Learn about useState/i)).toBeInTheDocument()
    })

    it('should highlight search matches in results', () => {
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: vi.fn(),
            searchQuery: 'react',
            setSearchQuery: vi.fn()
        } as any)

        render(<SearchView />)
        // Check that the note title is displayed (even if highlighted)
        expect(screen.getByText(/Hooks Guide/i)).toBeInTheDocument()
        // Check for the mark element
        const markElement = document.querySelector('mark')
        expect(markElement).toBeInTheDocument()
        expect(markElement?.textContent).toMatch(/react/i)
    })

    it('should select note when clicking on search result', () => {
        const mockSetSelectedNote = vi.fn()
        vi.mocked(useAppStore).mockReturnValue({
            notes: mockNotes,
            folders: mockFolders,
            setSelectedNote: mockSetSelectedNote,
            searchQuery: '',
            setSearchQuery: vi.fn()
        } as any)

        render(<SearchView />)
        fireEvent.click(screen.getByText('React Hooks Guide'))
        expect(mockSetSelectedNote).toHaveBeenCalledWith('1')
    })

    it('should show result count', () => {
        render(<SearchView />)
        expect(screen.getByText(/3 results/i)).toBeInTheDocument()
    })
})
