import React from 'react'
import {
    Search,
    Settings,
    FolderOpen
} from 'lucide-react'

const activityItems = [
    { id: 'explorer', icon: FolderOpen, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'settings', icon: Settings, label: 'Settings' },
]

interface ActivityBarProps {
    activeView: string
    onViewChange: (view: string) => void
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onViewChange }) => {

    return (
        <div className="w-12 bg-vscode-activityBarBackground border-r border-vscode-border flex flex-col">
            {/* Activity items */}
            <div className="flex flex-col">
                {activityItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`
                w-12 h-12 flex items-center justify-center
                hover:bg-vscode-listHover
                ${activeView === item.id ? 'bg-vscode-listActive' : ''}
              `}
                            title={item.label}
                        >
                            <Icon size={20} className="text-vscode-foreground" />
                        </button>
                    )
                })}
            </div>

            {/* Spacer */}
            <div className="flex-1" />
        </div>
    )
}