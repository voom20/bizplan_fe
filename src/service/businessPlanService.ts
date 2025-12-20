/**
 * 파일명: businessPlanService.ts
 * 
 * 파일 용도:
 * 사업계획서 관련 API 서비스
 * - 사업계획서 생성/조회
 * - 버전 관리
 * - 문서 내보내기
 */

import api from '@/common/axios';
import type { DocumentVersion } from '@/types';
import type {
  ApiResponse,
  GenerateBusinessPlanRequest,
  BusinessPlanResponse,
  ExportDocumentRequest,
  ExportDocumentResponse,
} from '@/types';

/**
 * 사업계획서 API 엔드포인트
 */
const BUSINESS_PLAN_ENDPOINTS = {
  BASE: (projectId: string) => `/projects/${projectId}/business-plan`,
  GENERATE: (projectId: string) => `/projects/${projectId}/business-plan/generate`,
  VERSIONS: (projectId: string) => `/projects/${projectId}/business-plan/versions`,
  VERSION_DETAIL: (projectId: string, versionId: string) =>
    `/projects/${projectId}/business-plan/versions/${versionId}`,
  EXPORT: (projectId: string) => `/projects/${projectId}/business-plan/export`,
  REGENERATE_SECTION: (projectId: string, sectionId: string) =>
    `/projects/${projectId}/business-plan/sections/${sectionId}/regenerate`,
} as const;

/**
 * 사업계획서 API 서비스
 */
export const businessPlanService = {
  /**
   * 현재 사업계획서 조회
   * @param projectId 프로젝트 ID
   * @returns 사업계획서 정보
   */
  getBusinessPlan: async (projectId: string): Promise<BusinessPlanResponse> => {
    const response = await api.get<ApiResponse<BusinessPlanResponse>>(
      BUSINESS_PLAN_ENDPOINTS.BASE(projectId)
    );
    return response.data.data;
  },

  /**
   * 사업계획서 생성
   * @param data 생성 요청 정보
   * @returns 생성된 사업계획서
   */
  generateBusinessPlan: async (
    data: GenerateBusinessPlanRequest
  ): Promise<BusinessPlanResponse> => {
    const response = await api.post<ApiResponse<BusinessPlanResponse>>(
      BUSINESS_PLAN_ENDPOINTS.GENERATE(data.projectId),
      { sections: data.sections }
    );
    return response.data.data;
  },

  /**
   * 버전 목록 조회
   * @param projectId 프로젝트 ID
   * @returns 버전 목록
   */
  getVersions: async (projectId: string): Promise<DocumentVersion[]> => {
    const response = await api.get<ApiResponse<DocumentVersion[]>>(
      BUSINESS_PLAN_ENDPOINTS.VERSIONS(projectId)
    );
    return response.data.data;
  },

  /**
   * 특정 버전 상세 조회
   * @param projectId 프로젝트 ID
   * @param versionId 버전 ID
   * @returns 해당 버전의 사업계획서
   */
  getVersionDetail: async (
    projectId: string,
    versionId: string
  ): Promise<BusinessPlanResponse> => {
    const response = await api.get<ApiResponse<BusinessPlanResponse>>(
      BUSINESS_PLAN_ENDPOINTS.VERSION_DETAIL(projectId, versionId)
    );
    return response.data.data;
  },

  /**
   * 특정 섹션 재생성
   * @param projectId 프로젝트 ID
   * @param sectionId 섹션 ID
   * @returns 재생성된 사업계획서
   */
  regenerateSection: async (
    projectId: string,
    sectionId: string
  ): Promise<BusinessPlanResponse> => {
    const response = await api.post<ApiResponse<BusinessPlanResponse>>(
      BUSINESS_PLAN_ENDPOINTS.REGENERATE_SECTION(projectId, sectionId)
    );
    return response.data.data;
  },

  /**
   * 문서 내보내기
   * @param projectId 프로젝트 ID
   * @param options 내보내기 옵션
   * @returns 다운로드 URL 및 만료 시간
   */
  exportDocument: async (
    projectId: string,
    options: ExportDocumentRequest
  ): Promise<ExportDocumentResponse> => {
    const response = await api.post<ApiResponse<ExportDocumentResponse>>(
      BUSINESS_PLAN_ENDPOINTS.EXPORT(projectId),
      options
    );
    return response.data.data;
  },
};

export default businessPlanService;

