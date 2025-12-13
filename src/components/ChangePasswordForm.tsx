/**
 * 파일명: ChangePasswordForm.tsx
 * 
 * 파일 용도:
 * 비밀번호 변경 폼 컴포넌트
 * - 현재 비밀번호 확인
 * - 새 비밀번호 입력 (강도 표시)
 * - 비밀번호 확인
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, Check, Shield, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useToast } from './Toast';
import { cn } from '../lib/utils';

// 비밀번호 변경 스키마
const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, '현재 비밀번호를 입력해주세요.'),
  newPassword: z
    .string()
    .min(1, '새 비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .regex(/[0-9]/, '숫자를 포함해야 합니다.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다.'),
  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요.'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: '새 비밀번호는 현재 비밀번호와 달라야 합니다.',
  path: ['newPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

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
 * ChangePasswordForm 컴포넌트
 * 
 * 역할:
 * - 비밀번호 변경 폼
 * - 비밀번호 강도 표시
 * - 변경 성공 시 재로그인 유도
 */
export const ChangePasswordForm: React.FC = () => {
  const { logout } = useAuthStore();
  const toast = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onBlur',
  });

  const newPassword = watch('newPassword', '');
  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  // 비밀번호 요구사항 체크
  const passwordRequirements = [
    { met: newPassword.length >= 8, text: '8자 이상' },
    { met: /[0-9]/.test(newPassword), text: '숫자 포함' },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), text: '특수문자 포함' },
  ];

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (_data: PasswordFormData) => {
    setIsSubmitting(true);

    try {
      // Mock: API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 비밀번호 변경 성공
      toast.success('비밀번호가 변경되었습니다.\n보안을 위해 다시 로그인해주세요.');
      reset();

      // 2초 후 로그아웃
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      toast.error('비밀번호 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">비밀번호 변경</h3>
          <p className="text-sm text-slate-400">보안을 위해 정기적으로 변경하세요</p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        {/* 현재 비밀번호 */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            현재 비밀번호
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              className={cn(
                'input-glass pl-12 pr-12',
                errors.currentPassword && 'border-red-500/50 focus:border-red-500'
              )}
              placeholder="••••••••"
              {...register('currentPassword')}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1.5 text-sm text-red-400">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* 새 비밀번호 */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            새 비밀번호
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              className={cn(
                'input-glass pl-12 pr-12',
                errors.newPassword && 'border-red-500/50 focus:border-red-500'
              )}
              placeholder="••••••••"
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* 비밀번호 강도 표시 */}
          {newPassword && (
            <div className="mt-3 space-y-2">
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
          
          {errors.newPassword && (
            <p className="mt-1.5 text-sm text-red-400">{errors.newPassword.message}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            새 비밀번호 확인
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
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
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-900 shadow-cyan hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              변경 중...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              비밀번호 변경
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;

