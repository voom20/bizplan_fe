/**
 * 파일명: ToastTypes.ts
 * 
 * 파일 용도:
 * Toast 관련 타입 및 Context 정의
 */

import { createContext } from 'react';

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
export interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  // 편의 함수들
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

// Context 생성 (for useToast hook)
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

