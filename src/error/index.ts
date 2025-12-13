/**
 * 파일명: index.ts
 * 
 * 파일 용도:
 * 에러 처리 모듈 통합 barrel export
 * - 에러 핸들링 유틸리티
 * - 에러 타입 및 클래스
 * - 에러 컴포넌트 (ErrorBoundary, 에러 페이지)
 */

// ============================================
// API 에러 핸들러
// ============================================
export {
  handleApiError,
  getErrorMessage,
  isStatusError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError as isNotFoundStatusError,
  isServerError as isServerStatusError,
} from './apiErrorHandler';
export type { ApiErrorResponse, HandledError } from './apiErrorHandler';

// ============================================
// 에러 타입 및 클래스
// ============================================
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  ServerError,
  isAppError,
  isValidationError,
  isAuthenticationError,
  isAuthorizationError,
  isNotFoundError,
  isNetworkError,
  isServerError,
} from './errorTypes';

// ============================================
// 에러 메시지 상수
// ============================================
export {
  HTTP_ERROR_MESSAGES,
  NETWORK_ERROR_MESSAGES,
  AUTH_ERROR_MESSAGES,
  VALIDATION_ERROR_MESSAGES,
  FILE_ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE,
  getHttpErrorMessage,
} from './errorMessages';

// ============================================
// 에러 컴포넌트
// ============================================
export { GlobalErrorBoundary } from './GlobalErrorBoundary';
export { ServerErrorPage } from './ServerErrorPage';
export { NotFoundPage } from './NotFoundPage';
