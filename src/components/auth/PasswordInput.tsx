/**
 * 파일명: PasswordInput.tsx
 * 
 * 파일 용도:
 * 비밀번호 입력 컴포넌트 (공통화)
 * - 비밀번호 보기/숨기기 토글
 * - 선택적 강도 표시기
 * - 요구사항 체크리스트
 * 
 * 사용처:
 * - LoginPage, SignupPage, ChangePasswordForm, DeleteAccountModal
 */

import React, { useState, useMemo } from 'react';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  /** 입력값 */
  value: string;
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 에러 여부 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 강도 표시기 표시 여부 */
  showStrengthMeter?: boolean;
  /** 요구사항 체크리스트 표시 여부 */
  showRequirements?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 라벨 */
  label?: string;
  /** ID */
  id?: string;
  /** 추가 클래스 */
  className?: string;
}

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
 * PasswordInput 컴포넌트
 * 
 * 역할:
 * - 통합된 비밀번호 입력 UI
 * - 보기/숨기기 토글
 * - 선택적 강도 표시기
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = '••••••••',
  error = false,
  errorMessage,
  showStrengthMeter = false,
  showRequirements = false,
  disabled = false,
  label,
  id,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordStrength = useMemo(() => getPasswordStrength(value), [value]);

  // 비밀번호 요구사항 체크
  const passwordRequirements = [
    { met: value.length >= 8, text: '8자 이상' },
    { met: /[0-9]/.test(value), text: '숫자 포함' },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(value), text: '특수문자 포함' },
  ];

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <Lock className="w-5 h-5" />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 pl-12 pr-12 rounded-xl',
            'bg-white/5 backdrop-blur-sm',
            'border border-white/10',
            'text-white placeholder-slate-500',
            'focus:outline-none focus:border-neon-500/50',
            'focus:ring-2 focus:ring-neon-500/20',
            'focus:bg-white/10',
            'transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
          )}
          placeholder={placeholder}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors disabled:opacity-50"
          tabIndex={-1}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* 강도 표시기 */}
      {showStrengthMeter && value && (
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
        </div>
      )}

      {/* 요구사항 체크리스트 */}
      {showRequirements && value && (
        <div className="flex flex-wrap gap-2 mt-2">
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
      )}

      {/* 에러 메시지 */}
      {errorMessage && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
};

export default PasswordInput;

