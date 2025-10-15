import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createMockElectronAPI } from './test-utils'

// Mock electronAPI for tests - use current platform for consistency
Object.defineProperty(window, 'electronAPI', {
    value: createMockElectronAPI(process.platform),
    writable: true
})
