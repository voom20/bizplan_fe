/**
 * 파일명: useAuthQueries.ts
 * 
 * 파일 용도:
 * 인증 관련 React Query 훅
 * - 로그인, 회원가입, 로그아웃
 * - 사용자 정보 조회/수정
 * - 비밀번호 변경
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/service';
import { QUERY_KEYS } from '@/service';
import type {
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/types';

/**
 * 현재 사용자 정보 조회 훅
 * - 로그인 상태에서만 사용
 * - 자동으로 캐싱되어 불필요한 요청 방지
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.USER,
    queryFn: authService.getMe,
    // 로그인 토큰이 있을 때만 실행
    enabled: !!localStorage.getItem('accessToken'),
    // 10분간 신선한 데이터로 취급
    staleTime: 10 * 60 * 1000,
    // 실패 시 재시도 안함 (인증 문제일 가능성)
    retry: false,
  });
};

/**
 * 로그인 뮤테이션 훅
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({ email, password });
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, data.user);
      // 대시보드로 이동
      navigate('/projects');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

/**
 * 회원가입 뮤테이션 훅
 */
export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: SignupRequest) => authService.signup(userData),
    onSuccess: () => {
      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login', { state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } });
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};

/**
 * 로그아웃 뮤테이션 훅
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // 모든 쿼리 캐시 초기화
      queryClient.clear();
      // 로그인 페이지로 이동
      navigate('/login');
    },
    onError: () => {
      // 에러가 나도 로컬 상태는 클리어
      queryClient.clear();
      navigate('/login');
    },
  });
};

/**
 * 프로필 수정 뮤테이션 훅
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, updatedUser);
    },
  });
};

/**
 * 비밀번호 변경 뮤테이션 훅
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
  });
};

/**
 * 계정 삭제 뮤테이션 훅
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (password: string) => authService.deleteAccount(password),
    onSuccess: () => {
      queryClient.clear();
      navigate('/login', { state: { message: '계정이 삭제되었습니다.' } });
    },
  });
};

