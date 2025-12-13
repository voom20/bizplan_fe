/**
 * 파일명: index.ts
 * 
 * 파일 용도:
 * 에러 처리 모듈 barrel export
 */

// API 에러 핸들러
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

// 에러 타입
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

// 에러 메시지
export {
  HTTP_ERROR_MESSAGES,
  NETWORK_ERROR_MESSAGES,
  AUTH_ERROR_MESSAGES,
  VALIDATION_ERROR_MESSAGES,
  FILE_ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE,
  getHttpErrorMessage,
} from './errorMessages';

