/**
 * 파일명: authService.ts
 * 
 * 파일 용도:
 * 인증 관련 API 서비스
 * - 로그인, 회원가입, 로그아웃
 * - 토큰 갱신
 * - 사용자 정보 조회/수정
 * - 비밀번호 변경
 * 
 * 백엔드 API 엔드포인트:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/signup
 * - POST /api/v1/auth/logout
 * - POST /api/v1/auth/refresh
 * - GET/PATCH/DELETE /api/v1/users/me
 * - PUT /api/v1/users/me/password
 */

import api, { setTokens, clearTokens } from '@/common/axios';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserInfo,
} from '@/types';

/**
 * 인증 API 엔드포인트 (백엔드 스펙에 맞춤)
 */
const AUTH_ENDPOINTS = {
  // Auth 관련
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/signup',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  // Users 관련
  ME: '/api/v1/users/me',
  CHANGE_PASSWORD: '/api/v1/users/me/password',
} as const;

/**
 * 인증 API 서비스
 */
export const authService = {
  /**
   * 로그인
   * @param credentials 로그인 정보 (이메일, 비밀번호)
   * @returns 로그인 응답 (토큰, 사용자 정보)
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    
    const { accessToken, refreshToken } = response.data;
    
    // 토큰 저장
    setTokens(accessToken, refreshToken);
    
    return response.data;
  },

  /**
   * 회원가입
   * @param userData 회원가입 정보
   * @returns 생성된 사용자 정보
   */
  signup: async (userData: SignupRequest): Promise<UserInfo> => {
    const response = await api.post<UserInfo>(
      AUTH_ENDPOINTS.SIGNUP,
      userData
    );
    return response.data;
  },

  /**
   * 로그아웃
   * - 서버에 로그아웃 요청 후 로컬 토큰 삭제
   */
  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      // 서버 요청 실패해도 로컬 토큰은 삭제
      clearTokens();
    }
  },

  /**
   * 토큰 갱신
   * @param refreshToken 리프레시 토큰
   * @returns 새로운 토큰
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      AUTH_ENDPOINTS.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  /**
   * 현재 사용자 정보 조회
   * @returns 사용자 정보
   */
  getMe: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>(AUTH_ENDPOINTS.ME);
    return response.data;
  },

  /**
   * 프로필 수정
   * @param data 수정할 프로필 정보
   * @returns 수정된 사용자 정보
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserInfo> => {
    const response = await api.patch<UserInfo>(
      AUTH_ENDPOINTS.ME,
      data
    );
    return response.data;
  },

  /**
   * 비밀번호 변경
   * @param data 현재 비밀번호 및 새 비밀번호
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      ...data,
      newPasswordConfirm: data.newPassword, // 백엔드 요구사항
    });
  },

  /**
   * 계정 삭제
   * @param password 비밀번호 확인
   */
  deleteAccount: async (password: string): Promise<void> => {
    await api.delete(AUTH_ENDPOINTS.ME, {
      data: { password },
    });
    clearTokens();
  },
};

export default authService;
