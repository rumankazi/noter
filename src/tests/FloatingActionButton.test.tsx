import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FloatingActionButton } from '../renderer/src/components/FloatingActionButton'
import { useAppStore } from '../renderer/src/stores/appStore'

// Mock the store
vi.mock('../renderer/src/stores/appStore', () => ({
    useAppStore: vi.fn()
}))

// Mock electron API
Object.assign(global.window, {
    electronAPI: {
        notes: {
            create: vi.fn().mockResolvedValue({ id: '1', title: 'Test Note', content: '', createdAt: new Date(), updatedAt: new Date() })
        },
        folders: {
            create: vi.fn().mockResolvedValue({ id: '1', name: 'Test Folder', createdAt: new Date(), updatedAt: new Date() })
        }
    }
})

// Mock prompt
global.prompt = vi.fn().mockReturnValue('Test Title')

describe('FloatingActionButton', () => {
    const mockCreateNewNote = vi.fn()
    const mockCreateNewFolder = vi.fn()

    beforeEach(() => {
        vi.mocked(useAppStore).mockReturnValue({
            createNewNote: mockCreateNewNote,
            createNewFolder: mockCreateNewFolder
        } as any)

        vi.clearAllMocks()
    })

    it('renders the floating action button', () => {
        render(<FloatingActionButton />)

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('title', 'Click: New Note | Long Press: More Options')
    })

    it('calls createNewNote on click', () => {
        render(<FloatingActionButton />)

        const button = screen.getByRole('button')

        // Simulate mouseDown and mouseUp quickly (short press)
        fireEvent.mouseDown(button)
        fireEvent.mouseUp(button)

        expect(mockCreateNewNote).toHaveBeenCalledTimes(1)
    })

    it('shows expanded options on mouse down and hold', async () => {
        render(<FloatingActionButton />)

        const button = screen.getByRole('button')
        fireEvent.mouseDown(button)

        // Wait for long press timeout
        await new Promise(resolve => setTimeout(resolve, 600))

        expect(screen.getByText('New Note')).toBeInTheDocument()
        expect(screen.getByText('New Folder')).toBeInTheDocument()
    })
})
