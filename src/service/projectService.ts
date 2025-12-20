/**
 * 파일명: projectService.ts
 * 
 * 파일 용도:
 * 프로젝트 관련 API 서비스
 * - 프로젝트 CRUD
 * - 프로젝트 목록 조회
 * - 템플릿 조회
 * 
 * 백엔드 API 엔드포인트:
 * - GET /projects
 * - POST /projects
 * - GET /projects/{projectId}
 * - GET /projects/templates
 */

import api from '@/common/axios';
import type {
  PaginatedResponse,
  PaginationParams,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectDetailResponse,
} from '@/types';

/**
 * 템플릿 응답 타입
 */
interface Template {
  code: string;
  name: string;
  description: string;
  category: string;
}

interface TemplateListResponse {
  templates: Template[];
}

/**
 * 프로젝트 API 엔드포인트 (백엔드 스펙에 맞춤)
 */
const PROJECT_ENDPOINTS = {
  BASE: '/projects',
  DETAIL: (id: string) => `/projects/${id}`,
  TEMPLATES: '/projects/templates',
} as const;

/**
 * 프로젝트 API 서비스
 */
export const projectService = {
  /**
   * 템플릿 목록 조회
   * @param category 템플릿 카테고리 필터 (government, bank, investor)
   * @returns 템플릿 목록
   */
  getTemplates: async (category?: string): Promise<TemplateListResponse> => {
    const response = await api.get<TemplateListResponse>(
      PROJECT_ENDPOINTS.TEMPLATES,
      { params: category ? { category } : undefined }
    );
    return response.data;
  },

  /**
   * 프로젝트 목록 조회
   * @param params 페이지네이션 및 필터 파라미터
   * @returns 프로젝트 목록
   */
  getProjects: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<ProjectDetailResponse>> => {
    const response = await api.get<ProjectDetailResponse[]>(
      PROJECT_ENDPOINTS.BASE,
      { params }
    );
    // 백엔드가 배열을 반환하므로 PaginatedResponse 형식으로 변환
    return {
      success: true,
      data: response.data,
      meta: {
        page: 1,
        limit: response.data.length,
        total: response.data.length,
        totalPages: 1,
      },
    };
  },

  /**
   * 프로젝트 상세 조회
   * @param id 프로젝트 ID
   * @returns 프로젝트 상세 정보
   */
  getProject: async (id: string): Promise<ProjectDetailResponse> => {
    const response = await api.get<ProjectDetailResponse>(
      PROJECT_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * 프로젝트 생성
   * @param data 프로젝트 생성 정보
   * @returns 생성된 프로젝트 정보
   */
  createProject: async (
    data: CreateProjectRequest
  ): Promise<ProjectDetailResponse> => {
    // 백엔드 요청 형식에 맞게 변환
    const requestBody = {
      templateCode: data.templateId,
      title: data.name,
    };
    const response = await api.post<ProjectDetailResponse>(
      PROJECT_ENDPOINTS.BASE,
      requestBody
    );
    return response.data;
  },

  /**
   * 프로젝트 수정
   * @param id 프로젝트 ID
   * @param data 수정할 정보
   * @returns 수정된 프로젝트 정보
   */
  updateProject: async (
    id: string,
    data: UpdateProjectRequest
  ): Promise<ProjectDetailResponse> => {
    const response = await api.patch<ProjectDetailResponse>(
      PROJECT_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data;
  },

  /**
   * 프로젝트 삭제
   * @param id 프로젝트 ID
   */
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(PROJECT_ENDPOINTS.DETAIL(id));
  },
};

export default projectService;
