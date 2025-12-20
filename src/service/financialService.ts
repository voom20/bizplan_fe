/**
 * 파일명: financialService.ts
 * 
 * 파일 용도:
 * 재무 시뮬레이션 관련 API 서비스
 * - 재무 시뮬레이션 실행
 * - 재무 지표 조회
 */

import api from '@/common/axios';
import type {
  ApiResponse,
  FinancialSimulationRequest,
  FinancialSimulationResponse,
} from '@/types';

/**
 * 재무 API 엔드포인트
 */
const FINANCIAL_ENDPOINTS = {
  SIMULATION: (projectId: string) =>
    `/projects/${projectId}/financial/simulation`,
  METRICS: (projectId: string) => `/projects/${projectId}/financial/metrics`,
  SAVE: (projectId: string) => `/projects/${projectId}/financial`,
} as const;

/**
 * 재무 API 서비스
 */
export const financialService = {
  /**
   * 재무 시뮬레이션 실행
   * @param projectId 프로젝트 ID
   * @param data 시뮬레이션 입력 값
   * @returns 시뮬레이션 결과
   */
  runSimulation: async (
    projectId: string,
    data: FinancialSimulationRequest
  ): Promise<FinancialSimulationResponse> => {
    const response = await api.post<ApiResponse<FinancialSimulationResponse>>(
      FINANCIAL_ENDPOINTS.SIMULATION(projectId),
      data
    );
    return response.data.data;
  },

  /**
   * 저장된 재무 지표 조회
   * @param projectId 프로젝트 ID
   * @returns 재무 지표
   */
  getMetrics: async (
    projectId: string
  ): Promise<FinancialSimulationResponse> => {
    const response = await api.get<ApiResponse<FinancialSimulationResponse>>(
      FINANCIAL_ENDPOINTS.METRICS(projectId)
    );
    return response.data.data;
  },

  /**
   * 재무 데이터 저장
   * @param projectId 프로젝트 ID
   * @param data 재무 입력 값
   * @returns 저장된 재무 지표
   */
  saveFinancialData: async (
    projectId: string,
    data: FinancialSimulationRequest
  ): Promise<FinancialSimulationResponse> => {
    const response = await api.put<ApiResponse<FinancialSimulationResponse>>(
      FINANCIAL_ENDPOINTS.SAVE(projectId),
      data
    );
    return response.data.data;
  },
};

export default financialService;

