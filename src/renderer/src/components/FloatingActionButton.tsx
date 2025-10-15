import React from 'react'
import { Plus, FileText, FolderPlus } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export const FloatingActionButton: React.FC = () => {
    const { createNewNote, createNewFolder } = useAppStore()
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [longPressTimer, setLongPressTimer] = React.useState<ReturnType<typeof setTimeout> | null>(null)
    const [isLongPress, setIsLongPress] = React.useState(false)

    const handleMouseDown = () => {
        setIsLongPress(false)
        const timer = setTimeout(() => {
            setIsLongPress(true)
            setIsExpanded(true)
        }, 500) // 500ms for long press
        setLongPressTimer(timer)
    }

    const handleMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }

        if (!isLongPress && !isExpanded) {
            // Short press - create note directly
            createNewNote()
        }

        setIsLongPress(false)
    }

    const handleOptionClick = (action: 'note' | 'folder') => {
        setIsExpanded(false)
        if (action === 'note') {
            createNewNote()
        } else {
            createNewFolder()
        }
    }

    const handleClickOutside = () => {
        setIsExpanded(false)
    }

    // Close on outside click
    React.useEffect(() => {
        if (isExpanded) {
            const handleClick = () => handleClickOutside()
            document.addEventListener('click', handleClick)
            return () => document.removeEventListener('click', handleClick)
        }
    }, [isExpanded])

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Expanded options */}
            {isExpanded && (
                <div className="absolute bottom-16 right-0 flex flex-col space-y-2 animate-in slide-in-from-bottom duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleOptionClick('folder')
                        }}
                        className="
              flex items-center space-x-3 px-4 py-3 
              bg-vscode-inputBackground hover:bg-vscode-listHover 
              border border-vscode-border rounded-lg 
              text-vscode-foreground text-sm
              transition-all duration-150
              shadow-lg
            "
                    >
                        <FolderPlus size={18} />
                        <span>New Folder</span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleOptionClick('note')
                        }}
                        className="
              flex items-center space-x-3 px-4 py-3 
              bg-vscode-inputBackground hover:bg-vscode-listHover 
              border border-vscode-border rounded-lg 
              text-vscode-foreground text-sm
              transition-all duration-150
              shadow-lg
            "
                    >
                        <FileText size={18} />
                        <span>New Note</span>
                    </button>
                </div>
            )}

            {/* Main FAB */}
            <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={(e) => e.stopPropagation()}
                className={`
          w-14 h-14 rounded-full 
          bg-vscode-accent hover:bg-vscode-buttonHover
          text-white shadow-lg
          flex items-center justify-center
          transition-all duration-150
          ${isExpanded ? 'rotate-45' : 'hover:scale-105'}
          active:scale-95
        `}
                title="Click: New Note | Long Press: More Options"
                data-testid="fab-button"
            >
                <Plus size={24} />
            </button>
        </div>
    )
}
