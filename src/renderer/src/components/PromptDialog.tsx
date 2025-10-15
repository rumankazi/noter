import React from 'react'

interface PromptDialogProps {
    title: string
    placeholder: string
    onConfirm: (value: string) => void
    onCancel: () => void
}

export const PromptDialog: React.FC<PromptDialogProps> = ({
    title,
    placeholder,
    onConfirm,
    onCancel
}) => {
    const [value, setValue] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        setValue('')
        setTimeout(() => inputRef.current?.focus(), 100)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (value.trim()) {
            onConfirm(value.trim())
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel()
        }
    }



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-vscode-inputBackground border border-vscode-border rounded-lg shadow-lg w-96 max-w-full mx-4">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="p-4 border-b border-vscode-border">
                        <h3 className="text-lg font-medium text-vscode-foreground">
                            {title}
                        </h3>
                    </div>

                    {/* Input */}
                    <div className="p-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="
                w-full px-3 py-2 
                bg-vscode-background 
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

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 p-4 border-t border-vscode-border">
                        <button
                            type="button"
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
                            type="submit"
                            disabled={!value.trim()}
                            className="
                px-4 py-2 
                bg-vscode-accent hover:bg-vscode-buttonHover 
                text-white 
                rounded 
                disabled:opacity-50 
                disabled:cursor-not-allowed
                transition-colors
              "
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}