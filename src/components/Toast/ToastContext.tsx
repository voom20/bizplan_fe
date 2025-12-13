/**
 * 파일명: ToastContext.tsx
 * 
 * 파일 용도:
 * Toast 알림 시스템의 Context 및 Provider
 * - 전역에서 Toast를 표시할 수 있도록 Context 제공
 * - Toast 상태 관리 및 자동 제거 로직
 * 
 * 사용법:
 * 1. App을 ToastProvider로 감싸기
 * 2. useToast() 훅으로 toast 함수 사용
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastContainer } from './Toast';

// Toast 타입 정의
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast 아이템 인터페이스
export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

// Toast Context 타입
interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  // 편의 함수들
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

// Context 생성
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 고유 ID 생성 함수
const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 기본 지속 시간 (ms)
const DEFAULT_DURATION = 4000;

/**
 * ToastProvider 컴포넌트
 * 
 * 역할:
 * - Toast 상태를 전역에서 관리
 * - Toast 추가/제거 함수 제공
 * - ToastContainer를 렌더링
 */
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  /**
   * Toast 제거 함수
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Toast 추가 함수
   * - 자동으로 지정된 시간 후 제거
   */
  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = generateId();
    const duration = toast.duration ?? DEFAULT_DURATION;
    
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // 자동 제거 타이머
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  // 편의 함수들
  const success = useCallback((message: string, title?: string) => {
    addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ type: 'error', message, title, duration: 6000 }); // 에러는 더 오래 표시
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ type: 'warning', message, title });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ type: 'info', message, title });
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * useToast 커스텀 훅
 * 
 * 사용법:
 * const toast = useToast();
 * toast.success('저장되었습니다');
 * toast.error('오류가 발생했습니다');
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

