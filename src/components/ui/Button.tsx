/**
 * 파일명: Button.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 버튼 컴포넌트
 * - 다양한 스타일 variant 제공 (neon, secondary, outline, ghost, danger)
 * - 3가지 크기 옵션 (sm, md, lg)
 * - 로딩 상태 지원
 * - 다크 테마 + 네온 스타일
 */

import React from 'react';
import { cn } from '@/common/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 */
  variant?: 'neon' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 로딩 상태 (스피너 표시 및 비활성화) */
  isLoading?: boolean;
  /** 버튼 내용 */
  children: React.ReactNode;
}

/**
 * Button 컴포넌트
 * 다크 테마에 최적화된 네온 스타일 버튼
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'neon',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-semibold',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'rounded-xl'
  );
  
  const variants = {
    neon: cn(
      'bg-gradient-to-r from-neon-400 to-neon-500 text-slate-900',
      'hover:from-neon-300 hover:to-neon-400',
      'shadow-lg shadow-neon-500/25 hover:shadow-neon-500/40',
      'hover:-translate-y-0.5',
      'focus:ring-neon-500'
    ),
    secondary: cn(
      'bg-slate-800 text-slate-100',
      'hover:bg-slate-700',
      'border border-slate-700 hover:border-slate-600',
      'focus:ring-slate-500'
    ),
    outline: cn(
      'bg-transparent text-neon-400',
      'border-2 border-neon-500/50 hover:border-neon-400',
      'hover:bg-neon-500/10',
      'focus:ring-neon-500'
    ),
    ghost: cn(
      'bg-transparent text-slate-300',
      'hover:bg-white/10 hover:text-white',
      'focus:ring-slate-500'
    ),
    danger: cn(
      'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'hover:from-red-400 hover:to-red-500',
      'shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
      'focus:ring-red-500'
    ),
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
      )}
      {children}
    </button>
  );
};
