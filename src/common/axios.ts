/**
 * 파일명: axios.ts
 * 
 * 파일 용도:
 * Axios 인스턴스 및 Interceptor 설정
 * - API 기본 설정 (baseURL, timeout 등)
 * - 요청 시 JWT 토큰 자동 첨부
 * - 응답 에러 처리 (401 시 토큰 갱신 시도)
 * 
 * 사용법:
 * import api from '@/lib/axios';
 * const response = await api.get('/users/me');
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API 기본 URL (환경변수에서 가져오거나 기본값 사용)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// 토큰 갱신 중인지 여부
let isRefreshing = false;

// 토큰 갱신 대기 중인 요청들
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * 대기 중인 요청들 처리
 */
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Axios 인스턴스 생성
 */
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30초
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 Interceptor
 * - Authorization 헤더에 JWT 토큰 자동 첨부
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 Interceptor
 * - 401 에러 시 토큰 갱신 시도
 * - 갱신 성공 시 원래 요청 재시도
 * - 갱신 실패 시 로그아웃 처리
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고 재시도가 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      // Refresh Token이 없으면 로그아웃
      if (!refreshToken) {
        isRefreshing = false;
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // 토큰 갱신 요청
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // 새 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // 대기 중인 요청들 처리
        processQueue(null, accessToken);

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃
        processQueue(refreshError as AxiosError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 로그아웃 처리
 * - 토큰 삭제
 * - 로그인 페이지로 리다이렉트
 */
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // 현재 페이지가 로그인 페이지가 아니면 리다이렉트
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export default api;

/**
 * 토큰 저장 헬퍼
 */
export const setTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

/**
 * 토큰 삭제 헬퍼
 */
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * 토큰 존재 여부 확인
 */
export const hasToken = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

