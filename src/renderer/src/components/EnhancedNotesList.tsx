import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { NoteItem } from './NoteItem'
import { Note } from '@shared/types'

interface FolderHeaderProps {
    folderId: string
    folderName: string
    noteCount: number
}

const FolderHeader: React.FC<FolderHeaderProps> = ({ folderId, folderName, noteCount }) => {
    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        const noteId = e.dataTransfer.getData('noteId')
        if (noteId && window.electronAPI) {
            try {
                const updatedNote = await window.electronAPI.notes.update({
                    id: noteId,
                    folderId: folderId === 'general' ? undefined : folderId
                })
                useAppStore.getState().updateNote(updatedNote)
            } catch (error) {
                console.error('Failed to move note:', error)
            }
        }
    }

    return (
        <div
            className={`
                px-3 py-2 bg-vscode-sidebarBackground border-b border-vscode-border transition-colors
                ${isDragOver ? 'bg-vscode-accent bg-opacity-20 border-l-4 border-vscode-accent' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h4 className="text-xs font-semibold text-vscode-foreground opacity-80 uppercase">
                {folderName} ({noteCount})
            </h4>
        </div>
    )
}

export const EnhancedNotesList: React.FC = () => {
    const { notes, folders, searchQuery, createNewNote } = useAppStore()

    // Group notes by folder
    const groupedNotes = useMemo(() => {
        const filtered = searchQuery
            ? notes.filter(note => {
                const query = searchQuery.toLowerCase()
                return note.title.toLowerCase().includes(query) ||
                    note.content.toLowerCase().includes(query)
            })
            : notes

        // Group by folder
        const groups = new Map<string, Note[]>()

        filtered.forEach(note => {
            const folderId = note.folderId || 'general'
            if (!groups.has(folderId)) {
                groups.set(folderId, [])
            }
            groups.get(folderId)!.push(note)
        })

        return groups
    }, [notes, searchQuery])

    const getFolderName = (folderId: string): string => {
        if (folderId === 'general') return 'General'
        const folder = folders.find(f => f.id === folderId)
        return folder?.name || 'Unknown'
    }

    const handleCreateNote = () => {
        createNewNote() // Create in default/general folder
    }

    return (
        <div>
            <div className="flex items-center justify-between p-2 border-b border-vscode-border">
                <h3 className="text-xs font-medium text-vscode-foreground opacity-70 uppercase">
                    All Notes {notes.length > 0 && `(${notes.length})`}
                </h3>
                <button
                    onClick={handleCreateNote}
                    className="p-1 hover:bg-vscode-listHover rounded"
                    title="New Note"
                >
                    <Plus size={12} className="text-vscode-foreground" />
                </button>
            </div>

            <div className="max-h-96 overflow-auto">
                {groupedNotes.size === 0 ? (
                    <div className="p-4 text-center text-vscode-foreground opacity-50">
                        {searchQuery ? 'No notes found' : 'No notes yet'}
                    </div>
                ) : (
                    Array.from(groupedNotes.entries()).map(([folderId, folderNotes]) => (
                        <div key={folderId} className="mb-2">
                            <FolderHeader
                                folderId={folderId}
                                folderName={getFolderName(folderId)}
                                noteCount={folderNotes.length}
                            />
                            {folderNotes.map(note => (
                                <div key={note.id} className="group">
                                    <NoteItem note={note} />
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}