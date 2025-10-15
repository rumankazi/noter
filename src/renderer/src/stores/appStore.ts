import { create } from 'zustand'
import { Note, Folder } from '@shared/types'

interface PromptDialog {
    isOpen: boolean
    title: string
    placeholder: string
    onConfirm: (value: string) => void
    onCancel: () => void
}

interface ConfirmDialog {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}

interface AppState {
    // UI State
    selectedNoteId: string | null
    selectedFolderId: string | null
    isCommandPaletteOpen: boolean
    searchQuery: string
    promptDialog: PromptDialog
    confirmDialog: ConfirmDialog

    // Data
    notes: Note[]
    folders: Folder[]

    // Actions
    setSelectedNote: (noteId: string | null) => void
    setSelectedFolder: (folderId: string | null) => void
    setCommandPaletteOpen: (open: boolean) => void
    setSearchQuery: (query: string) => void
    showPromptDialog: (title: string, placeholder: string, onConfirm: (value: string) => void) => void
    hidePromptDialog: () => void
    showConfirmDialog: (title: string, message: string, onConfirm: () => void) => void
    hideConfirmDialog: () => void

    // Data actions
    setNotes: (notes: Note[]) => void
    setFolders: (folders: Folder[]) => void
    addNote: (note: Note) => void
    updateNote: (note: Note) => void
    removeNote: (noteId: string) => void
    addFolder: (folder: Folder) => void
    updateFolder: (folder: Folder) => void
    removeFolder: (folderId: string) => void

    // Menu Actions
    createNewNote: (folderId?: string) => Promise<void>
    createNewFolder: (parentId?: string) => Promise<void>
    deleteNote: (noteId: string) => Promise<void>
    renameFolder: (folderId: string) => Promise<void>
    deleteFolder: (folderId: string) => Promise<void>
    openCommandPalette: () => void
    saveCurrentNote: () => Promise<void>

    // Initialization
    initializeApp: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    selectedNoteId: null,
    selectedFolderId: null,
    isCommandPaletteOpen: false,
    searchQuery: '',
    notes: [],
    folders: [],
    promptDialog: {
        isOpen: false,
        title: '',
        placeholder: '',
        onConfirm: () => { },
        onCancel: () => { }
    },
    confirmDialog: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { }
    },

    // UI Actions
    setSelectedNote: (noteId) => set({ selectedNoteId: noteId }),
    setSelectedFolder: (folderId) => set({ selectedFolderId: folderId }),
    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    showPromptDialog: (title, placeholder, onConfirm) => set((state) => ({
        promptDialog: {
            ...state.promptDialog,
            isOpen: true,
            title,
            placeholder,
            onConfirm: (value: string) => {
                onConfirm(value)
                get().hidePromptDialog()
            },
            onCancel: () => get().hidePromptDialog()
        }
    })),

    hidePromptDialog: () => set((state) => ({
        promptDialog: {
            ...state.promptDialog,
            isOpen: false
        }
    })),

    showConfirmDialog: (title, message, onConfirm) => set((state) => ({
        confirmDialog: {
            ...state.confirmDialog,
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm()
                get().hideConfirmDialog()
            },
            onCancel: () => get().hideConfirmDialog()
        }
    })),

    hideConfirmDialog: () => set((state) => ({
        confirmDialog: {
            ...state.confirmDialog,
            isOpen: false
        }
    })),

    // Data Actions
    setNotes: (notes) => set({ notes }),
    setFolders: (folders) => set({ folders }),

    addNote: (note) => set((state) => ({
        notes: [note, ...state.notes]
    })),

    updateNote: (updatedNote) => set((state) => ({
        notes: state.notes.map(note =>
            note.id === updatedNote.id ? updatedNote : note
        )
    })),

    removeNote: (noteId) => set((state) => ({
        notes: state.notes.filter(note => note.id !== noteId),
        selectedNoteId: state.selectedNoteId === noteId ? null : state.selectedNoteId
    })),

    addFolder: (folder) => set((state) => ({
        folders: [...state.folders, folder].sort((a, b) => a.name.localeCompare(b.name))
    })),

    updateFolder: (updatedFolder) => set((state) => ({
        folders: state.folders.map(folder =>
            folder.id === updatedFolder.id ? updatedFolder : folder
        ).sort((a, b) => a.name.localeCompare(b.name))
    })),

    removeFolder: (folderId) => set((state) => ({
        folders: state.folders.filter(folder => folder.id !== folderId),
        selectedFolderId: state.selectedFolderId === folderId ? null : state.selectedFolderId,
        notes: state.notes.filter(note => note.folderId !== folderId)
    })),

    // Menu Actions
    createNewNote: async (folderId?: string) => {
        get().showPromptDialog(
            'Create New Note',
            'Enter note title...',
            async (title: string) => {
                try {
                    if (window.electronAPI) {
                        const note = await window.electronAPI.notes.create({
                            title,
                            folderId: folderId || get().selectedFolderId || undefined
                        })
                        const state = get()
                        state.addNote(note)
                        state.setSelectedNote(note.id)
                    }
                } catch (error) {
                    console.error('Failed to create note:', error)
                }
            }
        )
    },

    createNewFolder: async (parentId?: string) => {
        get().showPromptDialog(
            'Create New Folder',
            'Enter folder name...',
            async (name: string) => {
                try {
                    if (window.electronAPI) {
                        const folder = await window.electronAPI.folders.create({
                            name,
                            parentId: parentId || get().selectedFolderId || undefined
                        })
                        get().addFolder(folder)
                    }
                } catch (error) {
                    console.error('Failed to create folder:', error)
                }
            }
        )
    },

    deleteNote: async (noteId: string) => {
        try {
            if (window.electronAPI) {
                await window.electronAPI.notes.delete(noteId)
                get().removeNote(noteId)
            }
        } catch (error) {
            console.error('Failed to delete note:', error)
        }
    },

    renameFolder: async (folderId: string) => {
        const folder = get().folders.find(f => f.id === folderId)
        if (!folder) return

        get().showPromptDialog(
            'Rename Folder',
            'Enter new folder name...',
            async (name: string) => {
                try {
                    if (window.electronAPI && name.trim()) {
                        const updatedFolder = await window.electronAPI.folders.update({
                            id: folderId,
                            name: name.trim()
                        })
                        get().updateFolder(updatedFolder)
                    }
                } catch (error) {
                    console.error('Failed to rename folder:', error)
                }
            }
        )
        // Pre-fill the input with current name
        setTimeout(() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement
            if (input) input.value = folder.name
        }, 0)
    },

    deleteFolder: async (folderId: string) => {
        const folder = get().folders.find(f => f.id === folderId)
        if (!folder) return

        // Check if folder has children or notes
        const hasChildren = get().folders.some(f => f.parentId === folderId)
        const hasNotes = get().notes.some(n => n.folderId === folderId)

        const message = hasChildren || hasNotes
            ? `"${folder.name}" contains ${hasChildren ? 'subfolders' : ''} ${hasChildren && hasNotes ? 'and' : ''} ${hasNotes ? 'notes' : ''}. All contents will be deleted. This cannot be undone.`
            : `Delete "${folder.name}"? This cannot be undone.`

        get().showConfirmDialog(
            'Delete Folder',
            message,
            async () => {
                try {
                    if (window.electronAPI) {
                        await window.electronAPI.folders.delete(folderId)
                        get().removeFolder(folderId)
                    }
                } catch (error) {
                    console.error('Failed to delete folder:', error)
                }
            }
        )
    },

    openCommandPalette: () => {
        set({ isCommandPaletteOpen: true })
    },

    saveCurrentNote: async () => {
        // This will be handled by the NoteEditor component
        // We could add a save callback here if needed
        console.log('Save triggered from menu')
    },

    // Initialization
    initializeApp: async () => {
        try {
            if (window.electronAPI) {
                const [notes, folders] = await Promise.all([
                    window.electronAPI.notes.getAll(),
                    window.electronAPI.folders.getAll()
                ])

                set({ notes, folders })
            }
        } catch (error) {
            console.error('Failed to initialize app:', error)
        }
    }
}))