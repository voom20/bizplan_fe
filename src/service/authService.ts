/**
 * 파일명: authService.ts
 * 
 * 파일 용도:
 * 인증 관련 API 서비스
 * - 로그인, 회원가입, 로그아웃
 * - 토큰 갱신
 * - 사용자 정보 조회/수정
 * - 비밀번호 변경
 */

import api, { setTokens, clearTokens } from '@/common/axios';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserInfo,
} from '@/types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/password',
  DELETE_ACCOUNT: '/auth/account',
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
    const response = await api.post<ApiResponse<LoginResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    
    const { accessToken, refreshToken } = response.data.data;
    
    // 토큰 저장
    setTokens(accessToken, refreshToken);
    
    return response.data.data;
  },

  /**
   * 회원가입
   * @param userData 회원가입 정보
   * @returns 생성된 사용자 정보
   */
  signup: async (userData: SignupRequest): Promise<UserInfo> => {
    const response = await api.post<ApiResponse<UserInfo>>(
      AUTH_ENDPOINTS.SIGNUP,
      userData
    );
    return response.data.data;
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
   * 현재 사용자 정보 조회
   * @returns 사용자 정보
   */
  getMe: async (): Promise<UserInfo> => {
    const response = await api.get<ApiResponse<UserInfo>>(AUTH_ENDPOINTS.ME);
    return response.data.data;
  },

  /**
   * 프로필 수정
   * @param data 수정할 프로필 정보
   * @returns 수정된 사용자 정보
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserInfo> => {
    const response = await api.patch<ApiResponse<UserInfo>>(
      AUTH_ENDPOINTS.ME,
      data
    );
    return response.data.data;
  },

  /**
   * 비밀번호 변경
   * @param data 현재 비밀번호 및 새 비밀번호
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  /**
   * 계정 삭제
   * @param password 비밀번호 확인
   */
  deleteAccount: async (password: string): Promise<void> => {
    await api.delete(AUTH_ENDPOINTS.DELETE_ACCOUNT, {
      data: { password },
    });
    clearTokens();
  },
};

export default authService;

