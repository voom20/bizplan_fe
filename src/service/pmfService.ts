/**
 * 파일명: pmfService.ts
 * 
 * 파일 용도:
 * PMF(Product-Market Fit) 진단 관련 API 서비스
 * - PMF 설문 조회
 * - 설문 결과 제출
 * - 리포트 조회
 */

import api from '@/common/axios';
import type { PMFQuestion } from '@/types';
import type {
  ApiResponse,
  SubmitPMFSurveyRequest,
  PMFReportResponse,
} from '@/types';

/**
 * PMF API 엔드포인트
 */
const PMF_ENDPOINTS = {
  QUESTIONS: '/pmf/questions',
  SUBMIT: (projectId: string) => `/projects/${projectId}/pmf/submit`,
  REPORT: (projectId: string) => `/projects/${projectId}/pmf/report`,
} as const;

/**
 * PMF API 서비스
 */
export const pmfService = {
  /**
   * PMF 설문 질문 목록 조회
   * @returns PMF 질문 목록
   */
  getQuestions: async (): Promise<PMFQuestion[]> => {
    const response = await api.get<ApiResponse<PMFQuestion[]>>(
      PMF_ENDPOINTS.QUESTIONS
    );
    return response.data.data;
  },

  /**
   * PMF 설문 결과 제출
   * @param projectId 프로젝트 ID
   * @param data 설문 답변
   * @returns PMF 리포트
   */
  submitSurvey: async (
    projectId: string,
    data: SubmitPMFSurveyRequest
  ): Promise<PMFReportResponse> => {
    const response = await api.post<ApiResponse<PMFReportResponse>>(
      PMF_ENDPOINTS.SUBMIT(projectId),
      data
    );
    return response.data.data;
  },

  /**
   * PMF 리포트 조회
   * @param projectId 프로젝트 ID
   * @returns PMF 리포트
   */
  getReport: async (projectId: string): Promise<PMFReportResponse> => {
    const response = await api.get<ApiResponse<PMFReportResponse>>(
      PMF_ENDPOINTS.REPORT(projectId)
    );
    return response.data.data;
  },
};

export default pmfService;

