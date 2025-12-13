/**
 * 파일명: Textarea.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 텍스트 영역 컴포넌트
 * - 글래스모피즘 스타일
 * - 다크 테마 최적화
 * - 레이블 및 도움말 텍스트 지원
 */

import React, { forwardRef } from 'react';
import { cn } from '@/common/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 레이블 텍스트 */
  label?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 도움말 텍스트 */
  helperText?: string;
}

/**
 * Textarea 컴포넌트
 * 글래스모피즘 스타일의 텍스트 영역
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, errorMessage, helperText, required, id, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="w-full">
        {/* 레이블 */}
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* 텍스트 영역 */}
        <textarea
          ref={ref}
          id={textareaId}
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
            // 리사이즈
            'resize-none',
            // 스크롤바 스타일
            'scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent',
            // 에러 스타일
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          required={required}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
