/**
 * 파일명: index.ts
 * 
 * 파일 용도:
 * React Query 훅 모듈의 배럴 파일 (barrel file)
 * - 모든 쿼리/뮤테이션 훅 일괄 내보내기
 */

// 인증 관련 훅
export {
  useCurrentUser,
  useLogin,
  useSignup,
  useLogout,
  useUpdateProfile,
  useChangePassword,
  useDeleteAccount,
} from './useAuthQueries';

// 프로젝트 관련 훅
export {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from './useProjectQueries';

// 위저드 관련 훅
export {
  useWizardAnswers,
  useWizardAnswersWithProgress,
  useWizardStepAnswers,
  useSaveWizardAnswers,
  useWizardProgress,
} from './useWizardQueries';

// 재무 관련 훅
export {
  useFinancialMetrics,
  useRunFinancialSimulation,
  useSaveFinancialData,
} from './useFinancialQueries';

// 사업계획서 관련 훅
export {
  useBusinessPlan,
  useGenerateBusinessPlan,
  useBusinessPlanVersions,
  useBusinessPlanVersion,
  useRegenerateSection,
  useExportDocumentApi,
} from './useBusinessPlanQueries';

// PMF 관련 훅
export {
  usePMFQuestions,
  usePMFReport,
  useSubmitPMFSurvey,
} from './usePMFQueries';

