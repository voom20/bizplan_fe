/**
 * 파일명: PageLoadingFallback.tsx
 * 
 * 파일 용도:
 * 페이지 Lazy Loading 시 표시되는 로딩 UI
 * - React.lazy()로 로드되는 페이지 컴포넌트의 Suspense fallback
 * - 전체 화면 로딩 스피너와 메시지 표시
 * - 네온 스타일 디자인 적용
 */

import React from 'react';
import { Spinner } from '@/components';

/**
 * PageLoadingFallback 컴포넌트
 * 
 * 역할:
 * - 페이지 로딩 중 전체 화면에 로딩 상태 표시
 * - Suspense의 fallback으로 사용
 * 
 * @returns {JSX.Element} 페이지 로딩 UI
 */
export const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    {/* 배경 효과 */}
    <div className="absolute inset-0 bg-grid opacity-50" />
    
    {/* 플로팅 오브 */}
    <div className="floating-orb w-80 h-80 bg-neon-500/15 -top-40 -left-40" />
    <div className="floating-orb w-64 h-64 bg-cyan-500/15 bottom-20 -right-32" style={{ animationDelay: '2s' }} />
    
    {/* 로딩 콘텐츠 */}
    <div className="relative z-10 text-center animate-fade-in">
      <div className="relative inline-block mb-6">
        {/* 글로우 효과 */}
        <div className="absolute inset-0 bg-neon-500 blur-2xl opacity-30 animate-pulse-slow" />
        <Spinner size="lg" color="neon" className="relative" />
      </div>
      <p className="text-slate-400 text-lg font-medium">로딩 중...</p>
    </div>
  </div>
);

export default PageLoadingFallback;

