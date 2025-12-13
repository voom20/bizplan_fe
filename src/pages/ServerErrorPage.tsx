/**
 * 파일명: ServerErrorPage.tsx
 * 
 * 파일 용도:
 * 500 Server Error 페이지
 * - 서버 오류 발생 시 표시
 * - 새로고침 및 홈으로 돌아가기 옵션 제공
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, ServerCrash } from 'lucide-react';

/**
 * ServerErrorPage 컴포넌트
 * 
 * 역할:
 * - 500 서버 에러 상태를 친근하게 표시
 * - 새로고침, 홈으로 돌아가기 옵션 제공
 */
export const ServerErrorPage: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      {/* 플로팅 오브 */}
      <div className="floating-orb w-96 h-96 bg-red-500/20 -top-48 -left-48" />
      <div className="floating-orb w-80 h-80 bg-violet-500/20 bottom-20 right-20" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 max-w-lg w-full text-center">
        {/* 500 숫자 */}
        <div className="mb-8 animate-fade-in">
          <div className="text-[150px] md:text-[200px] font-display font-bold leading-none tracking-tighter">
            <span className="text-red-500">5</span>
            <span className="text-white/20">0</span>
            <span className="text-red-500">0</span>
          </div>
        </div>

        {/* 글래스 카드 */}
        <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* 아이콘 */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <ServerCrash className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-white mb-3">
            서버에 문제가 발생했습니다
          </h1>

          {/* 설명 */}
          <p className="text-slate-400 mb-8 leading-relaxed">
            잠시 후 다시 시도해주세요.
            <br />
            문제가 지속되면 고객센터로 문의해주세요.
          </p>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="btn-neon flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </button>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로 이동
            </Link>
          </div>
        </div>

        {/* 하단 상태 */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          서버 상태 확인 중...
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;

