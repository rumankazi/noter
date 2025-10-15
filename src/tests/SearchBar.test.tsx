import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../renderer/src/components/SearchBar'
import { useAppStore } from '../renderer/src/stores/appStore'

vi.mock('../renderer/src/stores/appStore')

describe('SearchBar', () => {
    beforeEach(() => {
        vi.mocked(useAppStore).mockReturnValue({
            searchQuery: '',
            setSearchQuery: vi.fn()
        } as any)
    })

    it('should render search input', () => {
        render(<SearchBar />)
        expect(screen.getByPlaceholderText('Search notes...')).toBeInTheDocument()
    })

    it('should display current search query', () => {
        vi.mocked(useAppStore).mockReturnValue({
            searchQuery: 'test query',
            setSearchQuery: vi.fn()
        } as any)

        render(<SearchBar />)
        const input = screen.getByPlaceholderText('Search notes...') as HTMLInputElement
        expect(input.value).toBe('test query')
    })

    it('should call setSearchQuery when input changes', () => {
        const mockSetSearchQuery = vi.fn()
        vi.mocked(useAppStore).mockReturnValue({
            searchQuery: '',
            setSearchQuery: mockSetSearchQuery
        } as any)

        render(<SearchBar />)
        const input = screen.getByPlaceholderText('Search notes...')
        fireEvent.change(input, { target: { value: 'new search' } })

        expect(mockSetSearchQuery).toHaveBeenCalledWith('new search')
    })

    it('should render search icon', () => {
        render(<SearchBar />)
        // Check for the SVG element with the search class
        const container = screen.getByPlaceholderText('Search notes...').parentElement
        const searchIcon = container?.querySelector('svg')
        expect(searchIcon).toBeInTheDocument()
    })

    it('should have proper styling and focus state', () => {
        render(<SearchBar />)
        const input = screen.getByPlaceholderText('Search notes...')
        expect(input).toHaveClass('focus:ring-vscode-accent')
    })
})
