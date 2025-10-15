import React from 'react'
import { Folder, FolderOpen, Plus, ChevronDown, ChevronRight, FileText, Edit2, Trash2, MoreVertical } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { Folder as FolderType, Note } from '@shared/types'
import { format } from 'date-fns'

interface FolderItemProps {
    folder: FolderType
    level: number
}

interface NoteInFolderProps {
    note: Note
    level: number
    isSelected: boolean
    onClick: () => void
    onDelete: () => void
}

const NoteInFolder: React.FC<NoteInFolderProps> = ({ note, level, isSelected, onClick, onDelete }) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('noteId', note.id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDelete()
    }

    return (
        <div
            className={`
                flex items-center px-2 py-1 cursor-pointer hover:bg-vscode-listHover transition-colors group
                ${isSelected ? 'bg-vscode-listActive border-l-2 border-vscode-accent' : ''}
            `}
            style={{ paddingLeft: `${24 + level * 16}px` }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
        >
            <FileText size={14} className="mr-2 text-vscode-foreground opacity-60 flex-shrink-0" />
            <span className="text-sm text-vscode-foreground truncate flex-1">
                {note.title || 'Untitled'}
            </span>
            <span className="text-xs text-vscode-foreground opacity-40 ml-1 flex-shrink-0">
                {format(new Date(note.updatedAt), 'MMM d')}
            </span>
            {isHovered && (
                <button
                    onClick={handleDelete}
                    className="ml-1 p-1 hover:bg-red-600 hover:text-white rounded opacity-60 hover:opacity-100 transition-all flex-shrink-0"
                    title="Delete note"
                >
                    <Trash2 size={12} />
                </button>
            )}
        </div>
    )
}

// Component for the General folder (notes without a folder)
const GeneralFolder: React.FC = () => {
    const { notes, setSelectedNote, selectedNoteId, showConfirmDialog, deleteNote, createNewNote } = useAppStore()
    const [isExpanded, setIsExpanded] = React.useState(true)
    const [isDragOver, setIsDragOver] = React.useState(false)

    const generalNotes = notes.filter(n => !n.folderId)
    const hasNotes = generalNotes.length > 0

    const handleToggleExpanded = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsExpanded(!isExpanded)
    }

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
                // Set folderId to undefined to move to General
                const updatedNote = await window.electronAPI.notes.update({
                    id: noteId,
                    folderId: undefined
                })
                useAppStore.getState().updateNote(updatedNote)
            } catch (error) {
                console.error('Failed to move note:', error)
            }
        }
    }

    const handleCreateNote = (e: React.MouseEvent) => {
        e.stopPropagation()
        createNewNote(undefined) // Create note without folder assignment
    }

    return (
        <div className="mb-2">
            <div
                className={`
                    flex items-center px-2 py-1 cursor-pointer hover:bg-vscode-listHover transition-colors group
                    ${isDragOver ? 'bg-vscode-accent bg-opacity-20 border-l-2 border-vscode-accent' : ''}
                `}
                style={{ paddingLeft: '8px' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {hasNotes ? (
                    <button onClick={handleToggleExpanded} className="mr-1">
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                ) : (
                    <div className="w-4 mr-1" />
                )}

                <Folder size={16} className="mr-2 text-vscode-foreground opacity-50" />

                <span className="text-sm text-vscode-foreground truncate flex-1 opacity-70">
                    General
                </span>

                {hasNotes && (
                    <span className="text-xs text-vscode-foreground opacity-50 ml-1 mr-1">
                        {generalNotes.length}
                    </span>
                )}

                {/* Add note button */}
                <button
                    onClick={handleCreateNote}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-vscode-listHover rounded transition-opacity"
                    title="New Note in General"
                >
                    <Plus size={12} className="text-vscode-foreground" />
                </button>
            </div>

            {isExpanded && hasNotes && (
                <div>
                    {generalNotes.map(note => {
                        const handleDeleteNote = () => {
                            showConfirmDialog(
                                'Delete Note',
                                `Are you sure you want to delete "${note.title || 'Untitled'}"? This action cannot be undone.`,
                                () => deleteNote(note.id)
                            )
                        }
                        return (
                            <NoteInFolder
                                key={note.id}
                                note={note}
                                level={0}
                                isSelected={selectedNoteId === note.id}
                                onClick={() => setSelectedNote(note.id)}
                                onDelete={handleDeleteNote}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, level }) => {
    const { folders, notes, selectedFolderId, setSelectedFolder, setSelectedNote, selectedNoteId, renameFolder, deleteFolder, showConfirmDialog, deleteNote } = useAppStore()
    const [isExpanded, setIsExpanded] = React.useState(true)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [showMenu, setShowMenu] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)

    const children = folders.filter(f => f.parentId === folder.id)
    const folderNotes = notes.filter(n => n.folderId === folder.id)
    const hasChildren = children.length > 0
    const hasNotes = folderNotes.length > 0
    const isSelected = selectedFolderId === folder.id

    const handleToggleExpanded = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsExpanded(!isExpanded)
    }

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
                    folderId: folder.id
                })
                useAppStore.getState().updateNote(updatedNote)
            } catch (error) {
                console.error('Failed to move note:', error)
            }
        }
    }

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
    }

    const handleRename = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowMenu(false)
        renameFolder(folder.id)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowMenu(false)
        deleteFolder(folder.id)
    }

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showMenu])

    return (
        <div>
            <div
                className={`
          flex items-center px-2 py-1 cursor-pointer hover:bg-vscode-listHover transition-colors group relative
          ${isSelected ? 'bg-vscode-listActive' : ''}
          ${isDragOver ? 'bg-vscode-accent bg-opacity-20 border-l-2 border-vscode-accent' : ''}
        `}
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={() => setSelectedFolder(folder.id)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {(hasChildren || hasNotes) && (
                    <button onClick={handleToggleExpanded} className="mr-1">
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                )}

                {!hasChildren && !hasNotes && <div className="w-4 mr-1" />}

                {isSelected ? (
                    <FolderOpen size={16} className="mr-2 text-vscode-accent" />
                ) : (
                    <Folder size={16} className="mr-2 text-vscode-foreground opacity-70" />
                )}

                <span className="text-sm text-vscode-foreground truncate flex-1">
                    {folder.name}
                </span>

                {(hasChildren || hasNotes) && (
                    <span className="text-xs text-vscode-foreground opacity-50 ml-1">
                        {children.length + folderNotes.length}
                    </span>
                )}

                {/* Context menu button */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={handleMenuToggle}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-vscode-listHover rounded transition-opacity"
                        title="More options"
                    >
                        <MoreVertical size={12} className="text-vscode-foreground" />
                    </button>

                    {/* Dropdown menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-6 bg-vscode-dropdown-background border border-vscode-dropdown-border rounded shadow-lg z-50 min-w-[120px]">
                            <button
                                onClick={handleRename}
                                className="w-full flex items-center px-3 py-2 text-sm text-vscode-foreground hover:bg-vscode-listHover transition-colors"
                            >
                                <Edit2 size={14} className="mr-2" />
                                Rename
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center px-3 py-2 text-sm text-red-500 hover:bg-vscode-listHover transition-colors"
                            >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div>
                    {/* Child folders */}
                    {children.map(child => (
                        <FolderItem key={child.id} folder={child} level={level + 1} />
                    ))}

                    {/* Notes in this folder */}
                    {folderNotes.map(note => {
                        const handleDeleteNote = () => {
                            showConfirmDialog(
                                'Delete Note',
                                `Are you sure you want to delete "${note.title || 'Untitled'}"? This action cannot be undone.`,
                                () => deleteNote(note.id)
                            )
                        }
                        return (
                            <NoteInFolder
                                key={note.id}
                                note={note}
                                level={level + 1}
                                isSelected={selectedNoteId === note.id}
                                onClick={() => setSelectedNote(note.id)}
                                onDelete={handleDeleteNote}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export const FolderTree: React.FC = () => {
    const { folders, createNewFolder } = useAppStore()
    const rootFolders = folders.filter(f => !f.parentId)

    const handleCreateFolder = () => {
        createNewFolder()
    }

    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-vscode-foreground opacity-70 uppercase">
                    Folders
                </h3>
                <button
                    onClick={handleCreateFolder}
                    className="p-1 hover:bg-vscode-listHover rounded"
                    title="New Folder"
                >
                    <Plus size={12} className="text-vscode-foreground" />
                </button>
            </div>

            <div>
                {/* General folder for notes without a folder */}
                <GeneralFolder />

                {/* User-created folders */}
                {rootFolders.map(folder => (
                    <FolderItem key={folder.id} folder={folder} level={0} />
                ))}
            </div>
        </div>
    )
}