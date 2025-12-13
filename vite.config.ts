import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle Analyzer - 빌드 시 번들 구성 시각화
    visualizer({
      open: false, // 빌드 후 자동으로 열지 않음 (CI 환경 고려)
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Manual Chunks 설정
         * - 벤더 라이브러리를 별도 청크로 분리
         * - 캐싱 효율성 향상 및 초기 로딩 최적화
         */
        manualChunks: {
          // React 핵심 라이브러리
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // 차트 라이브러리 (용량이 크므로 별도 분리)
          'chart-vendor': ['recharts'],
          
          // 마크다운 관련 라이브러리
          'markdown-vendor': ['react-markdown'],
          
          // 폼 관련 라이브러리
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // 상태 관리
          'state-vendor': ['zustand'],
        },
      },
    },
    // 청크 크기 경고 임계값 (KB)
    chunkSizeWarningLimit: 500,
  },
})
