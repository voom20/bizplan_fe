/**
 * 파일명: Badge.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 배지/태그 컴포넌트
 * - 다양한 색상 옵션
 * - 다크 테마 최적화
 */

import React from 'react';
import { cn } from '@/common/utils';

interface BadgeProps {
  /** 배지 내용 */
  children: React.ReactNode;
  /** 배지 색상 */
  variant?: 'neon' | 'cyan' | 'violet' | 'slate' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * Badge 컴포넌트
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  className
}) => {
  const variants = {
    neon: 'bg-neon-500/20 text-neon-400 border-neon-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    slate: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    default: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        'border backdrop-blur-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
