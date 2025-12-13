/**
 * 파일명: Toast.tsx
 * 
 * 파일 용도:
 * Toast 알림 UI 컴포넌트
 * - 개별 Toast 아이템 렌더링
 * - ToastContainer로 여러 Toast 스택 관리
 * 
 * 디자인: 글래스모피즘 + 네온 액센트
 */

import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/common/utils';
import type { ToastItem, ToastType } from './ToastContext';

// 타입별 스타일 및 아이콘 설정
const toastConfig: Record<ToastType, { 
  icon: React.ReactNode; 
  bgClass: string; 
  borderClass: string;
  iconClass: string;
}> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bgClass: 'bg-neon-500/10',
    borderClass: 'border-neon-500/30',
    iconClass: 'text-neon-400',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30',
    iconClass: 'text-red-400',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/30',
    iconClass: 'text-yellow-400',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    iconClass: 'text-cyan-400',
  },
};

/**
 * Toast 컴포넌트
 * 개별 Toast 알림 UI
 */
interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const config = toastConfig[toast.type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl',
        'shadow-lg shadow-black/20',
        'animate-slide-in-right',
        'min-w-[320px] max-w-[420px]',
        config.bgClass,
        config.borderClass
      )}
      role="alert"
      aria-live="polite"
    >
      {/* 아이콘 */}
      <div className={cn('flex-shrink-0 mt-0.5', config.iconClass)}>
        {config.icon}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-white text-sm mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-slate-300 text-sm leading-relaxed">
          {toast.message}
        </p>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          'flex-shrink-0 p-1 rounded-lg transition-colors',
          'text-slate-500 hover:text-white hover:bg-white/10'
        )}
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * ToastContainer 컴포넌트
 * Toast 목록을 화면 우상단에 스택으로 표시
 */
interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3"
      aria-label="알림 목록"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

