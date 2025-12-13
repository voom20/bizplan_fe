/**
 * 파일명: Spinner.tsx
 * 
 * 파일 용도:
 * 로딩 스피너 컴포넌트
 * - 네온 스타일
 */

import React from 'react';
import { cn } from '@/common/utils';

interface SpinnerProps {
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 색상 */
  color?: 'neon' | 'cyan' | 'violet' | 'white';
}

/**
 * Spinner 컴포넌트
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  color = 'neon'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    neon: 'text-neon-500',
    cyan: 'text-cyan-500',
    violet: 'text-violet-500',
    white: 'text-white',
  };

  return (
    <svg
      className={cn('animate-spin', sizes[size], colors[color], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
