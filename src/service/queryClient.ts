/**
 * 파일명: queryClient.ts
 * 
 * 파일 용도:
 * TanStack Query (React Query) 클라이언트 설정
 * - 전역 QueryClient 인스턴스 생성
 * - 기본 설정 (staleTime, gcTime, retry 등)
 * - 에러 핸들링 설정
 * 
 * 사용법:
 * import { queryClient } from '@/service/queryClient';
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient 기본 설정
 * 
 * 설정 값 설명:
 * - staleTime: 데이터가 "신선"하다고 간주되는 시간 (5분)
 * - gcTime: 사용하지 않는 데이터가 캐시에서 제거되기까지의 시간 (30분)
 * - retry: 실패 시 재시도 횟수 (1회)
 * - refetchOnWindowFocus: 윈도우 포커스 시 자동 재요청 (활성화)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 신선하다고 간주되는 시간 (5분)
      staleTime: 5 * 60 * 1000,
      // 가비지 컬렉션 시간 (30분) - 이전의 cacheTime
      gcTime: 30 * 60 * 1000,
      // 실패 시 재시도 횟수
      retry: 1,
      // 윈도우 포커스 시 자동 재요청
      refetchOnWindowFocus: true,
      // 네트워크 재연결 시 자동 재요청
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 실패 시 재시도 안함
      retry: 0,
    },
  },
});

/**
 * 쿼리 키 상수
 * 캐시 무효화 및 데이터 관리에 사용
 */
export const QUERY_KEYS = {
  // 인증 관련
  AUTH: {
    USER: ['auth', 'user'] as const,
    SESSION: ['auth', 'session'] as const,
  },
  
  // 프로젝트 관련
  PROJECTS: {
    ALL: ['projects'] as const,
    DETAIL: (id: string) => ['projects', id] as const,
    LIST: (filters?: Record<string, unknown>) => ['projects', 'list', filters] as const,
  },
  
  // 위저드 관련
  WIZARD: {
    STEPS: (projectId: string) => ['wizard', 'steps', projectId] as const,
    STEP_DETAIL: (projectId: string, stepId: number) => ['wizard', 'step', projectId, stepId] as const,
    ANSWERS: (projectId: string) => ['wizard', 'answers', projectId] as const,
  },
  
  // 재무 관련
  FINANCIAL: {
    SIMULATION: (projectId: string) => ['financial', 'simulation', projectId] as const,
    METRICS: (projectId: string) => ['financial', 'metrics', projectId] as const,
  },
  
  // PMF 관련
  PMF: {
    SURVEY: (projectId: string) => ['pmf', 'survey', projectId] as const,
    REPORT: (projectId: string) => ['pmf', 'report', projectId] as const,
  },
  
  // 사업계획서 관련
  BUSINESS_PLAN: {
    DETAIL: (projectId: string) => ['businessPlan', projectId] as const,
    VERSIONS: (projectId: string) => ['businessPlan', 'versions', projectId] as const,
    VERSION_DETAIL: (projectId: string, versionId: string) => ['businessPlan', 'version', projectId, versionId] as const,
  },
} as const;

export default queryClient;

