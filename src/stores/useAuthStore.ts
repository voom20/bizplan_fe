/**
 * 파일명: useAuthStore.ts
 * 
 * 파일 용도:
 * 인증 상태 관리 Store
 * - 사용자 정보 및 인증 상태 관리
 * - 로그인/로그아웃/회원가입 액션
 * - LocalStorage 연동으로 세션 유지
 * 
 * 사용법:
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { setTokens, clearTokens } from '../lib/axios';

// 사용자 타입
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: string;
}

// 인증 응답 타입
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 회원가입 요청 타입
interface SignupRequest {
  email: string;
  password: string;
  displayName?: string;
}

// 로그인 요청 타입
interface LoginRequest {
  email: string;
  password: string;
}

// Store 상태 타입
interface AuthState {
  // 상태
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

/**
 * useAuthStore
 * 
 * 역할:
 * - 인증 상태를 전역에서 관리
 * - 로그인/로그아웃/회원가입 로직 처리
 * - persist 미들웨어로 새로고침 시에도 상태 유지
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * 로그인
       * 
       * @param credentials - 이메일, 비밀번호
       */
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          // API 호출 (Mock)
          // 실제 환경에서는 아래 주석을 해제
          // const response = await api.post<AuthResponse>('/auth/login', credentials);
          // const { accessToken, refreshToken, user } = response.data;
          
          // Mock 응답 (개발용)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: 'user_' + Date.now(),
            email: credentials.email,
            displayName: credentials.email.split('@')[0],
            createdAt: new Date().toISOString(),
          };
          
          const mockAccessToken = 'mock_access_token_' + Date.now();
          const mockRefreshToken = 'mock_refresh_token_' + Date.now();

          // 토큰 저장
          setTokens(mockAccessToken, mockRefreshToken);

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
          set({
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * 회원가입
       * 
       * @param data - 이메일, 비밀번호, 이름
       */
      signup: async (data: SignupRequest) => {
        set({ isLoading: true, error: null });

        try {
          // API 호출 (Mock)
          // 실제 환경에서는 아래 주석을 해제
          // await api.post('/auth/signup', data);
          
          // Mock 응답 (개발용)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({ isLoading: false, error: null });
          
          // 회원가입 성공 후 자동 로그인은 하지 않음
          // 사용자가 로그인 페이지에서 직접 로그인하도록 유도
        } catch (error) {
          const message = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
          set({
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * 로그아웃
       */
      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * 사용자 정보 갱신
       */
      refreshUser: async () => {
        try {
          // API 호출 (Mock)
          // 실제 환경에서는 아래 주석을 해제
          // const response = await api.get<User>('/users/me');
          // set({ user: response.data });
          
          // Mock: 현재 사용자 정보 유지
          const currentUser = get().user;
          if (currentUser) {
            set({ user: currentUser });
          }
        } catch (error) {
          // 사용자 정보 조회 실패 시 로그아웃
          get().logout();
        }
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * 사용자 설정 (테스트/개발용)
       */
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },
    }),
    {
      name: 'auth-storage',
      // user 정보만 persist (토큰은 별도 localStorage에 저장)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

