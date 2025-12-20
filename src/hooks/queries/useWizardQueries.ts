/**
 * 파일명: useWizardQueries.ts
 * 
 * 파일 용도:
 * 위저드 관련 React Query 훅
 * - 답변 저장/조회
 * - 진행 상태 관리
 * 
 * 백엔드 API:
 * - GET /projects/{projectId}/wizard/answers
 * - GET /projects/{projectId}/wizard/steps/{stepId}
 * - POST /projects/{projectId}/wizard/steps
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wizardService } from '@/service';
import { QUERY_KEYS } from '@/service';
import type { SaveWizardAnswersRequest } from '@/types';

/**
 * 위저드 전체 답변 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useWizardAnswers = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.WIZARD.ANSWERS(projectId),
    queryFn: () => wizardService.getAnswers(projectId),
    enabled: !!projectId,
  });
};

/**
 * 위저드 전체 답변 및 진행 상태 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useWizardAnswersWithProgress = (projectId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.WIZARD.ANSWERS(projectId), 'withProgress'],
    queryFn: () => wizardService.getAnswersWithProgress(projectId),
    enabled: !!projectId,
  });
};

/**
 * 위저드 특정 단계 답변 조회 훅
 * @param projectId 프로젝트 ID
 * @param stepId 단계 ID
 */
export const useWizardStepAnswers = (projectId: string, stepId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.WIZARD.STEP_DETAIL(projectId, parseInt(stepId)),
    queryFn: () => wizardService.getStepAnswers(projectId, stepId),
    enabled: !!projectId && !!stepId,
  });
};

/**
 * 위저드 답변 저장 뮤테이션 훅
 * @param projectId 프로젝트 ID
 */
export const useSaveWizardAnswers = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveWizardAnswersRequest) =>
      wizardService.saveStepAnswers(projectId, data),
    onSuccess: () => {
      // 답변 캐시 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WIZARD.ANSWERS(projectId),
      });
    },
  });
};

/**
 * 위저드 진행 상태 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useWizardProgress = (projectId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.WIZARD.ANSWERS(projectId), 'progress'],
    queryFn: () => wizardService.getProgress(projectId),
    enabled: !!projectId,
  });
};
