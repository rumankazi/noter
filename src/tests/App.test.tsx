import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '../renderer/src/App'

// Note: electronAPI is already mocked in setup.ts, 
// but we'll extend it for App-specific needs
if ((window as any).electronAPI) {
    Object.assign((window as any).electronAPI, {
        onMenuEvent: () => { },
        removeAllListeners: () => { }
    })
}

describe('App', () => {
    it('renders welcome message', () => {
        render(<App />)
        expect(screen.getByText('Welcome to Noter')).toBeInTheDocument()
    })
})
