/**
 * 파일명: financialService.ts
 * 
 * 파일 용도:
 * 재무 시뮬레이션 관련 API 서비스
 * - 재무 시뮬레이션 실행
 * - 재무 미리보기 (비로그인)
 * 
 * 백엔드 API 엔드포인트:
 * - POST /projects/{projectId}/financials/generate
 * - POST /financials/preview
 */

import api from '@/common/axios';
import type {
  FinancialSimulationRequest,
  FinancialSimulationResponse,
} from '@/types';

/**
 * 백엔드 재무 요청 타입
 */
interface FinancialAssumptionsRequest {
  initialCapital: number;
  averageRevenuePerUser: number;
  monthlyMarketingBudget: number;
  customerAcquisitionCost: number;
  monthlyChurnRate: number;
  monthlyFixedCosts: number;
  variableCostRate?: number;
  initialCustomers?: number;
  projectionMonths?: number;
}

/**
 * 백엔드 재무 응답 타입
 */
interface FinancialProjectionResponse {
  projectId?: string;
  monthlyPL: Array<{
    month: number;
    revenue: number;
    costs: number;
    profit: number;
    customers?: number;
  }>;
  yearlySummary: Array<{
    year: number;
    totalRevenue: number;
    totalCosts: number;
    netProfit: number;
  }>;
  unitEconomics: {
    ltv: number;
    cac: number;
    ltvCacRatio: number;
    paybackPeriodMonths: number;
  };
}

/**
 * 재무 API 엔드포인트 (백엔드 스펙에 맞춤)
 */
const FINANCIAL_ENDPOINTS = {
  GENERATE: (projectId: string) => `/projects/${projectId}/financials/generate`,
  PREVIEW: '/financials/preview',
} as const;

/**
 * 프론트엔드 요청을 백엔드 형식으로 변환
 */
const convertToBackendRequest = (data: FinancialSimulationRequest): FinancialAssumptionsRequest => ({
  initialCapital: 50000000, // 기본값
  averageRevenuePerUser: data.pricePerCustomer,
  monthlyMarketingBudget: data.cac * data.customers, // 예상 마케팅 비용
  customerAcquisitionCost: data.cac,
  monthlyChurnRate: data.churnRate,
  monthlyFixedCosts: data.fixedCosts,
  variableCostRate: data.variableCostRate,
  initialCustomers: data.customers,
  projectionMonths: 36,
});

/**
 * 백엔드 응답을 프론트엔드 형식으로 변환
 */
const convertToFrontendResponse = (data: FinancialProjectionResponse): FinancialSimulationResponse => ({
  revenue: data.yearlySummary[0]?.totalRevenue || 0,
  totalCosts: data.yearlySummary[0]?.totalCosts || 0,
  profit: data.yearlySummary[0]?.netProfit || 0,
  ltv: data.unitEconomics.ltv,
  ltvCacRatio: data.unitEconomics.ltvCacRatio,
  breakEvenPoint: data.unitEconomics.paybackPeriodMonths,
  monthlyProjections: data.monthlyPL.map(pl => ({
    month: pl.month,
    revenue: pl.revenue,
    costs: pl.costs,
    profit: pl.profit,
  })),
});

/**
 * 재무 API 서비스
 */
export const financialService = {
  /**
   * 재무 추정 생성 (프로젝트 연동)
   * @param projectId 프로젝트 ID
   * @param data 시뮬레이션 입력 값
   * @returns 시뮬레이션 결과
   */
  runSimulation: async (
    projectId: string,
    data: FinancialSimulationRequest
  ): Promise<FinancialSimulationResponse> => {
    const requestBody = convertToBackendRequest(data);
    const response = await api.post<FinancialProjectionResponse>(
      FINANCIAL_ENDPOINTS.GENERATE(projectId),
      requestBody
    );
    return convertToFrontendResponse(response.data);
  },

  /**
   * 재무 추정 미리보기 (프로젝트 미연동)
   * 결과는 저장되지 않음
   * @param data 시뮬레이션 입력 값
   * @returns 시뮬레이션 결과
   */
  preview: async (
    data: FinancialSimulationRequest
  ): Promise<FinancialSimulationResponse> => {
    const requestBody = convertToBackendRequest(data);
    const response = await api.post<FinancialProjectionResponse>(
      FINANCIAL_ENDPOINTS.PREVIEW,
      requestBody
    );
    return convertToFrontendResponse(response.data);
  },

  /**
   * 재무 데이터 저장 (generate와 동일)
   * @param projectId 프로젝트 ID
   * @param data 재무 입력 값
   * @returns 저장된 재무 지표
   */
  saveFinancialData: async (
    projectId: string,
    data: FinancialSimulationRequest
  ): Promise<FinancialSimulationResponse> => {
    return financialService.runSimulation(projectId, data);
  },

  /**
   * 재무 지표 조회 (현재 미지원 - generate 결과 반환)
   * @param projectId 프로젝트 ID
   * @returns 재무 지표
   */
  getMetrics: async (
    projectId: string
  ): Promise<FinancialSimulationResponse | null> => {
    // 백엔드에서 저장된 재무 데이터 조회 API가 없으므로 null 반환
    // 프로젝트 정보에서 가져오거나 로컬 캐시 사용 필요
    console.warn(`getMetrics for project ${projectId} - API not available`);
    return null;
  },
};

export default financialService;
