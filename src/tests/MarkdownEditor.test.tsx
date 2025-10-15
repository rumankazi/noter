import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MarkdownEditor } from '../renderer/src/components/MarkdownEditor'

// Mock markdown-it
vi.mock('markdown-it', () => {
    const mockMarkdownIt = vi.fn(() => ({
        render: vi.fn((content: string) => `<p>${content}</p>`)
    }))
    return { default: mockMarkdownIt }
})

describe('MarkdownEditor', () => {
    const mockProps = {
        content: '# Test Note\n\nThis is a **test** note.',
        onChange: vi.fn(),
        onSave: vi.fn(),
        title: 'Test Note',
        hasUnsavedChanges: true
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render the editor with content', () => {
        render(<MarkdownEditor {...mockProps} />)

        const textarea = screen.getByTestId('markdown-textarea')
        expect(textarea).toHaveValue(mockProps.content)
        expect(screen.getByText('Test Note')).toBeInTheDocument()
    })

    it('should toggle between edit and preview modes', async () => {
        render(<MarkdownEditor {...mockProps} />)

        // Get the preview button specifically (not the split preview button)
        const buttons = screen.getAllByRole('button')
        const previewButton = buttons.find(btn => btn.getAttribute('aria-label') === 'Preview')
        expect(previewButton).toBeDefined()

        fireEvent.click(previewButton!)

        await waitFor(() => {
            const editButton = buttons.find(btn => btn.getAttribute('aria-label') === 'Edit')
            expect(editButton).toBeInTheDocument()
        })

        const editButton = screen.getByRole('button', { name: /^edit$/i })
        fireEvent.click(editButton)

        await waitFor(() => {
            const previewButtonAgain = screen.getAllByRole('button').find(btn => btn.getAttribute('aria-label') === 'Preview')
            expect(previewButtonAgain).toBeDefined()
        })
    })

    it('should call onChange when content is modified', () => {
        render(<MarkdownEditor {...mockProps} />)

        const textarea = screen.getByTestId('markdown-textarea')
        fireEvent.change(textarea, { target: { value: 'New content' } })

        expect(mockProps.onChange).toHaveBeenCalledWith('New content')
    })

    it('should call onSave when save button is clicked', () => {
        render(<MarkdownEditor {...mockProps} />)

        const saveButton = screen.getByRole('button', { name: /save/i })
        fireEvent.click(saveButton)

        expect(mockProps.onSave).toHaveBeenCalled()
    })

    it('should render markdown preview correctly', async () => {
        render(<MarkdownEditor {...mockProps} />)

        const buttons = screen.getAllByRole('button')
        const previewButton = buttons.find(btn => btn.getAttribute('aria-label') === 'Preview')
        expect(previewButton).toBeDefined()

        fireEvent.click(previewButton!)

        await waitFor(() => {
            // Check that preview div is visible and edit button is present
            const editButton = screen.getAllByRole('button').find(btn => btn.getAttribute('aria-label') === 'Edit')
            expect(editButton).toBeInTheDocument()
            const previewDiv = document.querySelector('.prose')
            expect(previewDiv).toBeInTheDocument()
        })
    })

    it('should support keyboard shortcuts', () => {
        render(<MarkdownEditor {...mockProps} />)

        const textarea = screen.getByTestId('markdown-textarea')

        // Test Ctrl+S for save
        fireEvent.keyDown(textarea, { key: 's', ctrlKey: true })
        expect(mockProps.onSave).toHaveBeenCalled()
    })

    it('should have proper button positioning to avoid window controls', () => {
        render(<MarkdownEditor {...mockProps} />)

        const headerButtons = screen.getByTestId('editor-header-buttons')
        const computedStyle = getComputedStyle(headerButtons)

        // Should have right margin to avoid window controls
        expect(computedStyle.marginRight).toBe('120px')
    })

    it('should handle syntax highlighting in edit mode', () => {
        render(<MarkdownEditor {...mockProps} />)

        const editor = screen.getByTestId('markdown-textarea')
        expect(editor).toHaveClass('syntax-highlighted')
    })

    it('should support side-by-side preview mode', async () => {
        render(<MarkdownEditor {...mockProps} />)

        const splitButton = screen.getByRole('button', { name: /split preview/i })
        fireEvent.click(splitButton)

        await waitFor(() => {
            // Should have both textarea and preview visible
            const textarea = screen.getByTestId('markdown-textarea')
            expect(textarea).toBeInTheDocument()
            expect(textarea).toHaveStyle({ width: '50%' })

            const previewDivs = document.querySelectorAll('.prose')
            expect(previewDivs.length).toBeGreaterThan(0)
        })
    })
})