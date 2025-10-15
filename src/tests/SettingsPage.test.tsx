import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SettingsPage } from '../renderer/src/components/SettingsPage'

// Mock electron API
const mockElectronAPI = {
    settings: {
        getDataLocation: vi.fn(),
        setDataLocation: vi.fn(),
        openDirectoryDialog: vi.fn(),
        getAutoSaveSettings: vi.fn(),
        setAutoSaveSettings: vi.fn()
    }
}

Object.defineProperty(window, 'electronAPI', {
    value: mockElectronAPI,
    writable: true
})

describe('SettingsPage', () => {
    const defaultAutoSaveSettings = {
        enabled: true,
        onFocusChange: true,
        intervalMinutes: 2,
        intervalEnabled: true
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockElectronAPI.settings.getDataLocation.mockResolvedValue('C:\\Users\\test\\AppData\\Noter')
        mockElectronAPI.settings.getAutoSaveSettings.mockResolvedValue(defaultAutoSaveSettings)
    })

    it('should display current data location', async () => {
        render(<SettingsPage />)

        await waitFor(() => {
            expect(screen.getByText('C:\\Users\\test\\AppData\\Noter')).toBeInTheDocument()
        })
    })

    it('should show browse button to change data location', async () => {
        render(<SettingsPage />)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument()
        })
    })

    it('should open directory dialog when browse is clicked', async () => {
        mockElectronAPI.settings.openDirectoryDialog.mockResolvedValue('C:\\New\\Location')

        render(<SettingsPage />)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument()
        })

        const browseButton = screen.getByRole('button', { name: /browse/i })
        fireEvent.click(browseButton)

        expect(mockElectronAPI.settings.openDirectoryDialog).toHaveBeenCalled()
    })

    it('should update data location when new path is selected', async () => {
        mockElectronAPI.settings.openDirectoryDialog.mockResolvedValue('C:\\New\\Location')

        render(<SettingsPage />)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument()
        })

        const browseButton = screen.getByRole('button', { name: /browse/i })
        fireEvent.click(browseButton)

        await waitFor(() => {
            expect(mockElectronAPI.settings.setDataLocation).toHaveBeenCalledWith('C:\\New\\Location')
        })
    })

    it('should show data location section with proper labels', async () => {
        render(<SettingsPage />)

        await waitFor(() => {
            expect(screen.getByText('Data Storage')).toBeInTheDocument()
        })
        expect(screen.getByText('Current Location:')).toBeInTheDocument()
        expect(screen.getByText('Notes and folders are stored in this directory.')).toBeInTheDocument()
    })

    it('should display database file size information', async () => {
        mockElectronAPI.settings.getDataLocation.mockResolvedValue('C:\\Users\\test\\AppData\\Noter')

        render(<SettingsPage />)

        await waitFor(() => {
            expect(screen.getByText(/Database size:/)).toBeInTheDocument()
        })
    })

    it('should show export/import options', async () => {
        render(<SettingsPage />)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /export data/i })).toBeInTheDocument()
        })
        expect(screen.getByRole('button', { name: /import data/i })).toBeInTheDocument()
    })
})