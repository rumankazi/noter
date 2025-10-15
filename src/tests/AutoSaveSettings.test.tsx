import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AutoSaveSettings } from '../renderer/src/components/AutoSaveSettings'

// Mock electron API
const mockElectronAPI = {
    settings: {
        getAutoSaveSettings: vi.fn(),
        setAutoSaveSettings: vi.fn()
    }
}

Object.defineProperty(window, 'electronAPI', {
    value: mockElectronAPI,
    writable: true
})

describe('AutoSaveSettings', () => {
    const defaultSettings = {
        enabled: true,
        onFocusChange: true,
        intervalSeconds: 120, // 2 minutes
        intervalEnabled: true
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockElectronAPI.settings.getAutoSaveSettings.mockResolvedValue(defaultSettings)
    })

    it('should display current auto-save settings', async () => {
        render(<AutoSaveSettings />)

        await waitFor(() => {
            // Should show 120 seconds
            expect(screen.getByDisplayValue('120')).toBeInTheDocument()
        })

        const focusChangeToggle = screen.getByLabelText(/auto-save on focus change/i)
        expect(focusChangeToggle).toBeChecked()

        const intervalToggle = screen.getByLabelText(/auto-save at regular intervals/i)
        expect(intervalToggle).toBeChecked()
    })

    it('should allow toggling focus change auto-save', async () => {
        render(<AutoSaveSettings />)

        await waitFor(() => {
            expect(screen.getByLabelText(/auto-save on focus change/i)).toBeInTheDocument()
        })

        const focusChangeToggle = screen.getByLabelText(/auto-save on focus change/i)
        fireEvent.click(focusChangeToggle)

        expect(mockElectronAPI.settings.setAutoSaveSettings).toHaveBeenCalledWith({
            ...defaultSettings,
            onFocusChange: false
        })
    })

    it('should allow changing auto-save interval', async () => {
        render(<AutoSaveSettings />)

        await waitFor(() => {
            expect(screen.getByDisplayValue('120')).toBeInTheDocument()
        })

        const intervalInput = screen.getByDisplayValue('120')
        fireEvent.change(intervalInput, { target: { value: '300' } })
        fireEvent.blur(intervalInput)

        // 300 seconds = 5 minutes
        expect(mockElectronAPI.settings.setAutoSaveSettings).toHaveBeenCalledWith({
            ...defaultSettings,
            intervalSeconds: 300
        })
    })

    it('should show help text for auto-save options', async () => {
        render(<AutoSaveSettings />)

        await waitFor(() => {
            expect(screen.getByDisplayValue('120')).toBeInTheDocument()
        })

        expect(screen.getByText(/automatically save notes when switching between notes or losing focus/i)).toBeInTheDocument()
        expect(screen.getByText(/automatically save notes at regular intervals while editing/i)).toBeInTheDocument()
    })

    it('should disable interval input when interval auto-save is off', async () => {
        const settingsWithIntervalOff = { ...defaultSettings, intervalEnabled: false }
        mockElectronAPI.settings.getAutoSaveSettings.mockResolvedValue(settingsWithIntervalOff)

        render(<AutoSaveSettings />)

        await waitFor(() => {
            expect(screen.getByDisplayValue('120')).toBeInTheDocument()
        })

        const intervalInput = screen.getByDisplayValue('120')
        expect(intervalInput).toBeDisabled()
    })
})
