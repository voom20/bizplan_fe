/**
 * 파일명: DeleteAccountModal.tsx
 * 
 * 파일 용도:
 * 회원 탈퇴 확인 모달 컴포넌트
 * - 비밀번호 재확인
 * - 탈퇴 경고 메시지
 * - 탈퇴 처리 및 로그아웃
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 경고 스타일
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/components';
import { cn } from '@/common/utils';

interface DeleteAccountModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}

/**
 * DeleteAccountModal 컴포넌트
 * 
 * 역할:
 * - 회원 탈퇴 확인 모달
 * - 비밀번호 재확인
 * - 탈퇴 완료 시 홈으로 이동
 */
export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const toast = useToast();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  /**
   * 회원 탈퇴 처리
   */
  const handleDelete = async () => {
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // Mock: API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 탈퇴 성공
      toast.success('회원 탈퇴가 완료되었습니다.\n이용해 주셔서 감사합니다.');
      
      // 로그아웃 및 홈으로 이동
      logout();
      navigate('/');
    } catch (err) {
      setError('회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-md glass-card p-0 overflow-hidden animate-scale-in">
        {/* 헤더 - 경고 색상 */}
        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-b border-red-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">회원 탈퇴</h2>
              <p className="text-sm text-slate-400 mt-1">
                정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 경고 메시지 */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-2">
            <p className="text-sm text-red-400 font-medium">탈퇴 시 다음 정보가 삭제됩니다:</p>
            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
              <li>계정 정보 ({user?.email})</li>
              <li>작성한 모든 사업계획서</li>
              <li>재무 시뮬레이션 데이터</li>
              <li>PMF 진단 결과</li>
            </ul>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={cn(
                  'input-glass pl-12 pr-12',
                  error && 'border-red-500/50 focus:border-red-500'
                )}
                placeholder="현재 비밀번호 입력"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-sm text-red-400">{error}</p>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || !password}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                처리 중...
              </>
            ) : (
              '회원 탈퇴'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

