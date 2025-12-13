/**
 * 파일명: Modal.tsx
 * 
 * 파일 용도:
 * 기본 모달 컴포넌트
 * - 모달 오버레이 및 컨테이너
 * - ESC 키로 닫기, 외부 클릭으로 닫기 지원
 * 
 * 디자인: 글래스모피즘 + 애니메이션
 */

import React, { useEffect, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 열린 모달 개수를 추적하여 body 스크롤을 관리
 * - 첫 번째 모달이 열릴 때만 스크롤 잠금
 * - 마지막 모달이 닫힐 때만 스크롤 해제
 */
let openModalCount = 0;

const lockBodyScroll = (): void => {
  openModalCount++;
  if (openModalCount === 1) {
    document.body.style.overflow = 'hidden';
  }
};

const unlockBodyScroll = (): void => {
  openModalCount = Math.max(0, openModalCount - 1);
  if (openModalCount === 0) {
    document.body.style.overflow = 'unset';
  }
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

/**
 * Modal 컴포넌트
 * 
 * 역할:
 * - 모달 오버레이 및 컨텐츠 컨테이너
 * - 키보드 및 마우스 이벤트 처리
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // isOpen은 클로저에서 effect 실행 시점의 값을 캡처
      // 모달이 열려 있었을 때만 스크롤 잠금 해제
      if (isOpen) {
        unlockBodyScroll();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 사이즈별 너비
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
      />

      {/* 모달 컨텐츠 */}
      <div
        className={cn(
          'relative w-full glass-card p-6 animate-fade-in-up',
          sizeClasses[size]
        )}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between mb-4">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-white"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-slate-400"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* 컨텐츠 */}
        {children}
      </div>
    </div>
  );
};

export default Modal;

