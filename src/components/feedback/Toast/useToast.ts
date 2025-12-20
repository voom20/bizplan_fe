/**
 * 파일명: useToast.ts
 * 
 * 파일 용도:
 * Toast Context를 사용하기 위한 커스텀 훅
 * 
 * 사용법:
 * const toast = useToast();
 * toast.success('저장되었습니다');
 * toast.error('오류가 발생했습니다');
 */

import { useContext } from 'react';
import { ToastContext, ToastContextType } from './ToastTypes';

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
