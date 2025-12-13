/**
 * 파일명: NotFoundPage.tsx
 * 
 * 파일 용도:
 * 404 Not Found 에러 페이지
 * - 존재하지 않는 URL 접근 시 표시
 * - 홈으로 돌아가기 CTA 제공
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

/**
 * NotFoundPage 컴포넌트
 * 
 * 역할:
 * - 404 에러 상태를 친근하게 표시
 * - 홈으로 돌아가기, 뒤로 가기 옵션 제공
 */
export const NotFoundPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      {/* 플로팅 오브 */}
      <div className="floating-orb w-96 h-96 bg-cyan-500/20 -top-48 -right-48" />
      <div className="floating-orb w-80 h-80 bg-violet-500/20 bottom-20 -left-20" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 max-w-lg w-full text-center">
        {/* 404 숫자 */}
        <div className="mb-8 animate-fade-in">
          <div className="text-[150px] md:text-[200px] font-display font-bold leading-none tracking-tighter">
            <span className="text-gradient">4</span>
            <span className="text-white/20">0</span>
            <span className="text-gradient">4</span>
          </div>
        </div>

        {/* 글래스 카드 */}
        <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* 아이콘 */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
              <Search className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-white mb-3">
            페이지를 찾을 수 없습니다
          </h1>

          {/* 설명 */}
          <p className="text-slate-400 mb-8 leading-relaxed">
            요청하신 페이지가 존재하지 않거나
            <br />
            이동되었을 수 있습니다.
          </p>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="btn-neon flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로 이동
            </Link>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 페이지
            </button>
          </div>
        </div>

        {/* 하단 힌트 */}
        <p className="mt-8 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          문제가 계속되면{' '}
          <a href="mailto:support@bizplan.kr" className="text-cyan-400 hover:underline">
            고객센터
          </a>
          로 문의해주세요.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;

