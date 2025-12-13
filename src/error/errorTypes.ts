/**
 * 파일명: errorTypes.ts
 * 
 * 파일 용도:
 * 공통 에러 타입 정의
 * - 애플리케이션 전반에서 사용하는 에러 타입
 * - 타입 가드 함수
 */

/** 기본 앱 에러 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/** 유효성 검사 에러 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public details?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

/** 인증 에러 */
export class AuthenticationError extends AppError {
  constructor(message = '로그인이 필요합니다.') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/** 권한 에러 */
export class AuthorizationError extends AppError {
  constructor(message = '접근 권한이 없습니다.') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

/** 리소스 없음 에러 */
export class NotFoundError extends AppError {
  constructor(message = '요청한 정보를 찾을 수 없습니다.') {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
  }
}

/** 네트워크 에러 */
export class NetworkError extends AppError {
  constructor(message = '네트워크 연결을 확인해주세요.') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

/** 서버 에러 */
export class ServerError extends AppError {
  constructor(message = '서버에 문제가 발생했습니다.') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
  }
}

// ============================================
// 타입 가드 함수
// ============================================

/** AppError 인스턴스인지 확인 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/** ValidationError 인스턴스인지 확인 */
export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

/** AuthenticationError 인스턴스인지 확인 */
export const isAuthenticationError = (error: unknown): error is AuthenticationError => {
  return error instanceof AuthenticationError;
};

/** AuthorizationError 인스턴스인지 확인 */
export const isAuthorizationError = (error: unknown): error is AuthorizationError => {
  return error instanceof AuthorizationError;
};

/** NotFoundError 인스턴스인지 확인 */
export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError;
};

/** NetworkError 인스턴스인지 확인 */
export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

/** ServerError 인스턴스인지 확인 */
export const isServerError = (error: unknown): error is ServerError => {
  return error instanceof ServerError;
};

