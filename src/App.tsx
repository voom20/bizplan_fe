/**
 * 파일명: App.tsx
 * 
 * 파일 용도:
 * 애플리케이션의 루트 컴포넌트
 * - 전역 Provider 및 ErrorBoundary 적용
 * - QueryClientProvider로 React Query 활성화
 * - BrowserRouter로 SPA 라우팅 활성화
 * - 라우팅 설정은 AppRoutes로 분리
 * 
 * 컴포넌트 구조:
 * App
 *   └─> GlobalErrorBoundary (전역 에러 처리)
 *       └─> QueryClientProvider (React Query)
 *           └─> ToastProvider (전역 토스트 알림)
 *               └─> BrowserRouter (SPA 라우팅)
 *                   └─> AppRoutes (라우팅 설정, Code Splitting 적용)
 */

import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GlobalErrorBoundary } from '@/error';
import { ToastProvider } from '@/components';
import { AppRoutes } from './router/AppRoutes';
import { queryClient } from '@/service';

/**
 * App 컴포넌트
 * 
 * 역할:
 * - 애플리케이션의 최상위 컴포넌트
 * - 전역 상태 및 Provider 설정
 * - React Query 캐싱 및 서버 상태 관리
 * - 라우팅 기능 활성화
 * 
 * 성능 최적화:
 * - AppRoutes에서 React.lazy()를 통한 Code Splitting 적용
 * - 페이지별 Lazy Loading으로 초기 번들 크기 감소
 * - React Query를 통한 서버 상태 캐싱
 * 
 * @returns {JSX.Element} 라우터가 설정된 앱 컴포넌트
 */
const App = () => {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
        {/* 개발 모드에서만 React Query Devtools 표시 */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
