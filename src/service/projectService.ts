/**
 * 파일명: projectService.ts
 * 
 * 파일 용도:
 * 프로젝트 관련 API 서비스
 * - 프로젝트 CRUD
 * - 프로젝트 목록 조회
 */

import api from '@/common/axios';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectDetailResponse,
} from '@/types';

const PROJECT_ENDPOINTS = {
  BASE: '/projects',
  DETAIL: (id: string) => `/projects/${id}`,
} as const;

/**
 * 프로젝트 API 서비스
 */
export const projectService = {
  /**
   * 프로젝트 목록 조회
   * @param params 페이지네이션 및 필터 파라미터
   * @returns 프로젝트 목록 (페이지네이션)
   */
  getProjects: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<ProjectDetailResponse>> => {
    const response = await api.get<PaginatedResponse<ProjectDetailResponse>>(
      PROJECT_ENDPOINTS.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * 프로젝트 상세 조회
   * @param id 프로젝트 ID
   * @returns 프로젝트 상세 정보
   */
  getProject: async (id: string): Promise<ProjectDetailResponse> => {
    const response = await api.get<ApiResponse<ProjectDetailResponse>>(
      PROJECT_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  /**
   * 프로젝트 생성
   * @param data 프로젝트 생성 정보
   * @returns 생성된 프로젝트 정보
   */
  createProject: async (
    data: CreateProjectRequest
  ): Promise<ProjectDetailResponse> => {
    const response = await api.post<ApiResponse<ProjectDetailResponse>>(
      PROJECT_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
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
    const response = await api.patch<ApiResponse<ProjectDetailResponse>>(
      PROJECT_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data.data;
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

