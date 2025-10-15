import React from 'react'
import { useAppStore } from '../stores/appStore'
import { NoteEditor } from './NoteEditor'
import { SettingsPage } from './SettingsPage'

interface EditorAreaProps {
    activeView: string
}

export const EditorArea: React.FC<EditorAreaProps> = ({ activeView }) => {
    const { selectedNoteId, notes } = useAppStore()

    // Show settings page when settings view is active
    if (activeView === 'settings') {
        return (
            <div className="flex-1 bg-vscode-editorBackground">
                <SettingsPage />
            </div>
        )
    }

    // Default explorer view behavior
    const selectedNote = selectedNoteId ? notes.find(n => n.id === selectedNoteId) : null

    if (!selectedNote) {
        return (
            <div className="flex-1 bg-vscode-editorBackground flex items-center justify-center">
                <div className="text-center text-vscode-foreground opacity-60">
                    <h2 className="text-xl mb-2">Welcome to Noter</h2>
                    <p>Select a note to start editing, or create a new one.</p>
                    <div className="mt-4 space-y-2 text-sm">
                        <p><kbd className="bg-vscode-inputBackground px-2 py-1 rounded">Ctrl+N</kbd> New Note</p>
                        <p><kbd className="bg-vscode-inputBackground px-2 py-1 rounded">Ctrl+Shift+N</kbd> New Folder</p>
                        <p><kbd className="bg-vscode-inputBackground px-2 py-1 rounded">Ctrl+Shift+P</kbd> Command Palette</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 bg-vscode-editorBackground">
            <NoteEditor note={selectedNote} />
        </div>
    )
}