import React from 'react'
import { Save, Eye, Edit, Columns } from 'lucide-react'

interface EditorHeaderProps {
    title: string
    previewMode: 'none' | 'full' | 'split'
    onTogglePreview: () => void
    onToggleSplit: () => void
    onSave: () => void
    hasUnsavedChanges: boolean
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
    title,
    previewMode,
    onTogglePreview,
    onToggleSplit,
    onSave,
    hasUnsavedChanges
}) => {
    // Detect platform to avoid window controls
    const isMacOS = window.electronAPI?.platform === 'darwin' || navigator.userAgent.includes('Mac OS X')

    return (
        <div
            className="flex items-center justify-between px-4 py-2 bg-vscode-editorBackground border-b border-vscode-border"
            style={{ height: '48px' }}
            data-testid="editor-header"
        >
            <h2 className="text-vscode-foreground font-medium truncate flex-1 mr-4">
                {title}
                {hasUnsavedChanges && <span className="text-vscode-accent ml-2">•</span>}
            </h2>

            <div
                className="flex items-center space-x-2"
                style={{ marginRight: isMacOS ? '120px' : '8px' }}
                data-testid="editor-header-buttons"
            >
                <button
                    onClick={onToggleSplit}
                    className={`
                        p-2 rounded transition-colors
                        ${previewMode === 'split'
                            ? 'text-vscode-accent bg-vscode-listActive'
                            : 'text-vscode-foreground hover:bg-vscode-listHover'
                        }
                    `}
                    title="Open Preview to the Side"
                    aria-label="Split Preview"
                >
                    <Columns size={16} />
                </button>
                <button
                    onClick={onTogglePreview}
                    className={`
                        p-2 rounded transition-colors
                        ${previewMode === 'full'
                            ? 'text-vscode-accent bg-vscode-listActive'
                            : 'text-vscode-foreground hover:bg-vscode-listHover'
                        }
                    `}
                    title={previewMode === 'full' ? 'Close Preview' : 'Toggle Preview'}
                    aria-label={previewMode === 'full' ? 'Edit' : 'Preview'}
                >
                    {previewMode === 'full' ? <Edit size={16} /> : <Eye size={16} />}
                </button>
                <button
                    onClick={onSave}
                    disabled={!hasUnsavedChanges}
                    className={`
                        p-2 rounded transition-colors
                        ${hasUnsavedChanges
                            ? 'text-vscode-accent hover:bg-vscode-listHover'
                            : 'text-vscode-foreground opacity-50 cursor-not-allowed'
                        }
                    `}
                    title="Save (Ctrl+S)"
                    aria-label="Save"
                >
                    <Save size={16} />
                </button>
            </div>
        </div>
    )
}
