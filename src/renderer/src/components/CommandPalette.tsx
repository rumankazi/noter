import React from 'react'
import { Search, FileText, FolderPlus } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface Command {
    id: string
    label: string
    description: string
    icon: React.ComponentType<any>
    action: () => void
    category: string
}

export const CommandPalette: React.FC = () => {
    const { setCommandPaletteOpen, createNewNote, createNewFolder } = useAppStore()
    const [query, setQuery] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const commands: Command[] = [
        {
            id: 'new-note',
            label: 'New Note',
            description: 'Create a new note',
            icon: FileText,
            category: 'File',
            action: async () => {
                setCommandPaletteOpen(false)
                await createNewNote()
            }
        },
        {
            id: 'new-folder',
            label: 'New Folder',
            description: 'Create a new folder',
            icon: FolderPlus,
            category: 'File',
            action: async () => {
                setCommandPaletteOpen(false)
                await createNewFolder()
            }
        },
        {
            id: 'search-notes',
            label: 'Search Notes',
            description: 'Search through all notes',
            icon: Search,
            category: 'Search',
            action: () => {
                // Focus search bar in sidebar
                setCommandPaletteOpen(false)
            }
        }
    ]

    const filteredCommands = React.useMemo(() => {
        if (!query) return commands

        return commands.filter(cmd =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description.toLowerCase().includes(query.toLowerCase()) ||
            cmd.category.toLowerCase().includes(query.toLowerCase())
        )
    }, [query, commands, setCommandPaletteOpen, createNewFolder])

    // Focus input on mount
    React.useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Handle keyboard navigation
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    React.useEffect(() => {
        setSelectedIndex(0)
    }, [filteredCommands])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Escape':
                setCommandPaletteOpen(false)
                break
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < filteredCommands.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
                break
            case 'Enter':
                e.preventDefault()
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action()
                }
                break
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50">
            <div className="bg-vscode-inputBackground border border-vscode-border rounded-lg shadow-lg w-96 max-w-full mx-4">
                {/* Search input */}
                <div className="p-3 border-b border-vscode-border">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="
              w-full bg-transparent text-vscode-foreground
              border-none outline-none
              placeholder-vscode-foreground placeholder-opacity-60
            "
                    />
                </div>

                {/* Commands list */}
                <div className="max-h-80 overflow-auto">
                    {filteredCommands.length === 0 ? (
                        <div className="p-4 text-center text-vscode-foreground opacity-60">
                            No commands found
                        </div>
                    ) : (
                        filteredCommands.map((command, index) => {
                            const Icon = command.icon
                            return (
                                <div
                                    key={command.id}
                                    className={`
                    p-3 flex items-center cursor-pointer
                    ${index === selectedIndex ? 'bg-vscode-listActive' : 'hover:bg-vscode-listHover'}
                  `}
                                    onClick={() => command.action()}
                                >
                                    <Icon size={16} className="mr-3 text-vscode-foreground opacity-70" />
                                    <div className="flex-1">
                                        <div className="text-sm text-vscode-foreground">
                                            {command.label}
                                        </div>
                                        <div className="text-xs text-vscode-foreground opacity-60">
                                            {command.description}
                                        </div>
                                    </div>
                                    <div className="text-xs text-vscode-foreground opacity-40">
                                        {command.category}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Help text */}
                <div className="p-2 border-t border-vscode-border text-xs text-vscode-foreground opacity-50">
                    ↑↓ Navigate • Enter Execute • Esc Cancel
                </div>
            </div>
        </div>
    )
}
