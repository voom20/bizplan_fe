/**
 * 파일명: AlertModal.tsx
 * 
 * 파일 용도:
 * 알림 모달 컴포넌트
 * - 사용자에게 정보 전달
 * - 확인 버튼만 있는 단순 알림
 * 
 * 사용법:
 * <AlertModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="안내"
 *   message="저장이 완료되었습니다."
 *   variant="success"
 * />
 */

import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import { cn } from '@/common/utils';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

/**
 * AlertModal 컴포넌트
 * 
 * 역할:
 * - 단순 알림용 모달
 * - variant에 따라 다른 아이콘/스타일 적용
 */
export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = '확인',
  variant = 'info',
}) => {
  // variant별 스타일
  const variantStyles = {
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      iconBg: 'bg-neon-500/20',
      iconColor: 'text-neon-400',
    },
    error: {
      icon: <AlertCircle className="w-6 h-6" />,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
  };

  const styles = variantStyles[variant];

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
        <p className="text-slate-400 mb-6 leading-relaxed whitespace-pre-line">{message}</p>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="w-full btn-neon"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default AlertModal;

