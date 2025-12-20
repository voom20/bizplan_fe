/**
 * 파일명: wizardService.ts
 * 
 * 파일 용도:
 * 위저드(마법사) 관련 API 서비스
 * - 위저드 단계 정보 조회
 * - 답변 저장/조회
 * - 진행 상태 관리
 */

import api from '@/common/axios';
import type { WizardStep, WizardData } from '@/types';
import type {
  ApiResponse,
  SaveWizardAnswersRequest,
  WizardProgressResponse,
} from '@/types';

/**
 * 위저드 API 엔드포인트
 */
const WIZARD_ENDPOINTS = {
  STEPS: (projectId: string) => `/projects/${projectId}/wizard/steps`,
  STEP_DETAIL: (projectId: string, stepId: number) =>
    `/projects/${projectId}/wizard/steps/${stepId}`,
  ANSWERS: (projectId: string) => `/projects/${projectId}/wizard/answers`,
  STEP_ANSWERS: (projectId: string, stepId: number) =>
    `/projects/${projectId}/wizard/steps/${stepId}/answers`,
  PROGRESS: (projectId: string) => `/projects/${projectId}/wizard/progress`,
} as const;

/**
 * 위저드 API 서비스
 */
export const wizardService = {
  /**
   * 위저드 단계 목록 조회
   * @param projectId 프로젝트 ID
   * @returns 위저드 단계 목록
   */
  getSteps: async (projectId: string): Promise<WizardStep[]> => {
    const response = await api.get<ApiResponse<WizardStep[]>>(
      WIZARD_ENDPOINTS.STEPS(projectId)
    );
    return response.data.data;
  },

  /**
   * 특정 단계 상세 조회
   * @param projectId 프로젝트 ID
   * @param stepId 단계 ID
   * @returns 단계 상세 정보
   */
  getStepDetail: async (
    projectId: string,
    stepId: number
  ): Promise<WizardStep> => {
    const response = await api.get<ApiResponse<WizardStep>>(
      WIZARD_ENDPOINTS.STEP_DETAIL(projectId, stepId)
    );
    return response.data.data;
  },

  /**
   * 전체 답변 조회
   * @param projectId 프로젝트 ID
   * @returns 모든 단계의 답변 데이터
   */
  getAnswers: async (projectId: string): Promise<WizardData> => {
    const response = await api.get<ApiResponse<WizardData>>(
      WIZARD_ENDPOINTS.ANSWERS(projectId)
    );
    return response.data.data;
  },

  /**
   * 특정 단계 답변 저장
   * @param projectId 프로젝트 ID
   * @param data 단계 ID 및 답변 데이터
   * @returns 저장된 답변 데이터
   */
  saveStepAnswers: async (
    projectId: string,
    data: SaveWizardAnswersRequest
  ): Promise<WizardData> => {
    const response = await api.put<ApiResponse<WizardData>>(
      WIZARD_ENDPOINTS.STEP_ANSWERS(projectId, data.stepId),
      { answers: data.answers }
    );
    return response.data.data;
  },

  /**
   * 위저드 진행 상태 조회
   * @param projectId 프로젝트 ID
   * @returns 진행 상태 정보
   */
  getProgress: async (projectId: string): Promise<WizardProgressResponse> => {
    const response = await api.get<ApiResponse<WizardProgressResponse>>(
      WIZARD_ENDPOINTS.PROGRESS(projectId)
    );
    return response.data.data;
  },

  /**
   * 다음 단계로 이동
   * @param projectId 프로젝트 ID
   * @param currentStepId 현재 단계 ID
   * @returns 업데이트된 진행 상태
   */
  nextStep: async (
    projectId: string,
    currentStepId: number
  ): Promise<WizardProgressResponse> => {
    const response = await api.post<ApiResponse<WizardProgressResponse>>(
      `${WIZARD_ENDPOINTS.STEP_DETAIL(projectId, currentStepId)}/next`
    );
    return response.data.data;
  },

  /**
   * 이전 단계로 이동
   * @param projectId 프로젝트 ID
   * @param currentStepId 현재 단계 ID
   * @returns 업데이트된 진행 상태
   */
  prevStep: async (
    projectId: string,
    currentStepId: number
  ): Promise<WizardProgressResponse> => {
    const response = await api.post<ApiResponse<WizardProgressResponse>>(
      `${WIZARD_ENDPOINTS.STEP_DETAIL(projectId, currentStepId)}/prev`
    );
    return response.data.data;
  },
};

export default wizardService;

