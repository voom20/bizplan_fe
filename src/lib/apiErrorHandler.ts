/**
 * 파일명: apiErrorHandler.ts
 * 
 * 파일 용도:
 * API 에러 핸들링 유틸리티
 * - HTTP 상태 코드별 메시지 매핑
 * - 에러 타입 정의 및 처리 함수
 * 
 * 사용법:
 * try {
 *   await api.get('/endpoint');
 * } catch (error) {
 *   const { message, shouldRedirect } = handleApiError(error);
 *   toast.error(message);
 * }
 */

// API 에러 응답 타입
export interface ApiErrorResponse {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// 처리된 에러 결과 타입
export interface HandledError {
  message: string;
  status: number;
  shouldRedirect?: 'login' | 'home' | 'notfound' | 'error';
  originalError: unknown;
}

// HTTP 상태 코드별 기본 메시지
const ERROR_MESSAGES: Record<number, string> = {
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

/**
 * Axios 에러인지 확인
 */
const isAxiosError = (error: unknown): error is { response?: { status: number; data?: ApiErrorResponse } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

/**
 * 네트워크 에러인지 확인
 */
const isNetworkError = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'message' in error && 
    (error as { message: string }).message === 'Network Error';
};

/**
 * API 에러 처리 함수
 * 
 * @param error - 발생한 에러 객체
 * @returns 처리된 에러 정보
 */
export const handleApiError = (error: unknown): HandledError => {
  // 네트워크 에러
  if (isNetworkError(error)) {
    return {
      message: '네트워크 연결을 확인해주세요.',
      status: 0,
      originalError: error,
    };
  }

  // Axios 에러 (서버 응답 있음)
  if (isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    
    // 서버에서 제공한 메시지가 있으면 사용
    const serverMessage = data?.message;
    const defaultMessage = ERROR_MESSAGES[status] || '알 수 없는 오류가 발생했습니다.';
    
    // 리다이렉트가 필요한 경우
    let shouldRedirect: HandledError['shouldRedirect'];
    if (status === 401) {
      shouldRedirect = 'login';
    } else if (status === 404) {
      shouldRedirect = 'notfound';
    } else if (status >= 500) {
      shouldRedirect = 'error';
    }

    return {
      message: serverMessage || defaultMessage,
      status,
      shouldRedirect,
      originalError: error,
    };
  }

  // 일반 에러
  if (error instanceof Error) {
    return {
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      status: 0,
      originalError: error,
    };
  }

  // 알 수 없는 에러
  return {
    message: '알 수 없는 오류가 발생했습니다.',
    status: 0,
    originalError: error,
  };
};

/**
 * 에러 메시지 추출 헬퍼
 * 
 * @param error - 발생한 에러 객체
 * @returns 에러 메시지 문자열
 */
export const getErrorMessage = (error: unknown): string => {
  return handleApiError(error).message;
};

/**
 * 특정 상태 코드인지 확인
 * 
 * @param error - 발생한 에러 객체
 * @param status - 확인할 상태 코드
 * @returns 해당 상태 코드 여부
 */
export const isStatusError = (error: unknown, status: number): boolean => {
  if (isAxiosError(error) && error.response) {
    return error.response.status === status;
  }
  return false;
};

/**
 * 인증 에러인지 확인 (401)
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  return isStatusError(error, 401);
};

/**
 * 금지 에러인지 확인 (403)
 */
export const isForbiddenError = (error: unknown): boolean => {
  return isStatusError(error, 403);
};

/**
 * 찾을 수 없음 에러인지 확인 (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
  return isStatusError(error, 404);
};

/**
 * 서버 에러인지 확인 (5xx)
 */
export const isServerError = (error: unknown): boolean => {
  if (isAxiosError(error) && error.response) {
    return error.response.status >= 500;
  }
  return false;
};

export default handleApiError;

