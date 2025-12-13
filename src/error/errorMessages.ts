/**
 * 파일명: errorMessages.ts
 * 
 * 파일 용도:
 * 공통 에러 메시지 상수 정의
 * - HTTP 상태 코드별 메시지
 * - 도메인별 에러 메시지
 */

/** HTTP 상태 코드별 기본 메시지 */
export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: '입력 정보를 확인해주세요.',
  401: '로그인이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 정보를 찾을 수 없습니다.',
  409: '이미 존재하는 정보입니다.',
  422: '입력 형식이 올바르지 않습니다.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버에 문제가 발생했습니다.',
  502: '서버 연결에 실패했습니다.',
  503: '서비스를 일시적으로 사용할 수 없습니다.',
  504: '서버 응답 시간이 초과되었습니다.',
};

/** 네트워크 에러 메시지 */
export const NETWORK_ERROR_MESSAGES = {
  OFFLINE: '네트워크 연결을 확인해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  UNKNOWN: '알 수 없는 네트워크 오류가 발생했습니다.',
} as const;

/** 인증 에러 메시지 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
  TOKEN_INVALID: '인증 토큰이 유효하지 않습니다.',
  ACCOUNT_LOCKED: '계정이 잠겼습니다. 관리자에게 문의해주세요.',
  EMAIL_EXISTS: '이미 사용 중인 이메일입니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
} as const;

/** 폼 유효성 에러 메시지 */
export const VALIDATION_ERROR_MESSAGES = {
  REQUIRED: '필수 입력 항목입니다.',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  PASSWORD_TOO_SHORT: '비밀번호는 8자 이상이어야 합니다.',
  PASSWORD_WEAK: '비밀번호에 숫자와 특수문자를 포함해주세요.',
  INVALID_FORMAT: '올바른 형식이 아닙니다.',
} as const;

/** 파일 에러 메시지 */
export const FILE_ERROR_MESSAGES = {
  TOO_LARGE: '파일 크기가 너무 큽니다.',
  INVALID_TYPE: '지원하지 않는 파일 형식입니다.',
  UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
  DOWNLOAD_FAILED: '파일 다운로드에 실패했습니다.',
} as const;

/** 기본 에러 메시지 */
export const DEFAULT_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다.';

/**
 * HTTP 상태 코드에 해당하는 메시지 반환
 * @param status HTTP 상태 코드
 * @returns 에러 메시지
 */
export const getHttpErrorMessage = (status: number): string => {
  return HTTP_ERROR_MESSAGES[status] || DEFAULT_ERROR_MESSAGE;
};

