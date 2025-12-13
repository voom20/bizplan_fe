/**
 * 파일명: ComponentLoadingFallback.tsx
 * 
 * 파일 용도:
 * 컴포넌트 Lazy Loading 시 표시되는 로딩 UI
 * - React.lazy()로 로드되는 컴포넌트의 Suspense fallback
 * - 카드 형태의 로딩 스피너와 메시지 표시
 * - 네온 스타일 디자인 적용
 */

import React from 'react';
import { Spinner } from './ui/Spinner';

interface ComponentLoadingFallbackProps {
  /** 로딩 메시지 (기본값: '컴포넌트 로딩 중...') */
  message?: string;
  /** 높이 클래스 (기본값: 'py-12') */
  heightClass?: string;
}

/**
 * ComponentLoadingFallback 컴포넌트
 * 
 * 역할:
 * - 컴포넌트 로딩 중 카드 형태의 로딩 상태 표시
 * - Suspense의 fallback으로 사용
 * 
 * @param {ComponentLoadingFallbackProps} props - 컴포넌트 속성
 * @returns {JSX.Element} 컴포넌트 로딩 UI
 */
export const ComponentLoadingFallback: React.FC<ComponentLoadingFallbackProps> = ({
  message = '컴포넌트 로딩 중...',
  heightClass = 'py-12',
}) => (
  <div className={`glass-card ${heightClass}`}>
    <div className="flex flex-col items-center justify-center">
      <Spinner size="md" color="cyan" />
      <p className="mt-4 text-sm text-slate-400">{message}</p>
    </div>
  </div>
);

export default ComponentLoadingFallback;

