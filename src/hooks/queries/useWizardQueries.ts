/**
 * 파일명: useWizardQueries.ts
 * 
 * 파일 용도:
 * 위저드 관련 React Query 훅
 * - 위저드 단계 조회
 * - 답변 저장/조회
 * - 진행 상태 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wizardService } from '@/service';
import { QUERY_KEYS } from '@/service';
import type { SaveWizardAnswersRequest } from '@/types';

/**
 * 위저드 단계 목록 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useWizardSteps = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.WIZARD.STEPS(projectId),
    queryFn: () => wizardService.getSteps(projectId),
    enabled: !!projectId,
  });
};

/**
 * 위저드 특정 단계 상세 조회 훅
 * @param projectId 프로젝트 ID
 * @param stepId 단계 ID
 */
export const useWizardStepDetail = (projectId: string, stepId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.WIZARD.STEP_DETAIL(projectId, stepId),
    queryFn: () => wizardService.getStepDetail(projectId, stepId),
    enabled: !!projectId && stepId > 0,
  });
};

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
      // 단계 목록도 새로고침 (상태가 변경될 수 있음)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WIZARD.STEPS(projectId),
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
    queryKey: [...QUERY_KEYS.WIZARD.STEPS(projectId), 'progress'],
    queryFn: () => wizardService.getProgress(projectId),
    enabled: !!projectId,
  });
};

/**
 * 다음 단계 이동 뮤테이션 훅
 * @param projectId 프로젝트 ID
 */
export const useNextWizardStep = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currentStepId: number) =>
      wizardService.nextStep(projectId, currentStepId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WIZARD.STEPS(projectId),
      });
    },
  });
};

/**
 * 이전 단계 이동 뮤테이션 훅
 * @param projectId 프로젝트 ID
 */
export const usePrevWizardStep = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currentStepId: number) =>
      wizardService.prevStep(projectId, currentStepId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WIZARD.STEPS(projectId),
      });
    },
  });
};

