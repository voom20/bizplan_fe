/**
 * 파일명: useWizardStore.ts
 * 
 * 파일 용도:
 * 마법사 진행 상태 및 데이터 관리를 위한 Zustand Store
 * - 5단계 마법사의 현재 단계 추적
 * - 각 단계별 질문 답변 저장
 * - 단계 완료 여부 검증
 * - 백엔드 API 연동으로 데이터 동기화
 * 
 * API 연동:
 * - wizardService를 통해 백엔드 API 호출
 * 
 * 사용하는 컴포넌트:
 * - WizardStep: 단계 관리 및 네비게이션
 * - QuestionForm: 질문 답변 저장
 * - Layout: 진행률 표시
 * - ProjectCreate: 마법사 초기화
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WizardData, WizardStep } from '@/types';
import { wizardService } from '@/service/wizardService';
import { wizardSteps as defaultWizardSteps } from '../types/mockData';

interface WizardState {
  /** 현재 마법사 단계 (1-5) */
  currentStep: number;
  /** 전체 마법사 단계 정의 */
  steps: WizardStep[];
  /** 단계별 사용자 입력 데이터 */
  wizardData: WizardData;
  /** 현재 프로젝트 ID */
  projectId: string | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 저장 중 상태 */
  isSaving: boolean;
  /** 에러 메시지 */
  error: string | null;
  
  /** 프로젝트 ID 설정 */
  setProjectId: (projectId: string) => void;
  /** 현재 단계 설정 */
  setCurrentStep: (step: number) => void;
  /** 답변 데이터 로드 (API) */
  loadAnswers: (projectId: string) => Promise<void>;
  /** 단계별 질문 답변 업데이트 (로컬 + API 저장) */
  updateStepData: (stepId: number, questionId: string, value: unknown) => void;
  /** 단계 답변 저장 (API) */
  saveStepAnswers: (stepId: number) => Promise<void>;
  /** 특정 단계의 데이터 조회 */
  getStepData: (stepId: number) => Record<string, unknown>;
  /** 단계 완료 여부 확인 (필수 질문 모두 답변 완료) */
  isStepCompleted: (stepId: number) => boolean;
  /** 다음 단계로 이동 */
  goToNextStep: () => void;
  /** 이전 단계로 이동 */
  goToPreviousStep: () => void;
  /** 마법사 초기화 */
  resetWizard: () => void;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * useWizardStore
 * 
 * 역할:
 * - 5단계 마법사의 상태 관리
 * - 사용자 입력 데이터 저장 및 검증
 * - 진행률 추적
 * - wizardService를 통해 백엔드 API 연동
 */
export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      steps: defaultWizardSteps,
      wizardData: {},
      projectId: null,
      isLoading: false,
      isSaving: false,
      error: null,

      /**
       * 프로젝트 ID 설정
       * @param projectId - 프로젝트 ID
       */
      setProjectId: (projectId: string) => {
        set({ projectId });
      },

      /**
       * 현재 단계 설정
       * @param step - 설정할 단계 번호 (1-5)
       */
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      /**
       * 답변 데이터 로드 (API)
       * @param projectId - 프로젝트 ID
       */
      loadAnswers: async (projectId: string) => {
        set({ isLoading: true, error: null, projectId });
        try {
          const response = await wizardService.getAnswersWithProgress(projectId);
          set({
            wizardData: response.answers as WizardData,
            currentStep: response.completedSteps + 1,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '답변 데이터 로드에 실패했습니다.';
          set({ isLoading: false, error: message });
          // 에러 시에도 기본 상태로 시작
          set({ wizardData: {}, currentStep: 1 });
        }
      },

      /**
       * 단계별 질문 답변 업데이트 (로컬 상태)
       * @param stepId - 단계 ID
       * @param questionId - 질문 ID
       * @param value - 답변 값
       */
      updateStepData: (stepId: number, questionId: string, value: unknown) => {
        set((state) => ({
          wizardData: {
            ...state.wizardData,
            [stepId]: {
              ...state.wizardData[stepId],
              [questionId]: value,
            },
          },
        }));
      },

      /**
       * 단계 답변 저장 (API)
       * @param stepId - 저장할 단계 ID
       */
      saveStepAnswers: async (stepId: number) => {
        const { projectId, wizardData } = get();
        if (!projectId) {
          console.warn('Project ID is not set');
          return;
        }

        const stepAnswers = wizardData[stepId] || {};
        set({ isSaving: true, error: null });

        try {
          await wizardService.saveStepAnswers(projectId, {
            stepId,
            answers: stepAnswers,
          });
          set({ isSaving: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : '답변 저장에 실패했습니다.';
          set({ isSaving: false, error: message });
          throw error;
        }
      },

      /**
       * 특정 단계의 데이터 조회
       * @param stepId - 단계 ID
       * @returns 해당 단계의 답변 객체
       */
      getStepData: (stepId: number) => {
        const state = get();
        return state.wizardData[stepId] || {};
      },

      /**
       * 단계 완료 여부 확인
       * @param stepId - 확인할 단계 ID
       * @returns 완료 여부
       */
      isStepCompleted: (stepId: number) => {
        const state = get();
        const step = state.steps.find((s) => s.id === stepId);
        if (!step) return false;

        const stepData = state.wizardData[stepId] || {};
        const requiredQuestions = step.questions.filter((q) => q.required);

        return requiredQuestions.every((q) => {
          const value = stepData[q.id];
          if (value === undefined || value === null) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          return true;
        });
      },

      /**
       * 다음 단계로 이동
       */
      goToNextStep: () => {
        set((state) => {
          const nextStep = Math.min(state.currentStep + 1, state.steps.length);
          return { currentStep: nextStep };
        });
      },

      /**
       * 이전 단계로 이동
       */
      goToPreviousStep: () => {
        set((state) => {
          const prevStep = Math.max(state.currentStep - 1, 1);
          return { currentStep: prevStep };
        });
      },

      /**
       * 마법사 초기화
       */
      resetWizard: () => {
        set({ 
          currentStep: 1, 
          wizardData: {},
          projectId: null,
          error: null,
        });
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'wizard-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        wizardData: state.wizardData,
        projectId: state.projectId,
      }),
    }
  )
);

export default useWizardStore;
