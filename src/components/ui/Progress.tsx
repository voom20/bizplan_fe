/**
 * 파일명: Progress.tsx
 * 
 * 파일 용도:
 * 진행률 바 컴포넌트
 * - 네온 그라디언트 스타일
 * - 애니메이션 효과
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  /** 진행률 (0-100) */
  value: number;
  /** 레이블 표시 여부 */
  showLabel?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 색상 테마 */
  color?: 'neon' | 'cyan' | 'violet';
}

/**
 * Progress 컴포넌트
 * 네온 스타일 진행률 바
 */
export const Progress: React.FC<ProgressProps> = ({
  value,
  showLabel = false,
  className,
  color = 'neon'
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const colorStyles = {
    neon: 'from-neon-400 to-neon-500 shadow-neon-500/30',
    cyan: 'from-cyan-400 to-cyan-500 shadow-cyan-500/30',
    violet: 'from-violet-400 to-violet-500 shadow-violet-500/30',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">진행률</span>
          <span className="text-white font-medium">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            'bg-gradient-to-r shadow-lg',
            colorStyles[color]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
