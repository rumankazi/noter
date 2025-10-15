import initSqlJs, { Database } from 'sql.js'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'

export class DatabaseService {
    private db!: Database
    private dbPath: string
    private SQL: any

    constructor() {
        const userDataPath = app.getPath('userData')



        // Use a separate test database if we're in test mode
        // Playwright launches with Electron executable, so check for typical test patterns
        const isTestMode = process.argv.includes('--test') ||
            process.env.NODE_ENV === 'test' ||
            process.argv[0].includes('electron') ||  // Playwright uses electron executable
            process.execPath.includes('electron')

        if (isTestMode) {
            // Use a temporary database path for tests
            this.dbPath = path.join(userDataPath, `noter-test-${Date.now()}.db`)
            console.log('Running in test mode, using database:', this.dbPath)
        } else {
            this.dbPath = path.join(userDataPath, 'noter.db')
            console.log('Running in production mode, using database:', this.dbPath)
        }
    }

    async initialize(): Promise<void> {
        try {
            console.log('Initializing sql.js...')

            // Try multiple paths for the WASM file
            const possibleWasmPaths = [
                path.join(__dirname, '../../public/sql-wasm.wasm'),
                path.join(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm'),
                path.join(process.cwd(), 'public/sql-wasm.wasm'),
                path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm')
            ]

            let wasmBinary: Buffer | undefined
            for (const wasmPath of possibleWasmPaths) {
                if (fs.existsSync(wasmPath)) {
                    console.log('Found WASM file at:', wasmPath)
                    wasmBinary = fs.readFileSync(wasmPath)
                    break
                }
            }

            if (!wasmBinary) {
                console.log('WASM file not found, trying without explicit WASM binary...')
                this.SQL = await initSqlJs()
            } else {
                this.SQL = await initSqlJs({
                    wasmBinary: wasmBinary.buffer as ArrayBuffer
                })
            }
            console.log('sql.js initialized successfully')

            let filebuffer: Buffer | undefined

            // Ensure directory exists
            const dir = path.dirname(this.dbPath)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }

            // Try to load existing database
            if (fs.existsSync(this.dbPath)) {
                console.log('Loading existing database from:', this.dbPath)
                filebuffer = fs.readFileSync(this.dbPath)
            } else {
                console.log('Creating new database at:', this.dbPath)
            }

            this.db = new this.SQL.Database(filebuffer)
            console.log('Database instance created')

            this.initializeDatabase()
            console.log('Database schema initialized')

            // Save immediately to ensure file is created
            this.save()
        } catch (error) {
            console.error('Failed to initialize database:', error)
            throw error
        }
    }

    private initializeDatabase() {
        try {
            // Create tables if they don't exist
            this.db.exec(`
              CREATE TABLE IF NOT EXISTS folders (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                parent_id TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              );

              CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT DEFAULT '',
                folder_id TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              );

              CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
              CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
            `)
            console.log('Database tables created successfully')
        } catch (error) {
            console.error('Failed to create database tables:', error)
            throw error
        }
    }

    getDatabase(): Database {
        return this.db
    }

    getDataPath(): string {
        return path.dirname(this.dbPath)
    }

    getDatabaseSize(): number {
        try {
            if (fs.existsSync(this.dbPath)) {
                const stats = fs.statSync(this.dbPath)
                return stats.size
            }
            return 0
        } catch (error) {
            console.error('Error getting database size:', error)
            return 0
        }
    }

    save(): void {
        const data = this.db.export()
        fs.writeFileSync(this.dbPath, Buffer.from(data))
    }

    close(): void {
        if (this.db) {
            this.save()
            this.db.close()
        }
    }

    cleanup(): void {
        if (this.db) {
            this.db.close()
        }

        // Delete test database file if it exists
        if (fs.existsSync(this.dbPath) && this.dbPath.includes('test')) {
            try {
                fs.unlinkSync(this.dbPath)
                console.log('Cleaned up test database:', this.dbPath)
            } catch (error) {
                console.error('Error cleaning up test database:', error)
            }
        }
    }
}
