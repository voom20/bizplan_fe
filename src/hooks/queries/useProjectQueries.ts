/**
 * 파일명: useProjectQueries.ts
 * 
 * 파일 용도:
 * 프로젝트 관련 React Query 훅
 * - 프로젝트 목록 조회
 * - 프로젝트 CRUD
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { projectService } from '@/service';
import { QUERY_KEYS } from '@/service';
import type {
  PaginationParams,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@/types';

/**
 * 프로젝트 목록 조회 훅
 * @param params 페이지네이션 및 필터 파라미터
 */
export const useProjects = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.LIST(params as Record<string, unknown> | undefined),
    queryFn: () => projectService.getProjects(params),
  });
};

/**
 * 프로젝트 상세 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
    queryFn: () => projectService.getProject(projectId),
    enabled: !!projectId,
  });
};

/**
 * 프로젝트 생성 뮤테이션 훅
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.createProject(data),
    onSuccess: (newProject) => {
      // 프로젝트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
      // 새 프로젝트 상세 캐시에 추가
      queryClient.setQueryData(
        QUERY_KEYS.PROJECTS.DETAIL(newProject.id),
        newProject
      );
      // 위저드 첫 단계로 이동
      navigate(`/projects/${newProject.id}/wizard/1`);
    },
  });
};

/**
 * 프로젝트 수정 뮤테이션 훅
 * @param projectId 프로젝트 ID
 */
export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) =>
      projectService.updateProject(projectId, data),
    onSuccess: (updatedProject) => {
      // 프로젝트 상세 캐시 업데이트
      queryClient.setQueryData(
        QUERY_KEYS.PROJECTS.DETAIL(projectId),
        updatedProject
      );
      // 프로젝트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
    },
  });
};

/**
 * 프로젝트 삭제 뮤테이션 훅
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: (_, projectId) => {
      // 프로젝트 상세 캐시 제거
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
      });
      // 프로젝트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
      // 프로젝트 목록으로 이동
      navigate('/projects');
    },
  });
};

