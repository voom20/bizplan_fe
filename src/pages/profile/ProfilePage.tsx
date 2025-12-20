/**
 * 파일명: ProfilePage.tsx
 * 
 * 파일 용도:
 * 사용자 프로필 관리 페이지
 * - 탭 형태 UI (프로필, 보안)
 * - 프로필 수정, 비밀번호 변경, 회원 탈퇴
 * 
 * 라우트: /profile
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { ProfileEditForm } from '@/pages/profile/ProfileEditForm';
import { ChangePasswordForm } from '@/pages/profile/ChangePasswordForm';
import { DeleteAccountModal } from '@/pages/profile/DeleteAccountModal';
import { cn } from '@/common/utils';

/** 탭 타입 */
type TabType = 'profile' | 'security';

/** 탭 정보 */
interface TabInfo {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: TabInfo[] = [
  {
    id: 'profile',
    label: '프로필',
    icon: <User className="w-5 h-5" />,
    description: '계정 정보 및 프로필 수정',
  },
  {
    id: 'security',
    label: '보안',
    icon: <Shield className="w-5 h-5" />,
    description: '비밀번호 변경 및 계정 보안',
  },
];

/**
 * ProfilePage 컴포넌트
 * 
 * 역할:
 * - 사용자 프로필 관리
 * - 탭 기반 네비게이션
 * - 각 기능별 폼 렌더링
 */
export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 로그인하지 않은 경우 로그인 페이지로 유도
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-neon-500/20 flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-neon-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">로그인이 필요합니다</h2>
          <p className="text-slate-400 mb-6">
            프로필을 관리하려면 먼저 로그인해주세요.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-neon-500 to-neon-600 text-slate-900 shadow-neon hover:from-neon-400 hover:to-neon-500 transition-all"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
          
          <div className="flex items-center gap-4">
            {/* 프로필 아바타 */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-500 to-cyan-500 flex items-center justify-center shadow-neon-lg">
                <span className="text-3xl font-bold text-slate-900">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neon-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 text-slate-900" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user?.name || '사용자'}
              </h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="glass-card p-1.5 mb-6">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300',
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <ProfileEditForm />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in space-y-8">
              {/* 비밀번호 변경 */}
              <ChangePasswordForm />

              {/* 위험 구역 */}
              <div className="glass-card border-red-500/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      계정 삭제
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                    </p>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="px-4 py-2 rounded-lg font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 회원 탈퇴 모달 */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;

