/**
 * 파일명: AuthFormLayout.tsx
 * 
 * 파일 용도:
 * 인증 폼 공통 레이아웃 컴포넌트
 * - 로그인/회원가입 페이지 공통 UI
 * - 로고, 타이틀, 서브타이틀
 * - 폼 컨테이너 및 푸터 링크
 * 
 * 사용처:
 * - LoginPage, SignupPage
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AuthFormLayoutProps {
  /** 페이지 타이틀 */
  title: string;
  /** 서브타이틀 */
  subtitle: string;
  /** 폼 콘텐츠 */
  children: React.ReactNode;
  /** 푸터 콘텐츠 */
  footer?: React.ReactNode;
  /** 에러 메시지 */
  error?: string | null;
  /** 추가 클래스 */
  className?: string;
}

/**
 * AuthFormLayout 컴포넌트
 * 
 * 역할:
 * - 인증 폼 공통 레이아웃 제공
 * - 일관된 스타일링
 * - 로고 및 브랜딩
 */
export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
  error,
  className,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* 배경 효과 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* 폼 컨테이너 */}
      <div className={cn('w-full max-w-md', className)}>
        {/* 로고 */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-500 to-cyan-500 flex items-center justify-center shadow-neon">
            <Sparkles className="w-6 h-6 text-slate-900" />
          </div>
          <span className="text-2xl font-bold text-white">BizPlan AI</span>
        </Link>

        {/* 폼 카드 */}
        <div className="glass-card p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-400">{subtitle}</p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* 폼 콘텐츠 */}
          {children}
        </div>

        {/* 푸터 */}
        {footer && (
          <div className="mt-6 text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFormLayout;

