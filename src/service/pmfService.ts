/**
 * 파일명: pmfService.ts
 * 
 * 파일 용도:
 * PMF(Product-Market Fit) 진단 관련 API 서비스
 * 
 * ⚠️ 주의: 현재 백엔드 API에서 PMF 관련 엔드포인트가 미지원됩니다.
 * 추후 백엔드 API 추가 시 구현 예정입니다.
 * 현재는 로컬 Mock 데이터를 반환합니다.
 */

import type { PMFQuestion } from '@/types';
import type {
  SubmitPMFSurveyRequest,
  PMFReportResponse,
} from '@/types';

/**
 * Mock PMF 질문 데이터
 */
const MOCK_PMF_QUESTIONS: PMFQuestion[] = [
  {
    id: 'pmf-1',
    question: '만약 이 제품을 더 이상 사용할 수 없게 된다면 어떻게 느끼시겠습니까?',
    options: [
      { value: 1, label: '매우 실망할 것이다' },
      { value: 2, label: '다소 실망할 것이다' },
      { value: 3, label: '실망하지 않을 것이다 (별로 유용하지 않음)' },
      { value: 4, label: '해당 없음 - 더 이상 사용하지 않음' },
    ],
  },
  {
    id: 'pmf-2',
    question: '이 제품의 주요 혜택은 무엇이라고 생각하시나요?',
    options: [
      { value: 1, label: '시간 절약' },
      { value: 2, label: '비용 절감' },
      { value: 3, label: '품질 향상' },
      { value: 4, label: '기타' },
    ],
  },
  {
    id: 'pmf-3',
    question: '이 제품을 다른 사람에게 추천하시겠습니까?',
    options: [
      { value: 1, label: '적극 추천' },
      { value: 2, label: '추천' },
      { value: 3, label: '보통' },
      { value: 4, label: '비추천' },
    ],
  },
];

/**
 * PMF 점수 계산 및 리포트 생성
 */
const calculatePMFReport = (answers: SubmitPMFSurveyRequest['answers']): PMFReportResponse => {
  // 첫 번째 질문(Sean Ellis 테스트)에서 "매우 실망" 비율 계산
  const veryDisappointedCount = answers.filter(a => a.questionId === 'pmf-1' && a.value === 1).length;
  const score = veryDisappointedCount > 0 ? 40 : 20; // 40% 이상이면 PMF 달성으로 판단
  
  let level: 'low' | 'medium' | 'high' | 'excellent';
  if (score >= 40) level = 'excellent';
  else if (score >= 30) level = 'high';
  else if (score >= 20) level = 'medium';
  else level = 'low';

  return {
    score,
    level,
    risks: [
      {
        id: 'risk-1',
        title: '시장 검증 필요',
        description: '더 많은 고객 피드백이 필요합니다.',
        severity: level === 'low' ? 'high' : 'medium',
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: '고객 인터뷰 진행',
        description: '핵심 고객층과 심층 인터뷰를 진행하여 니즈를 파악하세요.',
        priority: 'high',
      },
    ],
  };
};

/**
 * PMF API 서비스 (Mock 구현)
 */
export const pmfService = {
  /**
   * PMF 설문 질문 목록 조회
   * @returns PMF 질문 목록 (Mock)
   */
  getQuestions: async (): Promise<PMFQuestion[]> => {
    // Mock: 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PMF_QUESTIONS;
  },

  /**
   * PMF 설문 결과 제출
   * @param projectId 프로젝트 ID
   * @param data 설문 답변
   * @returns PMF 리포트 (Mock)
   */
  submitSurvey: async (
    projectId: string,
    data: SubmitPMFSurveyRequest
  ): Promise<PMFReportResponse> => {
    console.log(`Submitting PMF survey for project ${projectId}`);
    // Mock: 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    return calculatePMFReport(data.answers);
  },

  /**
   * PMF 리포트 조회
   * @param projectId 프로젝트 ID
   * @returns PMF 리포트 (Mock)
   */
  getReport: async (projectId: string): Promise<PMFReportResponse | null> => {
    console.log(`Getting PMF report for project ${projectId}`);
    // Mock: 저장된 리포트가 없는 경우 null 반환
    await new Promise(resolve => setTimeout(resolve, 300));
    return null;
  },
};

export default pmfService;
