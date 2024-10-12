import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      //this will make 'buffer/' resolve to the buffer pacakage for the broswer
      buffer: 'buffer'
    }
  },
  define: {
    'process.env': {},
  }
})
