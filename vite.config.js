import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Base URL: '/' for Netlify & Vercel, '/novastore/' for GitHub Pages
// Set via VITE_BASE environment variable during build
const base = process.env.VITE_BASE || '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'process.env': {},
  },

  // ─── DEV SERVER SPEED-UP ────────────────────────────────────────────────────
  server: {
    // Disable HMR error overlay so React errors show in Console only (lighter DOM)
    hmr: { overlay: false },
    // File-system watcher: do NOT use polling (polling hammers OneDrive sync)
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },

  // ─── CSS ────────────────────────────────────────────────────────────────────
  css: {
    // Disable CSS source maps in dev → stops giant .map files appearing in Network tab
    devSourcemap: false,
  },

  // ─── PRE-BUNDLING ───────────────────────────────────────────────────────────
  // Pre-bundle heavy deps once on startup so the browser gets a single fast request
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'lucide-react',
    ],
  },

  // ─── PRODUCTION BUILD ───────────────────────────────────────────────────────
  build: {
    sourcemap: false,           // No source-map files in production build
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('axios')) {
              return 'vendor-network';
            }
            return 'vendor-common';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
