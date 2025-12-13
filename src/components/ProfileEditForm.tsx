/**
 * 파일명: ProfileEditForm.tsx
 * 
 * 파일 용도:
 * 사용자 프로필 수정 폼 컴포넌트
 * - 이름 수정
 * - 프로필 정보 표시 (이메일, 가입일)
 * - 저장 시 Toast 알림
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Calendar, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useToast } from './Toast';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';

// 프로필 수정 스키마
const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(20, '이름은 20자 이하이어야 합니다.'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * ProfileEditForm 컴포넌트
 * 
 * 역할:
 * - 사용자 프로필 정보 표시
 * - 이름 수정 기능
 * - 저장 성공/실패 피드백
 */
export const ProfileEditForm: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  // 사용자 정보 변경 시 폼 리셋
  useEffect(() => {
    if (user) {
      reset({ displayName: user.displayName || '' });
    }
  }, [user, reset]);

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);

    try {
      // Mock: API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 사용자 정보 업데이트
      if (user) {
        setUser({
          ...user,
          displayName: data.displayName,
        });
      }

      toast.success('프로필이 저장되었습니다.');
      reset(data); // isDirty 리셋
    } catch (error) {
      toast.error('프로필 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 가입일 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* 읽기 전용 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">계정 정보</h3>
        
        {/* 이메일 (읽기 전용) */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">이메일</p>
              <p className="text-white font-medium">{user?.email || '-'}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-500/20 text-slate-400">
              변경 불가
            </span>
          </div>
        </div>

        {/* 가입일 (읽기 전용) */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">가입일</p>
              <p className="text-white font-medium">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 수정 가능한 정보 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4">프로필 수정</h3>

        {/* 이름 */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-neon-400" />
            </div>
            <div className="flex-1">
              <Input
                label="이름"
                placeholder="홍길동"
                error={!!errors.displayName}
                errorMessage={errors.displayName?.message}
                {...register('displayName')}
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
              isDirty
                ? 'bg-gradient-to-r from-neon-500 to-neon-600 text-slate-900 shadow-neon hover:from-neon-400 hover:to-neon-500'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                변경사항 저장
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;

