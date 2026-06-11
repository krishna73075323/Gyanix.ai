import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    {
      name: 'html-ext-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && !req.url.includes('.') && req.url !== '/') {
            const cleanUrl = req.url.split('?')[0];
            const htmlPath = resolve(__dirname, `.${cleanUrl}.html`);
            if (fs.existsSync(htmlPath)) {
              req.url = `${cleanUrl}.html` + (req.url.includes('?') ? req.url.slice(cleanUrl.length) : '');
            }
          }
          next();
        });
      }
    }
  ]
});
