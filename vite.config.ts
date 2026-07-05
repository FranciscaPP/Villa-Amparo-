import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Rutas relativas: funciona igual en GitHub Pages (/Villa-Amparo-/) y en raíz.
  base: './',
  plugins: [react()],
});
