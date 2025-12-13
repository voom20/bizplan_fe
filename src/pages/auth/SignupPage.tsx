/**
 * 파일명: SignupPage.tsx
 * 
 * 파일 용도:
 * 회원가입 페이지
 * - 이메일/비밀번호/이름 입력 폼
 * - 비밀번호 강도 표시
 * - 회원가입 처리 및 에러 표시
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Sparkles, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/components/Toast';
import { cn } from '@/common/utils';

// 폼 스키마
const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .regex(/[0-9]/, '숫자를 포함해야 합니다.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다.'),
  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요.'),
  displayName: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(20, '이름은 20자 이하이어야 합니다.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

// 비밀번호 강도 계산
const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score <= 2) return { score, label: '약함', color: 'bg-red-500' };
  if (score <= 3) return { score, label: '보통', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: '강함', color: 'bg-neon-500' };
  return { score, label: '매우 강함', color: 'bg-neon-400' };
};

/**
 * SignupPage 컴포넌트
 * 
 * 역할:
 * - 사용자 회원가입 처리
 * - 폼 유효성 검사
 * - 비밀번호 강도 표시
 * - 회원가입 성공 시 로그인 페이지로 이동
 */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 이미 로그인되어 있으면 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const password = watch('password', '');
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
      toast.success('회원가입이 완료되었습니다.\n로그인해주세요.');
      navigate('/login');
    } catch {
      // 에러는 useEffect에서 처리
    }
  };

  // 비밀번호 요구사항 체크
  const passwordRequirements = [
    { met: password.length >= 8, text: '8자 이상' },
    { met: /[0-9]/.test(password), text: '숫자 포함' },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: '특수문자 포함' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      {/* 플로팅 오브 */}
      <div className="floating-orb w-96 h-96 bg-cyan-500/20 -top-48 -right-48" />
      <div className="floating-orb w-80 h-80 bg-violet-500/20 top-1/2 -left-40" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-64 h-64 bg-neon-500/20 bottom-20 right-1/4" style={{ animationDelay: '4s' }} />

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
            회원가입
          </h1>
          <p className="text-slate-400">
            새 계정을 만들어 시작하세요.
          </p>
        </div>

        {/* 회원가입 폼 */}
        <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 이름 */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
                이름
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="displayName"
                  type="text"
                  autoComplete="name"
                  className={cn(
                    'input-glass pl-12',
                    errors.displayName && 'border-red-500/50 focus:border-red-500'
                  )}
                  placeholder="홍길동"
                  {...register('displayName')}
                />
              </div>
              {errors.displayName && (
                <p className="mt-1.5 text-sm text-red-400">{errors.displayName.message}</p>
              )}
            </div>

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
                  autoComplete="new-password"
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
              
              {/* 비밀번호 강도 표시 */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={cn('h-full transition-all duration-300', passwordStrength.color)}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{passwordStrength.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {passwordRequirements.map((req, i) => (
                      <span 
                        key={i}
                        className={cn(
                          'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                          req.met 
                            ? 'bg-neon-500/20 text-neon-400' 
                            : 'bg-white/5 text-slate-500'
                        )}
                      >
                        {req.met && <Check className="w-3 h-3" />}
                        {req.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cn(
                    'input-glass pl-12 pr-12',
                    errors.confirmPassword && 'border-red-500/50 focus:border-red-500'
                  )}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-neon flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  가입 처리 중...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  회원가입
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

          {/* 로그인 링크 */}
          <p className="text-center text-slate-400">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="text-neon-400 hover:text-neon-300 font-medium transition-colors"
            >
              로그인
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

export default SignupPage;

