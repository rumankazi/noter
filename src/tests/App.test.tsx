import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '../renderer/src/App'

// Mock electron API
Object.assign(global.window, {
    electronAPI: {
        notes: {
            getAll: () => Promise.resolve([]),
            getById: () => Promise.resolve(null),
            create: () => Promise.resolve({}),
            update: () => Promise.resolve({}),
            delete: () => Promise.resolve(true),
            search: () => Promise.resolve([])
        },
        folders: {
            getAll: () => Promise.resolve([]),
            create: () => Promise.resolve({}),
            update: () => Promise.resolve({}),
            delete: () => Promise.resolve(true)
        },
        onMenuEvent: () => { },
        removeAllListeners: () => { }
    }
})

describe('App', () => {
    it('renders welcome message', () => {
        render(<App />)
        expect(screen.getByText('Welcome to Noter')).toBeInTheDocument()
    })
})