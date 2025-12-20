/**
 * 파일명: useFinancialQueries.ts
 * 
 * 파일 용도:
 * 재무 시뮬레이션 관련 React Query 훅
 * - 재무 시뮬레이션 실행
 * - 재무 지표 조회/저장
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialService } from '@/service';
import { QUERY_KEYS } from '@/service';
import type { FinancialSimulationRequest } from '@/types';

/**
 * 재무 지표 조회 훅
 * @param projectId 프로젝트 ID
 */
export const useFinancialMetrics = (projectId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCIAL.METRICS(projectId),
    queryFn: () => financialService.getMetrics(projectId),
    enabled: !!projectId,
  });
};

/**
 * 재무 시뮬레이션 실행 뮤테이션 훅
 * - 시뮬레이션만 실행하고 저장하지 않음
 * @param projectId 프로젝트 ID
 */
export const useRunFinancialSimulation = (projectId: string) => {
  return useMutation({
    mutationFn: (data: FinancialSimulationRequest) =>
      financialService.runSimulation(projectId, data),
  });
};

/**
 * 재무 데이터 저장 뮤테이션 훅
 * @param projectId 프로젝트 ID
 */
export const useSaveFinancialData = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FinancialSimulationRequest) =>
      financialService.saveFinancialData(projectId, data),
    onSuccess: (result) => {
      // 재무 지표 캐시 업데이트
      queryClient.setQueryData(
        QUERY_KEYS.FINANCIAL.METRICS(projectId),
        result
      );
    },
  });
};

