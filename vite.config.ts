import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
    plugins: [react()],
    root: './src/renderer',
    base: './',
    build: {
        outDir: '../../dist/renderer'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/renderer'),
            '@main': path.resolve(__dirname, 'src/main'),
            '@shared': path.resolve(__dirname, 'src/shared')
        }
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer]
        }
    },
    server: {
        port: 3000
    }
})