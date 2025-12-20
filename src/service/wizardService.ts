/**
 * 파일명: wizardService.ts
 * 
 * 파일 용도:
 * 위저드(마법사) 관련 API 서비스
 * - 위저드 단계 정보 조회
 * - 답변 저장/조회
 * - 진행 상태 관리
 * 
 * 백엔드 API 엔드포인트:
 * - GET /projects/{projectId}/wizard/answers
 * - GET /projects/{projectId}/wizard/steps/{stepId}
 * - POST /projects/{projectId}/wizard/steps
 */

import api from '@/common/axios';
import type { WizardData } from '@/types';
import type {
  SaveWizardAnswersRequest,
  WizardProgressResponse,
} from '@/types';

/**
 * 위저드 답변 응답 타입 (백엔드 스펙)
 */
interface WizardAnswersResponse {
  projectId: string;
  answers: Record<string, Record<string, unknown>>;
  completedSteps: number;
  totalSteps: number;
}

/**
 * 위저드 API 엔드포인트 (백엔드 스펙에 맞춤)
 */
const WIZARD_ENDPOINTS = {
  // 전체 답변 조회
  ANSWERS: (projectId: string) => `/projects/${projectId}/wizard/answers`,
  // 단계별 답변 조회
  STEP_ANSWERS: (projectId: string, stepId: string) =>
    `/projects/${projectId}/wizard/steps/${stepId}`,
  // 답변 저장 (POST)
  SAVE_ANSWERS: (projectId: string) => `/projects/${projectId}/wizard/steps`,
} as const;

/**
 * 위저드 API 서비스
 */
export const wizardService = {
  /**
   * 전체 답변 조회
   * @param projectId 프로젝트 ID
   * @returns 모든 단계의 답변 데이터
   */
  getAnswers: async (projectId: string): Promise<WizardData> => {
    const response = await api.get<WizardAnswersResponse>(
      WIZARD_ENDPOINTS.ANSWERS(projectId)
    );
    return response.data.answers as WizardData;
  },

  /**
   * 전체 답변 응답 조회 (진행 상태 포함)
   * @param projectId 프로젝트 ID
   * @returns 전체 답변 및 진행 상태
   */
  getAnswersWithProgress: async (projectId: string): Promise<WizardAnswersResponse> => {
    const response = await api.get<WizardAnswersResponse>(
      WIZARD_ENDPOINTS.ANSWERS(projectId)
    );
    return response.data;
  },

  /**
   * 특정 단계 답변 조회
   * @param projectId 프로젝트 ID
   * @param stepId 단계 ID
   * @returns 해당 단계의 답변 데이터
   */
  getStepAnswers: async (
    projectId: string,
    stepId: string
  ): Promise<Record<string, unknown>> => {
    const response = await api.get<Record<string, unknown>>(
      WIZARD_ENDPOINTS.STEP_ANSWERS(projectId, stepId)
    );
    return response.data;
  },

  /**
   * 답변 저장
   * @param projectId 프로젝트 ID
   * @param data 단계 ID 및 답변 데이터
   * @returns 저장된 답변 응답
   */
  saveStepAnswers: async (
    projectId: string,
    data: SaveWizardAnswersRequest
  ): Promise<WizardAnswersResponse> => {
    const response = await api.post<WizardAnswersResponse>(
      WIZARD_ENDPOINTS.SAVE_ANSWERS(projectId),
      {
        stepId: data.stepId.toString(),
        answers: data.answers,
      }
    );
    return response.data;
  },

  /**
   * 위저드 진행 상태 조회
   * @param projectId 프로젝트 ID
   * @returns 진행 상태 정보
   */
  getProgress: async (projectId: string): Promise<WizardProgressResponse> => {
    const response = await api.get<WizardAnswersResponse>(
      WIZARD_ENDPOINTS.ANSWERS(projectId)
    );
    return {
      currentStep: response.data.completedSteps + 1,
      totalSteps: response.data.totalSteps,
      completedSteps: Array.from({ length: response.data.completedSteps }, (_, i) => i + 1),
      progress: Math.round((response.data.completedSteps / response.data.totalSteps) * 100),
    };
  },
};

export default wizardService;
