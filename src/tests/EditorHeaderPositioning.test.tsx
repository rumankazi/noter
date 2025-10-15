import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EditorHeader } from '../renderer/src/components/EditorHeader'

// Mock the app store
const mockUseAppStore = vi.fn()
vi.mock('../renderer/src/stores/appStore', () => ({
    useAppStore: () => mockUseAppStore()
}))

describe('EditorHeader - Icon Buttons and Save State', () => {
    const mockProps = {
        title: 'Test Note',
        previewMode: 'none' as const,
        onTogglePreview: vi.fn(),
        onToggleSplit: vi.fn(),
        onSave: vi.fn(),
        hasUnsavedChanges: false
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseAppStore.mockReturnValue({
            selectedNoteId: 'note-1'
        })
    })

    it('should position buttons to avoid window controls', () => {
        render(<EditorHeader {...mockProps} />)

        const buttonContainer = screen.getByTestId('editor-header-buttons')
        const computedStyle = getComputedStyle(buttonContainer)

        // Should have sufficient right margin to avoid overlapping with window controls
        expect(computedStyle.marginRight).toBe('120px')
    })

    it('should have proper spacing between buttons', () => {
        render(<EditorHeader {...mockProps} />)

        const buttonContainer = screen.getByTestId('editor-header-buttons')
        expect(buttonContainer).toHaveClass('space-x-2')
    })

    it('should maintain proper vertical alignment', () => {
        render(<EditorHeader {...mockProps} />)

        const header = screen.getByTestId('editor-header')
        expect(header).toHaveClass('items-center')
    })

    it('should have consistent height to avoid layout shifts', () => {
        render(<EditorHeader {...mockProps} />)

        const header = screen.getByTestId('editor-header')
        const computedStyle = getComputedStyle(header)

        expect(computedStyle.height).toBe('48px')
    })

    it('should position buttons in a flex container', () => {
        render(<EditorHeader {...mockProps} />)

        const buttonContainer = screen.getByTestId('editor-header-buttons')
        expect(buttonContainer).toHaveClass('flex')
        expect(buttonContainer).toHaveClass('items-center')
    })

    it('should show icon-based buttons with proper styling', () => {
        render(<EditorHeader {...mockProps} />)

        const buttons = screen.getAllByRole('button')
        const previewButton = buttons.find(btn => btn.getAttribute('aria-label') === 'Preview')
        const saveButton = screen.getByRole('button', { name: /save/i })

        expect(previewButton).toBeInTheDocument()
        expect(saveButton).toBeInTheDocument()

        // Buttons should have icon-based styling
        expect(previewButton).toHaveClass('p-2')
        expect(saveButton).toHaveClass('p-2')
    })

    it('should enable save button when there are unsaved changes', () => {
        const propsWithChanges = { ...mockProps, hasUnsavedChanges: true }
        render(<EditorHeader {...propsWithChanges} />)

        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).not.toBeDisabled()
        expect(saveButton).toHaveClass('text-vscode-accent')
    })

    it('should disable save button when no unsaved changes', () => {
        const propsWithoutChanges = { ...mockProps, hasUnsavedChanges: false }
        render(<EditorHeader {...propsWithoutChanges} />)

        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeDisabled()
        expect(saveButton).toHaveClass('opacity-50')
    })

    it('should call onSave when save button is clicked', () => {
        const propsWithChanges = { ...mockProps, hasUnsavedChanges: true }
        render(<EditorHeader {...propsWithChanges} />)

        const saveButton = screen.getByRole('button', { name: /save/i })
        fireEvent.click(saveButton)

        expect(mockProps.onSave).toHaveBeenCalled()
    })
})