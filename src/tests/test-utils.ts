import { vi } from 'vitest'

/**
 * Test utilities for platform-agnostic testing
 */

/**
 * Mock electronAPI platform for testing
 */
export function mockPlatform(platform: 'win32' | 'darwin' | 'linux') {
  if ((window as any).electronAPI) {
    (window as any).electronAPI.platform = platform
  }
}

/**
 * Get platform-appropriate data path for testing
 */
export function getTestDataPath(platform: string = process.platform): string {
  switch (platform) {
    case 'win32':
      return 'C:\\Users\\test\\AppData\\Noter'
    case 'darwin':
      return '/Users/test/Library/Application Support/Noter'
    default:
      return '/home/test/.config/Noter'
  }
}

/**
 * Get expected margin for EditorHeader buttons based on platform
 */
export function getExpectedButtonMargin(platform: string = process.platform): string {
  return platform === 'darwin' ? '120px' : '8px'
}

/**
 * Get expected title bar padding based on platform
 */
export function getExpectedTitleBarPadding(platform: string = process.platform): string {
  return platform === 'darwin' ? '80px' : '0px'
}

/**
 * Mock electronAPI with comprehensive platform-aware defaults
 */
export function createMockElectronAPI(platform: string = process.platform) {
  return {
    platform,
    notes: {
      getAll: vi.fn().mockResolvedValue([]),
      getById: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(true),
      search: vi.fn().mockResolvedValue([]),
      onUpdated: vi.fn(),
      offUpdated: vi.fn()
    },
    folders: {
      getAll: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(true),
      onUpdated: vi.fn(),
      offUpdated: vi.fn()
    },
    settings: {
      getAutoSave: vi.fn().mockResolvedValue({
        enabled: true,
        onFocusChange: true,
        intervalSeconds: 120,
        intervalEnabled: true
      }),
      setAutoSave: vi.fn(),
      getDataLocation: vi.fn().mockResolvedValue(getTestDataPath(platform)),
      getDatabaseSize: vi.fn().mockResolvedValue('1.2 MB'),
      browseDataLocation: vi.fn(),
      setDataLocation: vi.fn(),
      exportData: vi.fn(),
      importData: vi.fn()
    },
    onMenuEvent: vi.fn(),
    removeAllListeners: vi.fn()
  }
}
