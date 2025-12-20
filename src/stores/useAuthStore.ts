/**
 * 파일명: useAuthStore.ts
 * 
 * 파일 용도:
 * 인증 상태 관리 Store
 * - 사용자 정보 및 인증 상태 관리
 * - 로그인/로그아웃/회원가입 액션
 * - LocalStorage 연동으로 세션 유지
 * 
 * API 연동:
 * - authService를 통해 백엔드 API 호출
 * 
 * 사용법:
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/service/authService';
import type { UserInfo } from '@/types';

// Store 상태 타입
interface AuthState {
  // 상태
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: { email: string; password: string; name: string; company?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name?: string; company?: string }) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: UserInfo | null) => void;
}

/**
 * useAuthStore
 * 
 * 역할:
 * - 인증 상태를 전역에서 관리
 * - 로그인/로그아웃/회원가입 로직 처리
 * - persist 미들웨어로 새로고침 시에도 상태 유지
 * - authService를 통해 백엔드 API 연동
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
       * @param credentials - 이메일, 비밀번호
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          // 실제 API 호출 (authService가 토큰 저장 처리)
          const response = await authService.login(credentials);

          set({
            user: response.user,
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
       * @param data - 이메일, 비밀번호, 이름, 회사명(선택)
       */
      signup: async (signupData) => {
        set({ isLoading: true, error: null });

        try {
          // 실제 API 호출
          await authService.signup(signupData);
          set({ isLoading: false, error: null });
          // 회원가입 성공 후 자동 로그인은 하지 않음
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
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          // 서버 요청 실패해도 로컬 상태는 초기화
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      /**
       * 사용자 정보 갱신
       */
      refreshUser: async () => {
        try {
          const userData = await authService.getMe();
          set({ user: userData });
        } catch (error) {
          // 사용자 정보 조회 실패 시 로그아웃
          console.error('Failed to refresh user:', error);
          get().logout();
        }
      },

      /**
       * 프로필 수정
       */
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : '프로필 수정에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * 비밀번호 변경
       */
      changePassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(data);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * 계정 삭제
       */
      deleteAccount: async (password) => {
        set({ isLoading: true, error: null });
        try {
          await authService.deleteAccount(password);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '계정 삭제에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
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
      setUser: (user) => {
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
