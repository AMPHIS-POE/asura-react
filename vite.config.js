import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. WordPress API를 위한 프록시 규칙
      '/wp-json': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
      // 2. 글꼴, 이미지 등 정적 파일을 위한 프록시 규칙 추가
      '/wp-content': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});