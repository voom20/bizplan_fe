/**
 * 파일명: usePMFQueries.ts
 * 
 * 파일 용도:
 * PMF(Product-Market Fit) 진단 관련 React Query 훅
 * - PMF 설문 조회
 * - 설문 제출
 * - 리포트 조회
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pmfService } from '@/service';
import { QUERY_KEYS } from '@/service';
import type { SubmitPMFSurveyRequest } from '@/types';

/**
 * PMF 설문 질문 목록 조회 훅
 * - 질문은 모든 프로젝트에서 동일하므로 전역 캐싱
 */
export const usePMFQuestions = () => {
  return useQuery({
    queryKey: ['pmf', 'questions'],
    queryFn: pmfService.getQuestions,
    // 질문 목록은 자주 변경되지 않으므로 오래 캐싱
    staleTime: 60 * 60 * 1000, // 1시간
  });
};

/**
 * PMF 리포트 조회 훅
 * @param projectId 프로젝트 ID
 */
export const usePMFReport = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PMF.REPORT(projectId),
    queryFn: () => pmfService.getReport(projectId),
    enabled: !!projectId,
  });
};

/**
 * PMF 설문 제출 뮤테이션 훅
 * @param projectId 프로젝트 ID
 */
export const useSubmitPMFSurvey = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitPMFSurveyRequest) =>
      pmfService.submitSurvey(projectId, data),
    onSuccess: (result) => {
      // PMF 리포트 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.PMF.REPORT(projectId), result);
    },
  });
};

