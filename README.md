# Noter

**A simple, local note-taking app that just works.**

No sign-ups. No cloud. No complexity. Just your notes, stored safely on your computer.

---

## Quick Start

### For Users:
**[Download Noter](https://github.com/rumankazi/noter/releases/latest)** for your platform:
- Windows: `.exe` installer
- macOS: `.dmg` disk image
- Linux: `.AppImage` portable app

**Then:**
1. Install and launch
2. Click the blue `+` button to create a note
3. Start typing
4. That's it! Your notes auto-save.

📖 **Full installation guide:** [INSTALLATION.md](INSTALLATION.md)

### For Developers:
```bash
git clone <repository-url>
cd noter
pnpm install
pnpm dev
```

📖 **New to Noter?** Read the [Quick Start Guide](QUICK_START.md) (2 min read)

---

## Why Noter?

- ✅ **Simple**: Create notes with one click
- ✅ **Private**: Everything stored locally, no cloud
- ✅ **Organized**: Folders, search, and drag-drop
- ✅ **Auto-save**: Never lose your work
- ✅ **Markdown**: Rich formatting made easy
- ✅ **Fast**: Lightweight, no bloat
- ✅ **Free**: Open source, MIT license

---

## Features

### ✅ Core Features
- **Note Management**: Create, edit, delete notes instantly
- **Folders**: Organize with hierarchical folders
- **Auto-Save**: Changes save automatically (configurable)
- **Search**: Find notes by title or content
- **Markdown**: Rich text with live preview
- **Keyboard Shortcuts**: Full keyboard navigation
- **Command Palette**: Quick actions (Ctrl+Shift+P)
- **Backup/Restore**: Export and import your data
- **Settings**: Customize auto-save, data location

### 📝 How to Use
- **Create Note**: Click the `+` button (bottom-right)
- **Create Folder**: Long-press the `+` button (0.5s)
- **Organize**: Drag notes into folders
- **Search**: Use the search bar at top
- **Settings**: Click ⚙️ icon in sidebar

### 🚧 Coming Soon
- Calendar integration for scheduling
- Task management with checkboxes
- Note linking and graph view
- Themes and color customization
- Plugin system for extensibility
- Mobile companion app

---

## For Users

### Download & Install
**[Get Noter →](https://github.com/rumankazi/noter/releases/latest)**

Available for Windows, macOS, and Linux.
See [INSTALLATION.md](INSTALLATION.md) for detailed instructions.

### First Time?
Read the [Quick Start Guide](QUICK_START.md) (2 min read)

### Data Location
Your notes are stored locally:
- **Windows**: `C:\Users\YourName\AppData\Local\Noter\noter.db`
- **macOS**: `~/Library/Application Support/Noter/noter.db`
- **Linux**: `~/.config/Noter/noter.db`

You can change this location in Settings.

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Note | `Ctrl+N` |
| New Folder | `Ctrl+Shift+N` |
| Save | `Ctrl+S` |
| Command Palette | `Ctrl+Shift+P` |

---

## For Developers

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 27
- **Database**: SQLite (sql.js)
- **Styling**: Tailwind CSS with VS Code theme
- **State Management**: Zustand
- **Testing**: Vitest + React Testing Library
- **Build**: Vite + Electron Builder

## Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd noter

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start both renderer and main process
pnpm dev:renderer     # Start only the React development server
pnpm dev:main         # Start only the Electron main process

# Building
pnpm build            # Build the application
pnpm build:renderer   # Build only the renderer process
pnpm build:main       # Build only the main process

# Testing
pnpm test             # Run unit tests
pnpm test:ui          # Run tests with UI
pnpm test:e2e         # Run end-to-end tests

# Packaging
pnpm package          # Create distributable packages
pnpm package:dir      # Create unpacked app directory

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues automatically
```

## Project Structure

```
noter/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── database/         # Database layer (SQLite)
│   │   ├── services/         # Business logic services
│   │   ├── main.ts           # Main process entry point
│   │   └── preload.ts        # Preload script for IPC
│   ├── renderer/             # React application
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── stores/       # Zustand state management
│   │   │   ├── App.tsx       # Main React component
│   │   │   └── main.tsx      # Renderer entry point
│   │   └── index.html        # HTML template
│   ├── shared/               # Shared types and utilities
│   └── tests/                # Test files
├── dist/                     # Build output
├── docs/                     # Documentation
└── package.json              # Project configuration
```

## Architecture

Noter follows clean architecture principles with clear separation of concerns:

- **Domain Layer**: Core business entities (Note, Folder)
- **Application Layer**: Use cases and business logic (Services)
- **Infrastructure Layer**: Database access and external dependencies
- **Presentation Layer**: React components and UI logic

### Key Design Decisions

1. **SQLite with sql.js**: Pure JavaScript implementation for better cross-platform compatibility
2. **IPC Communication**: Secure communication between main and renderer processes
3. **Auto-save**: Prevents data loss with automatic saving after 2 seconds of inactivity
4. **Command Palette**: VS Code-style command interface for power users
5. **Folder-based Organization**: Hierarchical structure similar to file systems

## Keyboard Shortcuts

- `Ctrl+N`: Create new note
- `Ctrl+Shift+N`: Create new folder
- `Ctrl+S`: Save current note
- `Ctrl+Shift+P`: Open command palette
- `Escape`: Close command palette

## Quick Actions

### Floating Action Button
- **Click**: Instantly create a new note
- **Long Press (500ms)**: Show options menu for creating notes or folders
- Located in the bottom-right corner for easy access
- Integrates with current folder selection automatically

## Data Storage

Notes and folders are stored in a local SQLite database located at:
- **Windows**: `%APPDATA%/Noter/noter.db`
- **macOS**: `~/Library/Application Support/Noter/noter.db`
- **Linux**: `~/.config/Noter/noter.db`

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Implement proper error handling
- Write tests for critical functionality

### Testing Strategy
- Unit tests for services and utilities
- Component tests for React components
- Integration tests for IPC communication
- End-to-end tests for critical user flows

### Git Workflow
- Use conventional commits
- Create feature branches for new functionality
- Require code review for all changes
- Maintain clean commit history

## Building and Distribution

### Development Build
```bash
pnpm build
```

### Production Package
```bash
pnpm package
```

This creates platform-specific distributables in the `release/` directory:
- Windows: `.exe` installer
- macOS: `.dmg` disk image
- Linux: `.AppImage` portable application

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

### Phase 1 (Current - MVP)
- [x] Basic note CRUD operations
- [x] Folder organization
- [x] Search functionality
- [x] Command palette
- [x] Auto-save

### Phase 2 (Next)
- [ ] Note linking system
- [ ] Export/import features
- [ ] Better markdown editor
- [ ] Themes support

### Phase 3 (Future)
- [ ] Calendar integration
- [ ] Task management
- [ ] Plugin system
- [ ] Sync capabilities (optional)

## Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Check the documentation in the `docs/` folder
- Review existing issues and discussions