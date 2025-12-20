/**
 * 파일명: useFinancialStore.ts
 * 
 * 파일 용도:
 * 재무 시뮬레이션 데이터 및 계산을 위한 Zustand Store
 * - 재무 가정 입력 관리
 * - 핵심 재무 지표 계산 (로컬 + API)
 * - 차트 데이터 생성
 * 
 * API 연동:
 * - financialService를 통해 백엔드 API 호출
 * - preview: 미리보기 (저장 안됨)
 * - runSimulation: 프로젝트 연동 저장
 * 
 * 사용하는 컴포넌트:
 * - FinancialSimulation: 재무 시뮬레이션 UI (마법사 4단계)
 * - FinancialCalculatorPage: 독립 계산기 페이지
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialInput, FinancialMetrics, ChartDataPoint } from '@/types';
import { financialService } from '@/service/financialService';

interface FinancialState {
  /** 사용자 입력 값 */
  input: FinancialInput;
  /** 계산된 재무 지표 */
  metrics: FinancialMetrics | null;
  /** 차트용 12개월 데이터 */
  chartData: ChartDataPoint[];
  /** 현재 프로젝트 ID */
  projectId: string | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  
  /** 프로젝트 ID 설정 */
  setProjectId: (projectId: string | null) => void;
  /** 입력 값 업데이트 (로컬 계산) */
  updateInput: (input: Partial<FinancialInput>) => void;
  /** 재무 지표 계산 (로컬) */
  calculateMetrics: () => void;
  /** 차트 데이터 생성 (로컬) */
  generateChartData: () => void;
  /** 재무 시뮬레이션 실행 (API - 프로젝트 연동) */
  runSimulation: () => Promise<void>;
  /** 재무 미리보기 (API - 저장 안됨) */
  preview: () => Promise<void>;
  /** 기본값으로 리셋 */
  reset: () => void;
  /** 에러 초기화 */
  clearError: () => void;
}

/** 기본 입력 값 */
const defaultInput: FinancialInput = {
  customers: 1000,
  pricePerCustomer: 35000,
  cac: 50000,
  fixedCosts: 10000000,
  variableCostRate: 20,
  churnRate: 5,
};

/**
 * useFinancialStore
 * 
 * 역할:
 * - 재무 가정 입력 관리
 * - 핵심 재무 지표 자동 계산
 * - 손익분기점 분석 차트 데이터 생성
 * - financialService를 통해 백엔드 API 연동
 */
export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      input: defaultInput,
      metrics: null,
      chartData: [],
      projectId: null,
      isLoading: false,
      error: null,

      /**
       * 프로젝트 ID 설정
       * @param projectId - 프로젝트 ID (null이면 미리보기 모드)
       */
      setProjectId: (projectId: string | null) => {
        set({ projectId });
      },

      /**
       * 입력 값 업데이트
       * - 입력이 변경되면 자동으로 로컬 지표 재계산 및 차트 재생성
       * @param newInput - 업데이트할 필드들
       */
      updateInput: (newInput: Partial<FinancialInput>) => {
        set((state) => ({
          input: { ...state.input, ...newInput },
        }));
        get().calculateMetrics();
        get().generateChartData();
      },

      /**
       * 재무 지표 계산 (로컬)
       * 빠른 피드백을 위해 로컬에서 계산
       */
      calculateMetrics: () => {
        const { input } = get();
        const { customers, pricePerCustomer, cac, fixedCosts, variableCostRate, churnRate } = input;

        // 월 매출 계산
        const monthlyRevenue = customers * pricePerCustomer;

        // 비용 계산 (고정비 + 변동비)
        const variableCosts = monthlyRevenue * (variableCostRate / 100);
        const totalCosts = fixedCosts + variableCosts;

        // 이익 계산
        const profit = monthlyRevenue - totalCosts;

        // LTV (고객 생애가치) 계산
        const avgLifetimeMonths = churnRate > 0 ? 100 / churnRate : 20;
        const ltv = pricePerCustomer * avgLifetimeMonths;

        // LTV/CAC 비율
        const ltvCacRatio = cac > 0 ? ltv / cac : 0;

        // 손익분기점 (고객 수)
        const contributionMargin = pricePerCustomer * (1 - variableCostRate / 100);
        const breakEvenPoint = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;

        const metrics: FinancialMetrics = {
          revenue: monthlyRevenue,
          totalCosts,
          profit,
          ltv,
          ltvCacRatio,
          breakEvenPoint,
        };

        set({ metrics });
      },

      /**
       * 차트 데이터 생성 (로컬)
       * - 12개월간 손익 추이 시뮬레이션
       * - 월 15% 고객 성장률 가정
       */
      generateChartData: () => {
        const { input } = get();
        const { customers, pricePerCustomer, fixedCosts, variableCostRate } = input;

        const data: ChartDataPoint[] = [];
        const growthRate = 1.15; // 월 15% 성장률 가정

        for (let month = 1; month <= 12; month++) {
          const monthlyCustomers = Math.floor(customers * Math.pow(growthRate, month - 1));
          const revenue = monthlyCustomers * pricePerCustomer;
          const variableCosts = revenue * (variableCostRate / 100);
          const costs = fixedCosts + variableCosts;
          const profit = revenue - costs;

          data.push({
            month,
            revenue,
            costs,
            profit,
          });
        }

        set({ chartData: data });
      },

      /**
       * 재무 시뮬레이션 실행 (API - 프로젝트 연동)
       * 결과가 백엔드에 저장됨
       */
      runSimulation: async () => {
        const { projectId, input } = get();
        if (!projectId) {
          console.warn('Project ID is not set. Use preview() instead.');
          return get().preview();
        }

        set({ isLoading: true, error: null });
        try {
          const response = await financialService.runSimulation(projectId, input);
          
          // API 응답으로 메트릭스 업데이트
          set({
            metrics: {
              revenue: response.revenue,
              totalCosts: response.totalCosts,
              profit: response.profit,
              ltv: response.ltv,
              ltvCacRatio: response.ltvCacRatio,
              breakEvenPoint: response.breakEvenPoint,
            },
            chartData: response.monthlyProjections,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '재무 시뮬레이션에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * 재무 미리보기 (API - 저장 안됨)
       * 프로젝트 연동 없이 계산만 수행
       */
      preview: async () => {
        const { input } = get();
        set({ isLoading: true, error: null });
        
        try {
          const response = await financialService.preview(input);
          
          // API 응답으로 메트릭스 업데이트
          set({
            metrics: {
              revenue: response.revenue,
              totalCosts: response.totalCosts,
              profit: response.profit,
              ltv: response.ltv,
              ltvCacRatio: response.ltvCacRatio,
              breakEvenPoint: response.breakEvenPoint,
            },
            chartData: response.monthlyProjections,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '재무 미리보기에 실패했습니다.';
          set({ isLoading: false, error: message });
          // API 실패 시 로컬 계산 결과 사용
          get().calculateMetrics();
          get().generateChartData();
        }
      },

      /**
       * 기본값으로 리셋
       */
      reset: () => {
        set({
          input: defaultInput,
          metrics: null,
          chartData: [],
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
      name: 'financial-storage',
      partialize: (state) => ({
        input: state.input,
        projectId: state.projectId,
      }),
    }
  )
);

export default useFinancialStore;
