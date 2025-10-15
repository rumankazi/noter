import React from 'react'
import { useAppStore } from '../stores/appStore'

export const StatusBar: React.FC = () => {
    const { notes, folders, selectedNoteId } = useAppStore()
    const selectedNote = selectedNoteId ? notes.find(n => n.id === selectedNoteId) : null

    return (
        <div className="h-6 bg-vscode-accent text-white flex items-center justify-between px-3 text-xs">
            <div className="flex items-center space-x-4">
                <span>{notes.length} notes</span>
                <span>{folders.length} folders</span>
                {selectedNote && (
                    <span>
                        Last modified: {selectedNote.updatedAt.toLocaleDateString()}
                    </span>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <span>Noter v1.0.0</span>
            </div>
        </div>
    )
}