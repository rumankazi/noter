import React from 'react'
import { FolderTree } from './FolderTree'
import { NotesList } from './NotesList'
import { SearchBar } from './SearchBar'

export const Sidebar: React.FC = () => {
    return (
        <div className="w-80 bg-vscode-sidebarBackground border-r border-vscode-border flex flex-col">
            {/* Header */}
            <div className="h-8 bg-vscode-sidebarBackground border-b border-vscode-border flex items-center px-3">
                <span className="text-sm font-medium text-vscode-foreground">EXPLORER</span>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-vscode-border">
                <SearchBar />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Folder Tree */}
                <div className="flex-1 overflow-auto">
                    <FolderTree />
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-auto border-t border-vscode-border">
                    <NotesList />
                </div>
            </div>
        </div>
    )
}