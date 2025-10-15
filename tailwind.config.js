/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/renderer/index.html",
        "./src/renderer/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                vscode: {
                    background: '#1e1e1e',
                    sidebarBackground: '#252526',
                    activityBarBackground: '#333333',
                    editorBackground: '#1e1e1e',
                    foreground: '#cccccc',
                    border: '#464647',
                    inputBackground: '#3c3c3c',
                    buttonBackground: '#0e639c',
                    buttonHover: '#1177bb',
                    listHover: '#2a2d2e',
                    listActive: '#094771',
                    accent: '#007acc',
                    titleBar: '#323233',
                    focusBorder: '#007acc'
                }
            },
            fontFamily: {
                mono: ['Cascadia Code', 'Consolas', 'Monaco', 'monospace']
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}