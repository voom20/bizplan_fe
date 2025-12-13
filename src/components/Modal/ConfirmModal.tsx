/**
 * 파일명: ConfirmModal.tsx
 * 
 * 파일 용도:
 * 확인 모달 컴포넌트
 * - 사용자에게 확인/취소 선택을 요청
 * - 위험한 작업 전 확인용
 * 
 * 사용법:
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="삭제 확인"
 *   message="정말 삭제하시겠습니까?"
 *   confirmText="삭제"
 *   variant="danger"
 * />
 */

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { cn } from '../../lib/utils';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  isLoading?: boolean;
}

/**
 * ConfirmModal 컴포넌트
 * 
 * 역할:
 * - 확인/취소 액션이 필요한 모달
 * - variant에 따라 다른 스타일 적용
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  isLoading = false,
}) => {
  // variant별 스타일
  const variantStyles = {
    default: {
      icon: <Info className="w-6 h-6" />,
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
      confirmBg: 'btn-neon',
    },
    danger: {
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      confirmBg: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      confirmBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 shadow-lg shadow-yellow-500/30',
    },
  };

  const styles = variantStyles[variant];

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        {/* 아이콘 */}
        <div className="inline-flex items-center justify-center mb-4">
          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', styles.iconBg)}>
            <span className={styles.iconColor}>{styles.icon}</span>
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

        {/* 메시지 */}
        <p className="text-slate-400 mb-6 leading-relaxed">{message}</p>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-50',
              styles.confirmBg
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                처리 중...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

