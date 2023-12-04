import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import axios from 'axios'
axios.defaults.baseURL = `http://localhost:3000`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
