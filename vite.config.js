import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
import path from 'path'
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src')
    }
  },
  server:{
    hmr:true,
    port:3004,
    proxy:{
      "/api":{
        target:"http://localhost:7070",
        changeOrigin:true,
        pathRewrite:{
          "^api":"/api"
        }
      }
    }
  }
})
