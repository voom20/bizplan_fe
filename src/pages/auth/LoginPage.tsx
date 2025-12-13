/**
 * 파일명: LoginPage.tsx
 * 
 * 파일 용도:
 * 로그인 페이지
 * - 이메일/비밀번호 입력 폼
 * - 로그인 처리 및 에러 표시
 * - 회원가입 페이지 링크
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/components/Toast';
import { cn } from '@/lib/utils';

// 폼 스키마
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginPage 컴포넌트
 * 
 * 역할:
 * - 사용자 로그인 처리
 * - 폼 유효성 검사
 * - 로그인 성공 시 대시보드로 이동
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);

  // 리다이렉트 URL (로그인 후 돌아갈 페이지)
  const from = (location.state as { from?: string })?.from || '/';

  // 이미 로그인되어 있으면 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // 에러 발생 시 Toast 표시
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, toast, clearError]);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('로그인되었습니다.');
      navigate(from, { replace: true });
    } catch {
      // 에러는 useEffect에서 처리
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      {/* 플로팅 오브 */}
      <div className="floating-orb w-96 h-96 bg-neon-500/20 -top-48 -left-48" />
      <div className="floating-orb w-80 h-80 bg-cyan-500/20 top-1/3 -right-40" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-64 h-64 bg-violet-500/20 bottom-20 left-1/4" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-500 blur-2xl opacity-40 animate-pulse-slow" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-400 to-neon-600 flex items-center justify-center shadow-neon-lg">
                <Sparkles className="w-8 h-8 text-slate-900" />
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            로그인
          </h1>
          <p className="text-slate-400">
            계정에 로그인하여 사업계획서를 작성하세요.
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    'input-glass pl-12',
                    errors.email && 'border-red-500/50 focus:border-red-500'
                  )}
                  placeholder="example@email.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={cn(
                    'input-glass pl-12 pr-12',
                    errors.password && 'border-red-500/50 focus:border-red-500'
                  )}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-neon flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  로그인 중...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  로그인
                </>
              )}
            </button>
          </form>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-500">또는</span>
            </div>
          </div>

          {/* 회원가입 링크 */}
          <p className="text-center text-slate-400">
            아직 계정이 없으신가요?{' '}
            <Link
              to="/signup"
              className="text-neon-400 hover:text-neon-300 font-medium transition-colors"
            >
              회원가입
            </Link>
          </p>
        </div>

        {/* 홈으로 돌아가기 */}
        <p className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-white transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

