# Noter Architecture

## Overview

Noter follows a clean, layered architecture that promotes separation of concerns, testability, and maintainability. The app is built using Electron with TypeScript for cross-platform compatibility.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────── │
│  │   React UI      │  │  Markdown       │  │  Search       │ │
│  │   Components    │  │  Preview        │  │  Interface    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────── │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────── │
│  │   Note          │  │  Folder         │  │  Search       │ │
│  │   Services      │  │  Services       │  │  Services     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────── │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────── │
│  │   Note          │  │  Folder         │  │  Search       │ │
│  │   Entities      │  │  Entities       │  │  Entities     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────── │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                Infrastructure Layer                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────── │
│  │   SQLite        │  │  File System    │  │  IPC          │ │
│  │   Database      │  │  Storage        │  │  Communication│ │
│  └─────────────────┘  └─────────────────┘  └─────────────── │
└─────────────────────────────────────────────────────────────┘
```

## Process Architecture

### Main Process (Node.js)
- **Responsibilities**: Window management, database operations, file system access
- **Location**: `src/main/`
- **Key Files**:
  - `main.ts` - Entry point, window creation
  - `database/` - SQLite database layer
  - `services/` - Business logic services
  - `ipc/` - Inter-process communication handlers

### Renderer Process (React)
- **Responsibilities**: User interface, user interactions, markdown rendering
- **Location**: `src/renderer/`
- **Key Files**:
  - `App.tsx` - Main application component
  - `components/` - Reusable UI components
  - `pages/` - Main application views
  - `hooks/` - Custom React hooks
  - `context/` - State management

## Data Flow

### Note Creation Flow
```
User Input → UI Component → IPC Call → Main Process Service → Database → Response → UI Update
```

### Auto-save Flow
```
Focus Change → Debounced Save → IPC Call → Database Update → Success Response
```

## Database Schema

### Tables

#### notes
```sql
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    folder_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);
```

#### folders
```sql
CREATE TABLE folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

#### settings
```sql
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Key Design Principles

### 1. Separation of Concerns
- **Domain Layer**: Pure business logic, no dependencies
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External dependencies (database, file system)
- **Presentation Layer**: UI components and user interactions

### 2. Dependency Inversion
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces)
- Database implementations are injected via dependency injection

### 3. Single Responsibility
- Each class/module has one reason to change
- Services handle specific business operations
- Components have focused UI responsibilities

### 4. Open/Closed Principle
- Open for extension, closed for modification
- Plugin architecture for future features
- Interface-based design for swappable components

## Testing Strategy

### Unit Tests
- **Domain Layer**: Test business logic in isolation
- **Application Layer**: Test services with mocked dependencies
- **UI Components**: Test component behavior and rendering

### Integration Tests
- **Database Layer**: Test database operations with real SQLite
- **IPC Communication**: Test main-renderer process communication
- **Service Integration**: Test service interactions

### E2E Tests
- **Cross-platform**: Test on Windows, macOS, Linux
- **User Workflows**: Complete user journeys from start to finish
- **Performance**: Ensure app meets performance requirements

## Security Considerations

### Data Protection
- Local data storage only (no cloud by default)
- SQLite database with file-system level permissions
- No network communication (offline-first)

### Process Isolation
- Main process handles sensitive operations
- Renderer process runs in sandboxed environment
- IPC validation for all communications

## Performance Optimizations

### Database
- Indexed columns for fast search queries
- Connection pooling for concurrent operations
- Batch operations for bulk data changes

### UI
- Virtual scrolling for large note lists
- Debounced auto-save to prevent excessive writes
- Lazy loading of note content

### Memory Management
- Proper cleanup of event listeners
- Efficient React rendering with useMemo/useCallback
- Database connection management

## Extensibility Points

### Plugin System (Future)
- Plugin interface for custom note types
- Custom markdown renderers
- External sync providers

### Theme System
- CSS custom properties for theming
- Dark/light mode support
- Custom theme plugins

### Export/Import
- Multiple format support (PDF, HTML, etc.)
- Batch operations
- Custom export templates

## Development Workflow

### Code Organization
```
src/
├── main/                 # Electron main process
│   ├── database/        # Database layer
│   ├── services/        # Business services
│   ├── ipc/            # IPC handlers
│   └── main.ts         # Entry point
├── renderer/            # React renderer process
│   ├── components/     # UI components
│   ├── pages/          # Application views
│   ├── hooks/          # Custom hooks
│   ├── context/        # State management
│   └── App.tsx         # Main component
├── shared/              # Shared types and utilities
│   ├── types/          # TypeScript interfaces
│   └── utils/          # Utility functions
└── tests/               # Test files
    ├── unit/           # Unit tests
    ├── integration/    # Integration tests
    └── e2e/            # End-to-end tests
```

### Build Process
1. **TypeScript Compilation**: Main and renderer processes
2. **Bundle Creation**: Vite for renderer, tsc for main
3. **Electron Packaging**: electron-builder for distributables
4. **Testing**: Jest for unit/integration, Playwright for E2E

## Deployment Architecture

### Build Targets
- **Windows**: NSIS installer + Portable executable
- **macOS**: DMG (Universal: Intel + Apple Silicon)
- **Linux**: AppImage + DEB package

### CI/CD Pipeline
```
Code Push → Tests → Build → Package → Release → Deploy
```

### Release Strategy
- **Semantic Versioning**: Automated version management
- **Multiple Channels**: Stable, beta, alpha releases
- **Auto-updates**: Built-in update mechanism

---

*This document is maintained alongside code changes and reflects the current architecture state.*
