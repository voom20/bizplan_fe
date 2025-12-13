/**
 * 파일명: FinancialCalculatorPage.tsx
 * 
 * 파일 용도:
 * 독립형 재무 계산기 페이지 (Public Route)
 * - 비로그인 사용자도 접근 가능
 * - 재무 시뮬레이션 미리보기
 * - 로그인 유도 CTA 배너
 * 
 * 라우트: /calculator
 * 
 * 호출 구조:
 * FinancialCalculatorPage (이 컴포넌트)
 *   ├─> PreviewFinancialForm - 재무 입력 폼 및 차트
 *   ├─> CTABanner - 로그인 유도 배너
 *   └─> useAuthStore - 로그인 상태 확인
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { PreviewFinancialForm, FinancialInput } from '../components/PreviewFinancialForm';
import { CTABanner } from '../components/CTABanner';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui';
import { cn } from '../lib/utils';

/**
 * FinancialCalculatorPage 컴포넌트
 * 
 * 역할:
 * - 독립형 재무 계산기 페이지
 * - 비로그인 사용자 접근 가능
 * - 로그인 시 프로젝트 저장 유도
 */
export const FinancialCalculatorPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [financialData, setFinancialData] = useState<Partial<FinancialInput>>({});

  /**
   * 재무 데이터 변경 핸들러
   */
  const handleInputChange = useCallback((input: FinancialInput) => {
    setFinancialData(input);
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-neon-500 flex items-center justify-center shadow-neon-lg flex-shrink-0">
                <Calculator className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  재무 추정 계산기
                </h1>
                <p className="text-slate-400 max-w-xl">
                  핵심 비즈니스 변수를 입력하면 손익분기점, LTV/CAC 비율 등 
                  주요 재무 지표를 실시간으로 확인할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 로그인된 경우 프로젝트 생성 버튼 */}
            {isAuthenticated && (
              <Link to="/">
                <Button size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  프로젝트로 저장하기
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 기능 소개 (비로그인 시) */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="실시간 시뮬레이션"
              description="값을 변경하면 즉시 결과가 업데이트됩니다"
              color="cyan"
            />
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="즉시 사용 가능"
              description="회원가입 없이 바로 계산해볼 수 있습니다"
              color="neon"
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title="프로젝트 저장"
              description="로그인하면 결과를 저장하고 공유할 수 있습니다"
              color="violet"
            />
          </div>
        )}

        {/* 메인 컨텐츠 */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* 계산기 폼 (2/3) */}
          <div className="lg:col-span-2">
            <PreviewFinancialForm onInputChange={handleInputChange} />
          </div>

          {/* 사이드바 (1/3) */}
          <div className="mt-8 lg:mt-0 space-y-6">
            {/* CTA 배너 (비로그인 시) */}
            {!isAuthenticated && (
              <CTABanner 
                variant="default" 
                financialData={{
                  customers: financialData.customers,
                  pricePerCustomer: financialData.pricePerCustomer,
                  cac: financialData.cac,
                  fixedCosts: financialData.fixedCosts,
                }}
              />
            )}

            {/* 도움말 */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">💡 가이드</h3>
              <div className="space-y-4 text-sm text-slate-400">
                <div>
                  <p className="font-medium text-slate-300 mb-1">LTV/CAC 비율</p>
                  <p>3 이상이면 건강한 비즈니스 모델입니다. 1 미만이면 고객 획득에 손실이 발생합니다.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-300 mb-1">손익분기점</p>
                  <p>이익이 0이 되는 최소 고객 수입니다. 이 숫자보다 많은 고객을 확보해야 수익이 발생합니다.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-300 mb-1">이탈률</p>
                  <p>매월 서비스를 떠나는 고객의 비율입니다. 5% 이하를 목표로 하세요.</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">자주 묻는 질문</h3>
              <div className="space-y-4">
                <FAQItem
                  question="계산 결과가 저장되나요?"
                  answer="비로그인 상태에서는 저장되지 않습니다. 로그인하면 프로젝트로 저장할 수 있습니다."
                />
                <FAQItem
                  question="어떤 데이터가 필요한가요?"
                  answer="예상 고객 수, 객단가, 고객 획득 비용, 고정비, 변동비율, 이탈률이 필요합니다."
                />
                <FAQItem
                  question="결과를 공유할 수 있나요?"
                  answer="로그인 후 프로젝트로 저장하면 PDF나 링크로 공유할 수 있습니다."
                />
              </div>
            </div>
          </div>
        </div>

        {/* 플로팅 CTA (비로그인 시, 모바일용) */}
        {!isAuthenticated && (
          <div className="lg:hidden">
            <CTABanner 
              variant="floating" 
              financialData={{
                customers: financialData.customers,
                pricePerCustomer: financialData.pricePerCustomer,
                cac: financialData.cac,
                fixedCosts: financialData.fixedCosts,
              }}
            />
            {/* 플로팅 배너 높이만큼 여백 추가 */}
            <div className="h-24" />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 기능 카드 컴포넌트
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'cyan' | 'neon' | 'violet';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const colorStyles = {
    cyan: 'bg-cyan-500/20 text-cyan-400',
    neon: 'bg-neon-500/20 text-neon-400',
    violet: 'bg-violet-500/20 text-violet-400',
  };

  return (
    <div className="glass-card p-4 flex items-start gap-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorStyles[color])}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
};

/**
 * FAQ 아이템 컴포넌트
 */
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
  <div>
    <p className="font-medium text-slate-300 mb-1">{question}</p>
    <p className="text-sm text-slate-400">{answer}</p>
  </div>
);

export default FinancialCalculatorPage;

