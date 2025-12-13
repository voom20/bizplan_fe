/**
 * 파일명: Card.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 카드 컴포넌트 및 관련 하위 컴포넌트
 * - 글래스모피즘 스타일
 * - 다크 테마 최적화
 * - Compound Component 패턴
 */

import React from 'react';
import { cn } from '@/common/utils';

interface CardProps {
  /** 카드 내용 */
  children: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 호버 시 효과 활성화 */
  hover?: boolean;
  /** 글로우 색상 */
  glow?: 'neon' | 'cyan' | 'violet' | 'none';
}

/**
 * Card 컴포넌트 (메인 컨테이너)
 * 글래스모피즘 스타일의 카드
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  onClick,
  hover = false,
  glow = 'none'
}) => {
  const glowStyles = {
    neon: 'hover:shadow-neon hover:border-neon-500/30',
    cyan: 'hover:shadow-cyan hover:border-cyan-500/30',
    violet: 'hover:shadow-violet hover:border-violet-500/30',
    none: ''
  };

  return (
    <div
      className={cn(
        // 기본 글래스모피즘 스타일
        'bg-white/5 backdrop-blur-xl rounded-2xl',
        'border border-white/10',
        'shadow-glass',
        // 호버 효과
        hover && [
          'transition-all duration-300 cursor-pointer',
          'hover:bg-white/10 hover:border-white/20',
          'hover:-translate-y-1',
          glowStyles[glow]
        ],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardHeader 컴포넌트
 * - 카드의 헤더 영역
 */
export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-5 border-b border-white/10', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardTitle 컴포넌트
 * - 카드의 제목 텍스트
 */
export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardDescription 컴포넌트
 * - 카드의 설명 텍스트
 */
export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn('mt-1.5 text-sm text-slate-400', className)}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardContent 컴포넌트
 * - 카드의 본문 영역
 */
export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardFooter 컴포넌트
 * - 카드의 푸터 영역
 */
export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-white/10 bg-white/5 rounded-b-2xl', className)}>
      {children}
    </div>
  );
};
