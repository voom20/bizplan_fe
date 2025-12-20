/**
 * 파일명: api.ts
 * 
 * 파일 용도:
 * API 요청/응답 관련 타입 정의
 * - 공통 API 응답 형식
 * - 페이지네이션 타입
 * - 에러 응답 타입
 */

// ============================================
// 공통 API 응답 타입
// ============================================

/** API 성공 응답 기본 형식 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** API 에러 응답 형식 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

/** 페이지네이션 메타 정보 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** 페이지네이션 응답 형식 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

/** 페이지네이션 요청 파라미터 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// 인증 관련 타입
// ============================================

/** 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

/** 회원가입 요청 */
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  company?: string;
}

/** 토큰 갱신 요청 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** 토큰 갱신 응답 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

/** 사용자 정보 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

/** 비밀번호 변경 요청 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** 프로필 수정 요청 */
export interface UpdateProfileRequest {
  name?: string;
  company?: string;
}

// ============================================
// 프로젝트 관련 타입
// ============================================

/** 프로젝트 생성 요청 */
export interface CreateProjectRequest {
  name: string;
  templateId: string;
  description?: string;
}

/** 프로젝트 수정 요청 */
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

/** 프로젝트 상세 응답 */
export interface ProjectDetailResponse {
  id: string;
  name: string;
  templateId: string;
  description?: string;
  currentStep: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 위저드 관련 타입
// ============================================

/** 위저드 답변 저장 요청 */
export interface SaveWizardAnswersRequest {
  stepId: number;
  answers: Record<string, unknown>;
}

/** 위저드 진행 상태 응답 */
export interface WizardProgressResponse {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  progress: number; // 0-100
}

// ============================================
// 재무 시뮬레이션 관련 타입
// ============================================

/** 재무 시뮬레이션 요청 */
export interface FinancialSimulationRequest {
  customers: number;
  pricePerCustomer: number;
  cac: number;
  fixedCosts: number;
  variableCostRate: number;
  churnRate: number;
}

/** 재무 시뮬레이션 응답 */
export interface FinancialSimulationResponse {
  revenue: number;
  totalCosts: number;
  profit: number;
  ltv: number;
  ltvCacRatio: number;
  breakEvenPoint: number;
  monthlyProjections: Array<{
    month: number;
    revenue: number;
    costs: number;
    profit: number;
  }>;
}

// ============================================
// PMF 관련 타입
// ============================================

/** PMF 설문 제출 요청 */
export interface SubmitPMFSurveyRequest {
  answers: Array<{
    questionId: string;
    value: number;
  }>;
}

/** PMF 리포트 응답 */
export interface PMFReportResponse {
  score: number;
  level: 'low' | 'medium' | 'high' | 'excellent';
  risks: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

// ============================================
// 사업계획서 관련 타입
// ============================================

/** 사업계획서 생성 요청 */
export interface GenerateBusinessPlanRequest {
  projectId: string;
  sections?: string[]; // 특정 섹션만 재생성 시
}

/** 사업계획서 섹션 */
export interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

/** 사업계획서 응답 */
export interface BusinessPlanResponse {
  id: string;
  projectId: string;
  version: number;
  status: 'DRAFT' | 'COMPLETED' | 'GENERATING';
  sections: BusinessPlanSection[];
  generatedAt: string;
}

/** 문서 내보내기 요청 */
export interface ExportDocumentRequest {
  format: 'pdf' | 'html' | 'hwp';
  versionId?: string;
}

/** 문서 내보내기 응답 */
export interface ExportDocumentResponse {
  downloadUrl: string;
  expiresAt: string;
}

