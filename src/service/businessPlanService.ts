/**
 * 파일명: businessPlanService.ts
 * 
 * 파일 용도:
 * 사업계획서 관련 API 서비스
 * - 사업계획서 생성/조회
 * - 버전 관리
 * - 섹션 재생성
 * - 문서 내보내기
 * 
 * 백엔드 API 엔드포인트:
 * - POST /projects/{projectId}/documents/business-plan/generate
 * - GET /projects/{projectId}/documents/business-plan/latest
 * - GET /projects/{projectId}/documents/business-plan/versions
 * - GET /projects/{projectId}/documents/{documentId}
 * - POST /projects/{projectId}/documents/{documentId}/sections/{sectionType}/regenerate
 * - GET /projects/{projectId}/export
 * - GET /projects/{projectId}/export/versions/{version}
 */

import api from '@/common/axios';
import type { DocumentVersion } from '@/types';
import type {
  GenerateBusinessPlanRequest,
  BusinessPlanResponse,
  ExportDocumentRequest,
} from '@/types';

/**
 * 백엔드 문서 응답 타입
 */
interface BusinessPlanDocumentResponse {
  documentId: string;
  projectId: string;
  version: number;
  status: 'DRAFT' | 'COMPLETED' | 'GENERATING';
  sections: Array<{
    sectionType: string;
    title: string;
    content: string;
  }>;
  createdAt: string;
}

/**
 * 사업계획서 API 엔드포인트 (백엔드 스펙에 맞춤)
 */
const BUSINESS_PLAN_ENDPOINTS = {
  // 문서 생성
  GENERATE: (projectId: string) => `/projects/${projectId}/documents/business-plan/generate`,
  // 최신 문서 조회
  LATEST: (projectId: string) => `/projects/${projectId}/documents/business-plan/latest`,
  // 버전 목록
  VERSIONS: (projectId: string) => `/projects/${projectId}/documents/business-plan/versions`,
  // 특정 문서 조회
  DOCUMENT: (projectId: string, documentId: string) => 
    `/projects/${projectId}/documents/${documentId}`,
  // 섹션 재생성
  REGENERATE_SECTION: (projectId: string, documentId: string, sectionType: string) =>
    `/projects/${projectId}/documents/${documentId}/sections/${sectionType}/regenerate`,
  // 내보내기
  EXPORT: (projectId: string) => `/projects/${projectId}/export`,
  EXPORT_VERSION: (projectId: string, version: number) =>
    `/projects/${projectId}/export/versions/${version}`,
  EXPORT_FORMATS: (projectId: string) => `/projects/${projectId}/export/formats`,
} as const;

/**
 * 백엔드 응답을 프론트엔드 형식으로 변환
 */
const convertToFrontendResponse = (data: BusinessPlanDocumentResponse): BusinessPlanResponse => ({
  id: data.documentId,
  projectId: data.projectId,
  version: data.version,
  status: data.status,
  sections: data.sections.map((section, index) => ({
    id: section.sectionType,
    title: section.title,
    content: section.content,
    order: index + 1,
  })),
  generatedAt: data.createdAt,
});

/**
 * 사업계획서 API 서비스
 */
export const businessPlanService = {
  /**
   * 사업계획서 전체 생성
   * @param data 생성 요청 정보
   * @returns 생성된 사업계획서
   */
  generateBusinessPlan: async (
    data: GenerateBusinessPlanRequest
  ): Promise<BusinessPlanResponse> => {
    const response = await api.post<BusinessPlanDocumentResponse>(
      BUSINESS_PLAN_ENDPOINTS.GENERATE(data.projectId)
    );
    return convertToFrontendResponse(response.data);
  },

  /**
   * 최신 사업계획서 조회
   * @param projectId 프로젝트 ID
   * @returns 사업계획서 정보
   */
  getBusinessPlan: async (projectId: string): Promise<BusinessPlanResponse> => {
    const response = await api.get<BusinessPlanDocumentResponse>(
      BUSINESS_PLAN_ENDPOINTS.LATEST(projectId)
    );
    return convertToFrontendResponse(response.data);
  },

  /**
   * 버전 목록 조회
   * @param projectId 프로젝트 ID
   * @returns 버전 목록
   */
  getVersions: async (projectId: string): Promise<DocumentVersion[]> => {
    const response = await api.get<BusinessPlanDocumentResponse[]>(
      BUSINESS_PLAN_ENDPOINTS.VERSIONS(projectId)
    );
    return response.data.map(doc => ({
      id: doc.documentId,
      version: doc.version,
      createdAt: doc.createdAt,
      status: doc.status,
      changedSections: doc.sections.length,
    }));
  },

  /**
   * 특정 문서 조회
   * @param projectId 프로젝트 ID
   * @param documentId 문서 ID
   * @returns 해당 문서의 사업계획서
   */
  getDocument: async (
    projectId: string,
    documentId: string
  ): Promise<BusinessPlanResponse> => {
    const response = await api.get<BusinessPlanDocumentResponse>(
      BUSINESS_PLAN_ENDPOINTS.DOCUMENT(projectId, documentId)
    );
    return convertToFrontendResponse(response.data);
  },

  /**
   * 특정 버전 상세 조회 (getDocument와 동일)
   * @param projectId 프로젝트 ID
   * @param versionId 버전 ID (문서 ID)
   * @returns 해당 버전의 사업계획서
   */
  getVersionDetail: async (
    projectId: string,
    versionId: string
  ): Promise<BusinessPlanResponse> => {
    return businessPlanService.getDocument(projectId, versionId);
  },

  /**
   * 특정 섹션 재생성
   * @param projectId 프로젝트 ID
   * @param documentId 문서 ID
   * @param sectionType 섹션 타입
   * @returns 재생성된 사업계획서
   */
  regenerateSection: async (
    projectId: string,
    sectionType: string,
    documentId?: string
  ): Promise<BusinessPlanResponse> => {
    // documentId가 없으면 최신 문서 조회
    let docId = documentId;
    if (!docId) {
      const latest = await businessPlanService.getBusinessPlan(projectId);
      docId = latest.id;
    }
    
    const response = await api.post<BusinessPlanDocumentResponse>(
      BUSINESS_PLAN_ENDPOINTS.REGENERATE_SECTION(projectId, docId, sectionType)
    );
    return convertToFrontendResponse(response.data);
  },

  /**
   * 문서 내보내기 URL 가져오기
   * @param projectId 프로젝트 ID
   * @param options 내보내기 옵션
   * @returns 다운로드 Blob
   */
  exportDocument: async (
    projectId: string,
    options: ExportDocumentRequest
  ): Promise<Blob> => {
    const endpoint = options.versionId
      ? BUSINESS_PLAN_ENDPOINTS.EXPORT_VERSION(projectId, parseInt(options.versionId))
      : BUSINESS_PLAN_ENDPOINTS.EXPORT(projectId);
    
    const response = await api.get(endpoint, {
      params: { format: options.format },
      responseType: 'blob',
    });
    
    return response.data;
  },

  /**
   * 지원 형식 목록 조회
   * @param projectId 프로젝트 ID
   * @returns 지원 형식 목록
   */
  getSupportedFormats: async (projectId: string): Promise<string[]> => {
    const response = await api.get<{ formats: string[] }>(
      BUSINESS_PLAN_ENDPOINTS.EXPORT_FORMATS(projectId)
    );
    return response.data.formats;
  },
};

export default businessPlanService;
