/**
 * 파일명: CTABanner.tsx
 * 
 * 파일 용도:
 * 로그인/회원가입 유도 배너 컴포넌트
 * - 비로그인 사용자에게 프로젝트 저장 기능 안내
 * - 로그인 페이지로 연결
 * - 현재 입력값을 URL 파라미터로 전달
 * 
 * 디자인: 다크 모드 + 그라데이션 + 네온 액센트
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Zap, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CTABannerProps {
  /** 배너 변형 */
  variant?: 'default' | 'compact' | 'floating';
  /** 현재 입력된 재무 데이터 (URL로 전달용) */
  financialData?: {
    customers?: number;
    pricePerCustomer?: number;
    cac?: number;
    fixedCosts?: number;
  };
  /** 추가 클래스 */
  className?: string;
}

/**
 * CTABanner 컴포넌트
 * 
 * 역할:
 * - 비로그인 사용자에게 로그인 유도
 * - 재무 계산 결과를 프로젝트로 저장하도록 안내
 * - 로그인 후 데이터 유지를 위한 URL 파라미터 전달
 */
export const CTABanner: React.FC<CTABannerProps> = ({
  variant = 'default',
  financialData,
  className,
}) => {
  const navigate = useNavigate();

  /**
   * 로그인 페이지로 이동 (데이터 유지)
   */
  const handleLoginClick = () => {
    // 재무 데이터를 URL 파라미터로 인코딩
    const params = new URLSearchParams();
    if (financialData) {
      params.set('redirect', '/calculator');
      if (financialData.customers) params.set('customers', financialData.customers.toString());
      if (financialData.pricePerCustomer) params.set('arpu', financialData.pricePerCustomer.toString());
      if (financialData.cac) params.set('cac', financialData.cac.toString());
      if (financialData.fixedCosts) params.set('fixed', financialData.fixedCosts.toString());
    }
    
    const queryString = params.toString();
    navigate(`/login${queryString ? `?${queryString}` : ''}`);
  };

  /**
   * 회원가입 페이지로 이동
   */
  const handleSignupClick = () => {
    const params = new URLSearchParams();
    if (financialData) {
      params.set('redirect', '/calculator');
    }
    
    const queryString = params.toString();
    navigate(`/signup${queryString ? `?${queryString}` : ''}`);
  };

  // 플로팅 변형 (화면 하단 고정)
  if (variant === 'floating') {
    return (
      <div className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95',
        'backdrop-blur-xl border-t border-white/10',
        'px-4 py-4',
        className
      )}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-500/20 flex items-center justify-center">
              <Save className="w-5 h-5 text-neon-400" />
            </div>
            <div>
              <p className="font-semibold text-white">이 설정을 저장하시겠어요?</p>
              <p className="text-sm text-slate-400">로그인하면 프로젝트로 저장할 수 있습니다</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleLoginClick}>
              로그인
            </Button>
            <Button size="sm" onClick={handleSignupClick}>
              무료로 시작
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 컴팩트 변형
  if (variant === 'compact') {
    return (
      <div className={cn(
        'glass-card p-4 flex items-center justify-between gap-4',
        className
      )}>
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-slate-400" />
          <p className="text-sm text-slate-300">
            프로젝트로 저장하려면 <span className="text-neon-400 font-medium">로그인</span>이 필요합니다
          </p>
        </div>
        <Button size="sm" onClick={handleLoginClick}>
          로그인
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  // 기본 변형
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl',
      'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800',
      'border border-white/10',
      className
    )}>
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-500/10 via-cyan-500/10 to-violet-500/10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative p-8">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-500 to-cyan-500 flex items-center justify-center shadow-neon">
            <Sparkles className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              이 설정으로 프로젝트를 시작하세요
            </h3>
            <p className="text-sm text-slate-400">
              무료 회원가입으로 모든 기능을 이용할 수 있습니다
            </p>
          </div>
        </div>

        {/* 기능 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-neon-500/20 flex items-center justify-center flex-shrink-0">
              <Save className="w-4 h-4 text-neon-400" />
            </div>
            <span className="text-sm">재무 데이터 저장</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-sm">AI 사업계획서 생성</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm">PDF/HWP 내보내기</span>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="lg" 
            onClick={handleSignupClick}
            className="flex-1 sm:flex-none"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleLoginClick}
            className="flex-1 sm:flex-none"
          >
            이미 계정이 있어요
          </Button>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center sm:text-left">
          가입 시 현재 입력한 재무 데이터가 자동으로 저장됩니다
        </p>
      </div>
    </div>
  );
};

export default CTABanner;

