/**
 * 파일명: SectionRegenerateButton.tsx
 * 
 * 파일 용도:
 * 사업계획서 섹션별 재생성 버튼 컴포넌트
 * - 특정 섹션을 AI로 다시 생성
 * - 로딩 상태 표시
 * - 새 버전 생성 알림
 * 
 * 디자인: 다크 모드 + 네온 액센트 + 호버 효과
 */

import React, { useState } from 'react';
import { RefreshCw, Sparkles, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/common/utils';

/** 재생성 상태 */
type RegenerateStatus = 'idle' | 'loading' | 'success' | 'error';

interface SectionRegenerateButtonProps {
  /** 섹션 ID */
  sectionId: string;
  /** 섹션 이름 (접근성용) */
  sectionName?: string;
  /** 재생성 핸들러 */
  onRegenerate: (sectionId: string) => Promise<void>;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 크기 변형 */
  size?: 'sm' | 'md';
  /** 변형 */
  variant?: 'default' | 'ghost';
}

/**
 * SectionRegenerateButton 컴포넌트
 * 
 * 역할:
 * - 섹션별 AI 재생성 트리거
 * - 로딩/성공/에러 상태 표시
 * - 호버 시 "AI 다시 쓰기" 툴팁
 */
export const SectionRegenerateButton: React.FC<SectionRegenerateButtonProps> = ({
  sectionId,
  sectionName = '섹션',
  onRegenerate,
  disabled = false,
  size = 'sm',
  variant = 'ghost',
}) => {
  const [status, setStatus] = useState<RegenerateStatus>('idle');

  /**
   * 재생성 핸들러
   */
  const handleClick = async () => {
    if (status === 'loading' || disabled) return;

    setStatus('loading');
    try {
      await onRegenerate(sectionId);
      setStatus('success');
      
      // 2초 후 idle로 복귀
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      
      // 3초 후 idle로 복귀
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // 상태별 아이콘
  const Icon = {
    idle: RefreshCw,
    loading: RefreshCw,
    success: Check,
    error: AlertCircle,
  }[status];

  // 상태별 텍스트
  const statusText = {
    idle: 'AI 다시 쓰기',
    loading: '생성 중...',
    success: '완료!',
    error: '실패',
  }[status];

  // 크기별 스타일 - 반응형
  const sizeStyles = {
    sm: 'px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm gap-1.5',
    md: 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm gap-2',
  };

  // 변형별 스타일
  const variantStyles = {
    default: cn(
      'bg-white/5 border border-white/10',
      'hover:bg-white/10 hover:border-neon-500/30',
      status === 'success' && 'bg-neon-500/10 border-neon-500/30 text-neon-400',
      status === 'error' && 'bg-red-500/10 border-red-500/30 text-red-400'
    ),
    ghost: cn(
      'hover:bg-white/10',
      status === 'success' && 'bg-neon-500/10 text-neon-400',
      status === 'error' && 'bg-red-500/10 text-red-400'
    ),
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || status === 'loading'}
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-neon-500/30',
        sizeStyles[size],
        variantStyles[variant],
        status === 'idle' && 'text-slate-400 hover:text-white',
        status === 'loading' && 'text-cyan-400'
      )}
      aria-label={`${sectionName} ${statusText}`}
    >
      <Icon 
        className={cn(
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
          status === 'loading' && 'animate-spin'
        )} 
      />
      <span>{statusText}</span>
      
      {/* 로딩 중 Sparkles 효과 */}
      {status === 'loading' && (
        <Sparkles className={cn(
          'absolute opacity-50',
          size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
          'animate-pulse text-cyan-400'
        )} />
      )}
    </button>
  );
};

export default SectionRegenerateButton;

