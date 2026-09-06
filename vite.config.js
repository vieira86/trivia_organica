import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' faz os arquivos gerados usarem caminhos relativos, funcionando tanto
// no GitHub Pages (em qualquer nome de repositório) quanto localmente.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './'
})
