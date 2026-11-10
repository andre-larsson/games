import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Served as a project Pages site at https://andre-larsson.github.io/games/
export default defineConfig({
  plugins: [react()],
  base: '/games/',
})
