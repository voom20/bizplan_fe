/**
 * 파일명: Input.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 입력 필드 컴포넌트
 * - 글래스모피즘 스타일
 * - 다크 테마 최적화
 * - 네온 포커스 효과
 * - 레이블 및 도움말 텍스트 지원
 */

import React, { forwardRef } from 'react';
import { cn } from '@/common/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 레이블 텍스트 */
  label?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 아이콘 (왼쪽) */
  icon?: React.ReactNode;
}

/**
 * Input 컴포넌트
 * 글래스모피즘 스타일의 입력 필드
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, errorMessage, helperText, icon, required, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="w-full">
        {/* 레이블 */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* 입력 필드 */}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // 기본 스타일
              'w-full px-4 py-3 rounded-xl',
              'bg-white/5 backdrop-blur-sm',
              'border border-white/10',
              'text-white placeholder-slate-500',
              // 포커스 스타일
              'focus:outline-none focus:border-neon-500/50',
              'focus:ring-2 focus:ring-neon-500/20',
              'focus:bg-white/10',
              // 트랜지션
              'transition-all duration-300',
              // 에러 스타일
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              // 아이콘이 있을 때 패딩 조정
              icon && 'pl-12',
              className
            )}
            required={required}
            {...props}
          />
        </div>

        {/* 에러 메시지 또는 도움말 */}
        {(errorMessage || helperText) && (
          <p className={cn(
            'mt-1.5 text-sm',
            error || errorMessage ? 'text-red-400' : 'text-slate-500'
          )}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
