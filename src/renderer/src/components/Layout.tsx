import React from 'react'
import { ActivityBar } from './ActivityBar'
import { Sidebar } from './Sidebar'
import { SearchView } from './SearchView'
import { EditorArea } from './EditorArea'
import { StatusBar } from './StatusBar'
import { CommandPalette } from './CommandPalette'
import { FloatingActionButton } from './FloatingActionButton'
import { PromptDialog } from './PromptDialog'
import { ConfirmDialog } from './ConfirmDialog'
import { useAppStore } from '../stores/appStore'

export const Layout: React.FC = () => {
    const { isCommandPaletteOpen, promptDialog, confirmDialog, setSearchQuery } = useAppStore()
    const [activeView, setActiveView] = React.useState('explorer')

    const handleViewChange = (view: string) => {
        setActiveView(view)
        // Clear search when leaving search view
        if (activeView === 'search' && view !== 'search') {
            setSearchQuery('')
        }
    }

    return (
        <div className="h-screen flex flex-col bg-vscode-background relative">
            {/* Title Bar - Draggable area */}
            <div
                className="h-8 bg-vscode-titleBar flex items-center px-2 select-none"
                style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
            >
                <span className="text-xs text-vscode-foreground opacity-80">Noter</span>
            </div>
            {/* Command Palette */}
            {isCommandPaletteOpen && <CommandPalette />}

            {/* Prompt Dialog */}
            {promptDialog.isOpen && (
                <PromptDialog
                    title={promptDialog.title}
                    placeholder={promptDialog.placeholder}
                    onConfirm={promptDialog.onConfirm}
                    onCancel={promptDialog.onCancel}
                />
            )}

            {/* Confirm Dialog */}
            {confirmDialog.isOpen && (
                <ConfirmDialog
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={confirmDialog.onCancel}
                />
            )}

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Activity Bar */}
                <ActivityBar activeView={activeView} onViewChange={handleViewChange} />

                {/* Sidebar - Show for explorer view */}
                {activeView === 'explorer' && <Sidebar />}

                {/* Search View */}
                {activeView === 'search' && <SearchView />}

                {/* Editor Area */}
                <EditorArea activeView={activeView} />
            </div>

            {/* Status Bar */}
            <StatusBar />

            {/* Floating Action Button - Only show in explorer view */}
            {activeView === 'explorer' && <FloatingActionButton />}
        </div>
    )
}