import React from 'react'
import { Search } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export const SearchBar: React.FC = () => {
    const { searchQuery, setSearchQuery } = useAppStore()

    return (
        <div className="relative">
            <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-foreground opacity-60"
            />
            <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
          w-full pl-10 pr-3 py-2 
          bg-vscode-inputBackground 
          border border-vscode-border 
          rounded 
          text-vscode-foreground 
          placeholder-vscode-foreground 
          placeholder-opacity-60
          focus:outline-none 
          focus:ring-1 
          focus:ring-vscode-accent
        "
            />
        </div>
    )
}