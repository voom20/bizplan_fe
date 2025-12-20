/**
 * 파일명: useBusinessPlanQueries.ts
 * 
 * 파일 용도:
 * 사업계획서 관련 React Query 훅
 * - 사업계획서 조회/생성
 * - 버전 관리
 * - 문서 내보내기
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessPlanService } from '@/service';
import { QUERY_KEYS } from '@/service';
import type {
  GenerateBusinessPlanRequest,
  ExportDocumentRequest,
} from '@/types';

/**
 * 사업계획서 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useBusinessPlan = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.BUSINESS_PLAN.DETAIL(projectId),
    queryFn: () => businessPlanService.getBusinessPlan(projectId),
    enabled: !!projectId,
  });
};

/**
 * 사업계획서 생성 뮤테이션 훅
 */
export const useGenerateBusinessPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateBusinessPlanRequest) =>
      businessPlanService.generateBusinessPlan(data),
    onSuccess: (result, variables) => {
      // 사업계획서 캐시 업데이트
      queryClient.setQueryData(
        QUERY_KEYS.BUSINESS_PLAN.DETAIL(variables.projectId),
        result
      );
      // 버전 목록 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BUSINESS_PLAN.VERSIONS(variables.projectId),
      });
    },
  });
};

/**
 * 사업계획서 버전 목록 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useBusinessPlanVersions = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.BUSINESS_PLAN.VERSIONS(projectId),
    queryFn: () => businessPlanService.getVersions(projectId),
    enabled: !!projectId,
  });
};

/**
 * 사업계획서 특정 버전 조회 훅
 * @param projectId 프로젝트 ID
 * @param versionId 버전 ID
 */
export const useBusinessPlanVersion = (projectId: string, versionId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.BUSINESS_PLAN.VERSION_DETAIL(projectId, versionId),
    queryFn: () => businessPlanService.getVersionDetail(projectId, versionId),
    enabled: !!projectId && !!versionId,
  });
};

/**
 * 섹션 재생성 뮤테이션 훅
 * @param projectId 프로젝트 ID
 */
export const useRegenerateSection = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) =>
      businessPlanService.regenerateSection(projectId, sectionId),
    onSuccess: (result) => {
      // 사업계획서 캐시 업데이트
      queryClient.setQueryData(
        QUERY_KEYS.BUSINESS_PLAN.DETAIL(projectId),
        result
      );
      // 버전 목록 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BUSINESS_PLAN.VERSIONS(projectId),
      });
    },
  });
};

/**
 * 문서 내보내기 API 뮤테이션 훅
 * - 백엔드 API를 통한 문서 내보내기
 * @param projectId 프로젝트 ID
 */
export const useExportDocumentApi = (projectId: string) => {
  return useMutation({
    mutationFn: (options: ExportDocumentRequest) =>
      businessPlanService.exportDocument(projectId, options),
    onSuccess: (blob, variables) => {
      // Blob을 다운로드 URL로 변환하여 다운로드
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business-plan.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
};

