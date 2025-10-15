import React, { useState } from 'react'
import { FileText, Trash2 } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { Note } from '@shared/types'
import { format } from 'date-fns'

interface NoteItemProps {
    note: Note
}

export const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
    const { selectedNoteId, setSelectedNote, showConfirmDialog, deleteNote } = useAppStore()
    const [isHovered, setIsHovered] = useState(false)
    const isSelected = selectedNoteId === note.id

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('noteId', note.id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent note selection

        showConfirmDialog(
            'Delete Note',
            `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
            () => deleteNote(note.id)
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Delete' && isSelected) {
            showConfirmDialog(
                'Delete Note',
                `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
                () => deleteNote(note.id)
            )
        }
    }

    return (
        <div
            className={`
                flex items-center px-3 py-2 cursor-pointer hover:bg-vscode-listHover
                ${isSelected ? 'bg-vscode-listActive border-l-2 border-vscode-accent' : ''}
            `}
            onClick={() => setSelectedNote(note.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onKeyDown={handleKeyDown}
            draggable
            onDragStart={handleDragStart}
            tabIndex={0}
            data-testid="note-item"
        >
            <FileText size={16} className="mr-3 text-vscode-foreground opacity-70 flex-shrink-0" />

            <div className="flex-1 min-w-0">
                <div className="text-sm text-vscode-foreground truncate">
                    {note.title || 'Untitled'}
                </div>
                <div className="text-xs text-vscode-foreground opacity-50 truncate">
                    {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                </div>
            </div>

            {isHovered && (
                <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-red-600 hover:text-white rounded opacity-60 hover:opacity-100 transition-all"
                    title="Delete note"
                    aria-label="Delete note"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    )
}