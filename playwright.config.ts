/**
 * Playwright 설정 파일
 * 
 * E2E 테스트 환경 구성
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 테스트 디렉토리
  testDir: './tests',
  
  // 병렬 실행
  fullyParallel: true,
  
  // CI에서 재시도 비활성화
  forbidOnly: !!process.env.CI,
  
  // 실패 시 재시도 횟수
  retries: process.env.CI ? 2 : 0,
  
  // 병렬 워커 수
  workers: process.env.CI ? 1 : undefined,
  
  // 리포터
  reporter: 'html',
  
  // 공통 설정
  use: {
    // 기본 URL
    baseURL: 'http://localhost:5173',
    
    // 실패 시 스크린샷
    screenshot: 'only-on-failure',
    
    // 실패 시 트레이스
    trace: 'on-first-retry',
    
    // 비디오 녹화 (실패 시)
    video: 'on-first-retry',
  },

  // 프로젝트별 브라우저 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 모바일 테스트
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 개발 서버 자동 실행
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

