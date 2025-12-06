/**
 * 파일명: Textarea.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 텍스트 영역 컴포넌트
 * - 글래스모피즘 스타일
 * - 다크 테마 최적화
 */

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 에러 상태 */
  error?: boolean;
}

/**
 * Textarea 컴포넌트
 * 글래스모피즘 스타일의 텍스트 영역
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
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
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
