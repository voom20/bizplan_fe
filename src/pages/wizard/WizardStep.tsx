/**
 * 파일명: WizardStep.tsx
 * 
 * 파일 용도:
 * 마법사 단계별 페이지 컨테이너
 * - URL 파라미터로 현재 단계 결정
 * - 단계에 맞는 컴포넌트 렌더링 (QuestionForm, FinancialSimulation, PMFSurvey)
 * - 단계 간 이동 및 진행 상태 관리
 * 
 * 호출 구조:
 * WizardStep (이 컴포넌트)
 *   ├─> useWizardStore - 마법사 상태 관리
 *   │   ├─> setCurrentStep() - 현재 단계 설정
 *   │   ├─> isStepCompleted() - 단계 완료 여부 확인
 *   │   ├─> goToNextStep() - 다음 단계로 이동
 *   │   └─> goToPreviousStep() - 이전 단계로 이동
 *   │
 *   └─> 단계별 컴포넌트 렌더링
 *       ├─> QuestionForm (1-3단계) - 질문 폼
 *       ├─> FinancialSimulation (4단계) - 재무 시뮬레이션
 *       └─> PMFSurvey (5단계) - PMF 설문
 * 
 * 데이터 흐름:
 * URL (/wizard/:stepId) → stepId 추출 → 해당 단계 렌더링
 * ↓
 * 사용자 입력 → 각 단계 컴포넌트 → useWizardStore 업데이트
 * ↓
 * 완료 시 → navigate('/business-plan')
 * 
 * 사용하는 Store:
 * - useWizardStore: 마법사 진행 상태 및 단계별 데이터
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWizardStore } from '@/stores/useWizardStore';
import { Button } from '@/components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QuestionForm } from '@/pages/wizard/QuestionForm';
import { FinancialSimulation } from '@/pages/wizard/FinancialSimulation';
import { PMFSurvey } from '@/pages/wizard/PMFSurvey';

/**
 * WizardStep 컴포넌트
 * 
 * 역할:
 * - 마법사 단계별 페이지 라우팅 및 렌더링
 * - 단계 간 네비게이션 제어
 * - 진행 상태 동기화
 * 
 * 주요 기능:
 * 1. URL 파라미터로 현재 단계 결정
 * 2. 단계별 적절한 컴포넌트 렌더링
 * 3. 이전/다음 버튼으로 단계 이동
 * 4. 단계 완료 여부에 따른 진행 제어
 * 5. 마지막 단계 완료 시 사업계획서 페이지로 이동
 * 
 * @returns {JSX.Element} 마법사 단계 페이지
 */
export const WizardStep: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, steps, isStepCompleted, goToNextStep, goToPreviousStep } = useWizardStore();

  const stepNumber = parseInt(stepId || '1', 10);
  const step = steps.find((s) => s.id === stepNumber);

  /**
   * URL 파라미터와 Store 상태 동기화
   * - URL이 변경되면 Store의 currentStep도 업데이트
   */
  useEffect(() => {
    if (stepNumber !== currentStep) {
      setCurrentStep(stepNumber);
    }
  }, [stepNumber, currentStep, setCurrentStep]);

  if (!step) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">단계를 찾을 수 없습니다</h2>
          <Button onClick={() => navigate('/wizard/1')}>첫 단계로 이동</Button>
        </div>
      </div>
    );
  }

  /**
   * 다음 단계로 이동
   * 
   * 처리 순서:
   * 1. 마지막 단계가 아니면 → 다음 단계 번호로 이동
   * 2. 마지막 단계이면 → 사업계획서 페이지로 이동
   */
  const handleNext = () => {
    if (stepNumber < steps.length) {
      goToNextStep();
      navigate(`/wizard/${stepNumber + 1}`);
    } else {
      // Navigate to business plan viewer
      navigate('/business-plan');
    }
  };

  /**
   * 이전 단계로 이동
   * - 첫 단계가 아니면 이전 단계 번호로 이동
   */
  const handlePrevious = () => {
    if (stepNumber > 1) {
      goToPreviousStep();
      navigate(`/wizard/${stepNumber - 1}`);
    }
  };

  const isCompleted = isStepCompleted(stepNumber);
  const canProceed = stepNumber === steps.length || isCompleted || stepNumber === 4 || stepNumber === 5;

  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
      {/* Step Header - 반응형 */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <span className="text-2xl sm:text-3xl lg:text-4xl">{step.icon}</span>
          <div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              Step {step.id} / {steps.length}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{step.title}</h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-300 mt-2">{step.description}</p>
      </div>

      {/* Step Content - 반응형 패딩 */}
      <div className="glass-card p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
        {stepNumber === 4 ? (
          <FinancialSimulation />
        ) : stepNumber === 5 ? (
          <PMFSurvey />
        ) : (
          <QuestionForm questions={step.questions} stepId={stepNumber} />
        )}
      </div>

      {/* Navigation - 반응형 */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={stepNumber === 1}
          className="text-sm sm:text-base"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">이전</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="text-sm sm:text-base"
        >
          {stepNumber === steps.length ? '사업계획서 생성' : <><span className="hidden sm:inline">다음</span><span className="sm:hidden">다음</span></>}
          {stepNumber < steps.length && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>

      {/* Help Text - 반응형 */}
      {!isCompleted && stepNumber !== 4 && stepNumber !== 5 && (
        <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-slate-400 px-2">
          필수 항목(*)을 모두 입력하면 다음 단계로 진행할 수 있습니다.
        </div>
      )}
    </div>
  );
};

export default WizardStep;

