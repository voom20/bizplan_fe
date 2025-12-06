/**
 * 파일명: Layout.tsx
 * 
 * 파일 용도:
 * 마법사 페이지의 공통 레이아웃 컴포넌트
 * - 다크 테마 + 글래스모피즘 스타일
 * - 헤더, 사이드바, 메인 콘텐츠 영역 제공
 * - 마법사 진행 상태 표시
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useWizardStore } from '../stores/useWizardStore';
import { useProjectStore } from '../stores/useProjectStore';
import { SaveIndicator } from './SaveIndicator';
import { Progress } from './ui';
import { Check, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Layout 컴포넌트
 * 다크 테마 마법사 레이아웃
 */
export const Layout: React.FC = () => {
  const location = useLocation();
  const { currentStep, steps, isStepCompleted } = useWizardStore();
  const { currentProject } = useProjectStore();

  const isWizardPage = location.pathname.startsWith('/wizard');

  // 마법사 페이지가 아닌 경우 레이아웃 없이 콘텐츠만 렌더링
  if (!isWizardPage) {
    return <Outlet />;
  }

  // 진행률 계산
  const completedSteps = steps.filter((step) => isStepCompleted(step.id)).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen relative">
      {/* 배경 효과 */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 & 프로젝트명 */}
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-400 to-neon-600 flex items-center justify-center shadow-neon transition-shadow group-hover:shadow-neon-lg">
                  <Sparkles className="w-4 h-4 text-slate-900" />
                </div>
                <span className="text-lg font-display font-bold text-white">
                  StartupPlan
                </span>
              </Link>
              
              {currentProject && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-300 font-medium truncate max-w-[200px]">
                    {currentProject.name}
                  </span>
                </>
              )}
            </div>

            {/* 저장 상태 */}
            <SaveIndicator />
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto relative">
        {/* Sidebar */}
        <aside className="w-72 sticky top-16 h-[calc(100vh-4rem)] p-6 overflow-y-auto">
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-400">진행률</span>
              <span className="text-sm font-bold text-white">
                {completedSteps}/{steps.length}
              </span>
            </div>
            <Progress value={progressPercentage} color="neon" />
          </div>

          <nav className="space-y-2">
            {steps.map((step, index) => {
              const isCompleted = isStepCompleted(step.id);
              const isCurrent = currentStep === step.id;

              return (
                <Link
                  key={step.id}
                  to={`/wizard/${step.id}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl',
                    'text-sm font-medium transition-all duration-300',
                    'group',
                    isCurrent
                      ? 'bg-neon-500/20 text-neon-400 border border-neon-500/30'
                      : isCompleted
                      ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-400'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* 단계 번호/체크 */}
                  <div className={cn(
                    'flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0',
                    'transition-all duration-300',
                    isCurrent
                      ? 'bg-neon-500 text-slate-900 shadow-neon'
                      : isCompleted
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-slate-500 border border-white/10'
                  )}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* 단계 제목 */}
                  <span className="truncate">{step.title}</span>

                  {/* 현재 단계 인디케이터 */}
                  {isCurrent && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 빠른 링크 */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <Link
              to="/business-plan"
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'text-sm font-medium text-slate-500',
                'hover:bg-white/5 hover:text-slate-300',
                'transition-all duration-300'
              )}
            >
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <span className="text-violet-400 text-xs">📄</span>
              </div>
              <span>사업계획서 미리보기</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-h-[calc(100vh-4rem)]">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
