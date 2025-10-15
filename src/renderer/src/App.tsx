import React from 'react'
import { Layout } from './components/Layout'
import { useAppStore } from './stores/appStore'

export const App: React.FC = () => {
    const {
        initializeApp,
        createNewNote,
        createNewFolder,
        openCommandPalette,
        saveCurrentNote
    } = useAppStore()

    React.useEffect(() => {
        initializeApp()

        // Setup menu event listeners
        const handleMenuEvent = (event: string) => {
            console.log('Menu event:', event)
            switch (event) {
                case 'new-note':
                    createNewNote()
                    break
                case 'new-folder':
                    createNewFolder()
                    break
                case 'command-palette':
                    openCommandPalette()
                    break
                case 'save':
                    saveCurrentNote()
                    break
                default:
                    console.log('Unhandled menu event:', event)
            }
        }

        // Setup keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault()
                openCommandPalette()
            } else if (e.ctrlKey && e.shiftKey && e.key === 'N') {
                e.preventDefault()
                createNewFolder()
            } else if (e.ctrlKey && e.key === 'n') {
                e.preventDefault()
                createNewNote()
            }
        }

        if (window.electronAPI) {
            window.electronAPI.onMenuEvent(handleMenuEvent)
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            if (window.electronAPI) {
                window.electronAPI.removeAllListeners()
            }
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [initializeApp, createNewNote, createNewFolder, openCommandPalette, saveCurrentNote])

    return (
        <div className="h-screen bg-vscode-background text-vscode-foreground">
            <Layout />
        </div>
    )
}