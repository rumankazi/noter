import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActivityBar } from '../renderer/src/components/ActivityBar'

describe('ActivityBar', () => {
    it('should render all activity items', () => {
        const mockOnViewChange = vi.fn()
        render(<ActivityBar activeView="explorer" onViewChange={mockOnViewChange} />)

        expect(screen.getByTitle('Explorer')).toBeInTheDocument()
        expect(screen.getByTitle('Search')).toBeInTheDocument()
        expect(screen.getByTitle('Settings')).toBeInTheDocument()
    })

    it('should highlight the active view', () => {
        const mockOnViewChange = vi.fn()
        const { rerender } = render(<ActivityBar activeView="explorer" onViewChange={mockOnViewChange} />)

        const explorerButton = screen.getByTitle('Explorer')
        expect(explorerButton).toHaveClass('bg-vscode-listActive')

        rerender(<ActivityBar activeView="search" onViewChange={mockOnViewChange} />)
        const searchButton = screen.getByTitle('Search')
        expect(searchButton).toHaveClass('bg-vscode-listActive')
    })

    it('should call onViewChange when clicking activity items', () => {
        const mockOnViewChange = vi.fn()
        render(<ActivityBar activeView="explorer" onViewChange={mockOnViewChange} />)

        fireEvent.click(screen.getByTitle('Search'))
        expect(mockOnViewChange).toHaveBeenCalledWith('search')

        fireEvent.click(screen.getByTitle('Settings'))
        expect(mockOnViewChange).toHaveBeenCalledWith('settings')
    })

    it('should have proper accessibility attributes', () => {
        const mockOnViewChange = vi.fn()
        render(<ActivityBar activeView="explorer" onViewChange={mockOnViewChange} />)

        const explorerButton = screen.getByTitle('Explorer')
        expect(explorerButton.tagName).toBe('BUTTON')
        expect(explorerButton).toHaveAttribute('title', 'Explorer')
    })
})
