/**
 * Environment utility functions for Electron main process
 */

/**
 * Check if the application is running in development mode
 * @returns {boolean} True if in development mode
 */
export function isDev(): boolean {
    return process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
}

/**
 * Check if the application is running in production mode
 * @returns {boolean} True if in production mode
 */
export function isProd(): boolean {
    return !isDev();
}

/**
 * Get the application environment
 * @returns {string} The current environment (development, production, test)
 */
export function getEnvironment(): string {
    return process.env.NODE_ENV || 'production';
}
