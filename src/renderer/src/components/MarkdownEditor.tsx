import React, { useState, useEffect, useRef } from 'react'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css' // Dark theme to match VS Code
import { EditorHeader } from './EditorHeader'

interface MarkdownEditorProps {
    content: string
    onChange: (content: string) => void
    onSave: () => void
    title: string
    hasUnsavedChanges?: boolean
}

const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value
            } catch (__) { }
        }
        return '' // use external default escaping
    }
})

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    content,
    onChange,
    onSave,
    title,
    hasUnsavedChanges = false
}) => {
    const [previewMode, setPreviewMode] = useState<'none' | 'full' | 'split'>('none')
    const [splitPosition, setSplitPosition] = useState(50) // Percentage
    const [isDragging, setIsDragging] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                onSave()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onSave])

    const renderMarkdown = (markdown: string) => {
        return { __html: md.render(markdown) }
    }

    const handleTogglePreview = () => {
        setPreviewMode(prev => prev === 'full' ? 'none' : 'full')
    }

    const handleToggleSplit = () => {
        setPreviewMode(prev => prev === 'split' ? 'none' : 'split')
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return

            const container = containerRef.current
            const rect = container.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = (x / rect.width) * 100

            // Limit between 20% and 80%
            const newPosition = Math.max(20, Math.min(80, percentage))
            setSplitPosition(newPosition)
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    return (
        <div className="flex flex-col h-full bg-vscode-background">
            <EditorHeader
                title={title}
                previewMode={previewMode}
                onTogglePreview={handleTogglePreview}
                onToggleSplit={handleToggleSplit}
                onSave={onSave}
                hasUnsavedChanges={hasUnsavedChanges}
            />

            {/* Content */}
            <div className="flex-1 relative flex" ref={containerRef}>
                {previewMode === 'full' ? (
                    <div
                        className="h-full w-full p-4 overflow-auto prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={renderMarkdown(content)}
                    />
                ) : (
                    <>
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleChange}
                            className="h-full p-4 bg-vscode-editorBackground text-vscode-foreground border-none outline-none resize-none font-mono text-sm leading-relaxed syntax-highlighted"
                            style={previewMode === 'split' ? { width: `${splitPosition}%` } : { width: '100%' }}
                            placeholder="Start writing your note in Markdown..."
                            data-testid="markdown-textarea"
                        />
                        {previewMode === 'split' && (
                            <>
                                {/* Resizable Splitter */}
                                <div
                                    className="w-1 bg-vscode-border hover:bg-vscode-focusBorder cursor-col-resize transition-colors relative group"
                                    onMouseDown={handleMouseDown}
                                    style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
                                >
                                    {/* Visual indicator on hover */}
                                    <div className="absolute inset-y-0 -left-1 -right-1 opacity-0 group-hover:opacity-100 bg-vscode-focusBorder transition-opacity" />
                                </div>
                                <div
                                    className="h-full p-4 overflow-auto prose prose-invert max-w-none bg-vscode-background"
                                    style={{ width: `${100 - splitPosition}%` }}
                                    dangerouslySetInnerHTML={renderMarkdown(content)}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}