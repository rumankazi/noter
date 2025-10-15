import React from 'react'

interface ConfirmDialogProps {
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    title,
    message,
    onConfirm,
    onCancel
}) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel()
            } else if (e.key === 'Enter') {
                onConfirm()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onConfirm, onCancel])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-vscode-inputBackground border border-vscode-border rounded-lg shadow-lg w-96 max-w-full mx-4">
                {/* Header */}
                <div className="p-4 border-b border-vscode-border">
                    <h3 className="text-lg font-medium text-vscode-foreground">
                        {title}
                    </h3>
                </div>

                {/* Message */}
                <div className="p-4">
                    <p className="text-vscode-foreground">
                        {message}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 p-4 border-t border-vscode-border">
                    <button
                        onClick={onCancel}
                        className="
                            px-4 py-2 
                            bg-vscode-inputBackground hover:bg-vscode-listHover 
                            border border-vscode-border 
                            rounded 
                            text-vscode-foreground
                            transition-colors
                        "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="
                            px-4 py-2 
                            bg-red-600 hover:bg-red-700 
                            text-white 
                            rounded 
                            transition-colors
                        "
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}