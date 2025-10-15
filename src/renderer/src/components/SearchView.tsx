import React, { useMemo } from 'react'
import { Search, FileText, Folder } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { format } from 'date-fns'

export const SearchView: React.FC = () => {
    const { notes, folders, searchQuery, setSearchQuery, setSelectedNote } = useAppStore()

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) {
            return notes
        }

        const query = searchQuery.toLowerCase()
        return notes.filter(note => {
            return note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
        })
    }, [notes, searchQuery])

    const getFolderName = (folderId?: string): string => {
        if (!folderId) return 'General'
        const folder = folders.find(f => f.id === folderId)
        return folder?.name || 'Unknown'
    }

    const getContentPreview = (content: string, maxLength: number = 100): string => {
        const stripped = content.replace(/[#*`_~]/g, '').trim()
        return stripped.length > maxLength
            ? stripped.substring(0, maxLength) + '...'
            : stripped
    }

    const highlightMatch = (text: string, query: string): React.ReactNode => {
        if (!query.trim()) return text

        const index = text.toLowerCase().indexOf(query.toLowerCase())
        if (index === -1) return text

        const before = text.substring(0, index)
        const match = text.substring(index, index + query.length)
        const after = text.substring(index + query.length)

        return (
            <>
                {before}
                <mark className="bg-vscode-accent bg-opacity-30 text-vscode-foreground">{match}</mark>
                {after}
            </>
        )
    }

    return (
        <div className="flex flex-col h-full bg-vscode-sidebarBackground">
            {/* Header */}
            <div className="p-4 border-b border-vscode-border">
                <h2 className="text-lg font-semibold text-vscode-foreground mb-3">Search</h2>

                {/* Search Input */}
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-foreground opacity-60"
                    />
                    <input
                        type="text"
                        placeholder="Search notes by title or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="
                            w-full pl-10 pr-3 py-2 
                            bg-vscode-inputBackground 
                            border border-vscode-border 
                            rounded 
                            text-vscode-foreground 
                            placeholder-vscode-foreground 
                            placeholder-opacity-60
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-vscode-accent
                        "
                    />
                </div>
            </div>

            {/* Results Count */}
            <div className="px-4 py-2 border-b border-vscode-border">
                <span className="text-xs text-vscode-foreground opacity-70">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                    {searchQuery && ` for "${searchQuery}"`}
                </span>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-auto">
                {searchResults.length === 0 ? (
                    <div className="p-8 text-center">
                        <Search size={48} className="mx-auto mb-4 text-vscode-foreground opacity-30" />
                        <p className="text-vscode-foreground opacity-60">
                            {searchQuery ? 'No results found' : 'Start typing to search...'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-vscode-border">
                        {searchResults.map(note => (
                            <div
                                key={note.id}
                                className="p-4 hover:bg-vscode-listHover cursor-pointer transition-colors"
                                onClick={() => setSelectedNote(note.id)}
                            >
                                {/* Note Title */}
                                <div className="flex items-start gap-3 mb-2">
                                    <FileText size={16} className="text-vscode-foreground opacity-60 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-vscode-foreground truncate">
                                            {highlightMatch(note.title || 'Untitled', searchQuery)}
                                        </h3>

                                        {/* Folder and Date */}
                                        <div className="flex items-center gap-3 mt-1 text-xs text-vscode-foreground opacity-50">
                                            <div className="flex items-center gap-1">
                                                <Folder size={12} />
                                                <span>{getFolderName(note.folderId)}</span>
                                            </div>
                                            <span>•</span>
                                            <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Preview */}
                                {note.content && (
                                    <div className="ml-7 text-xs text-vscode-foreground opacity-60 line-clamp-2">
                                        {highlightMatch(getContentPreview(note.content), searchQuery)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
