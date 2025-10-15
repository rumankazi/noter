import React from 'react'
import { Trash2 } from 'lucide-react'
import { Note } from '@shared/types'
import { useAppStore } from '../stores/appStore'
import { MarkdownEditor } from './MarkdownEditor'

interface NoteEditorProps {
    note: Note
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note }) => {
    const { updateNote, showConfirmDialog, deleteNote } = useAppStore()
    const [title, setTitle] = React.useState(note.title)
    const [content, setContent] = React.useState(note.content)
    const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
    const [autoSaveSettings, setAutoSaveSettings] = React.useState<any>(null)

    // Use refs to access latest values in cleanup functions
    const titleRef = React.useRef(title)
    const contentRef = React.useRef(content)
    const noteIdRef = React.useRef(note.id)

    React.useEffect(() => {
        titleRef.current = title
        contentRef.current = content
        noteIdRef.current = note.id
    }, [title, content, note.id])

    // Load auto-save settings
    React.useEffect(() => {
        const loadSettings = async () => {
            try {
                if (window.electronAPI?.settings) {
                    const settings = await window.electronAPI.settings.getAutoSaveSettings()
                    setAutoSaveSettings(settings)
                }
            } catch (error) {
                console.error('Failed to load auto-save settings:', error)
            }
        }
        loadSettings()
    }, [])

    const handleSave = React.useCallback(async () => {
        const currentTitle = titleRef.current
        const currentContent = contentRef.current
        const currentNoteId = noteIdRef.current

        // Check if there are actual changes
        if (currentTitle === note.title && currentContent === note.content) {
            return
        }

        try {
            if (window.electronAPI) {
                const updatedNote = await window.electronAPI.notes.update({
                    id: currentNoteId,
                    title: currentTitle,
                    content: currentContent
                })
                if (updatedNote) {
                    updateNote(updatedNote)
                    setHasUnsavedChanges(false)
                }
            }
        } catch (error) {
            console.error('Failed to save note:', error)
        }
    }, [note.title, note.content, updateNote])

    // Auto-save before switching notes or unmounting
    React.useEffect(() => {
        return () => {
            // Save on unmount if there are changes
            if (titleRef.current !== note.title || contentRef.current !== note.content) {
                handleSave()
            }
        }
    }, [note.id, note.title, note.content, handleSave])

    // Update local state when note changes
    React.useEffect(() => {
        setTitle(note.title)
        setContent(note.content)
        setHasUnsavedChanges(false)
    }, [note.id, note.title, note.content])

    // Track changes
    React.useEffect(() => {
        const hasChanges = title !== note.title || content !== note.content
        setHasUnsavedChanges(hasChanges)
    }, [title, content, note.title, note.content])

    // Auto-save on window blur or focus loss (respects settings)
    React.useEffect(() => {
        const handleBlur = () => {
            if (autoSaveSettings?.onFocusChange) {
                if (titleRef.current !== note.title || contentRef.current !== note.content) {
                    handleSave()
                }
            }
        }

        window.addEventListener('blur', handleBlur)
        return () => window.removeEventListener('blur', handleBlur)
    }, [note.title, note.content, handleSave, autoSaveSettings])

    // Interval-based auto-save (respects settings)
    React.useEffect(() => {
        if (!autoSaveSettings?.intervalEnabled || !autoSaveSettings?.intervalSeconds) {
            return
        }

        const intervalMs = autoSaveSettings.intervalSeconds * 1000
        const intervalId = setInterval(() => {
            if (titleRef.current !== note.title || contentRef.current !== note.content) {
                handleSave()
            }
        }, intervalMs)

        return () => clearInterval(intervalId)
    }, [note.title, note.content, handleSave, autoSaveSettings])

    const handleContentChange = (newContent: string) => {
        setContent(newContent)
    }

    const handleDelete = () => {
        showConfirmDialog(
            'Delete Note',
            `Are you sure you want to delete "${title || 'Untitled'}"? This action cannot be undone.`,
            () => deleteNote(note.id)
        )
    }

    return (
        <div className="h-full flex flex-col">
            {/* Title Input */}
            <div className="border-b border-vscode-border bg-vscode-background p-3 flex items-center gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                        flex-1 bg-transparent text-lg font-medium text-vscode-foreground
                        border-none outline-none
                        placeholder-vscode-foreground placeholder-opacity-50
                    "
                    placeholder="Note title..."
                />
                <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-red-600 hover:text-white rounded opacity-60 hover:opacity-100 transition-all flex-shrink-0"
                    title="Delete note"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Markdown Editor */}
            <div className="flex-1">
                <MarkdownEditor
                    content={content}
                    onChange={handleContentChange}
                    onSave={handleSave}
                    title={title}
                    hasUnsavedChanges={hasUnsavedChanges}
                />
            </div>
        </div>
    )
}