/**
 * 파일명: GlobalErrorBoundary.tsx
 * 
 * 파일 용도:
 * 전역 에러 경계 컴포넌트
 * - React 렌더링 에러를 캐치하여 폴백 UI 표시
 * - 에러 정보 로깅 및 복구 옵션 제공
 * 
 * 사용법:
 * <GlobalErrorBoundary>
 *   <App />
 * </GlobalErrorBoundary>
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * GlobalErrorBoundary 컴포넌트
 * 
 * 역할:
 * - 하위 컴포넌트 트리에서 발생하는 JavaScript 에러를 캐치
 * - 에러 발생 시 폴백 UI 표시
 * - 에러 복구 옵션 제공 (새로고침, 홈으로 이동)
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * 에러 발생 시 state 업데이트
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  /**
   * 에러 정보 로깅
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // 에러 로깅 (실제 환경에서는 Sentry 등 에러 트래킹 서비스로 전송)
    console.error('GlobalErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  /**
   * 에러 상태 초기화 및 페이지 새로고침
   */
  handleRefresh = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  /**
   * 홈으로 이동
   */
  handleGoHome = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // 사용자 정의 폴백이 있으면 사용
      if (fallback) {
        return fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-grid opacity-50" />
          
          {/* 배경 오브 */}
          <div className="floating-orb w-96 h-96 bg-red-500/20 -top-48 -left-48" />
          <div className="floating-orb w-80 h-80 bg-violet-500/20 bottom-20 right-20" />
          
          <div className="relative z-10 max-w-lg w-full">
            <div className="glass-card p-8 text-center animate-fade-in-up">
              {/* 아이콘 */}
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 blur-2xl opacity-30 animate-pulse-ring" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <h1 className="text-2xl font-bold text-white mb-3">
                앗! 문제가 발생했습니다
              </h1>

              {/* 설명 */}
              <p className="text-slate-400 mb-6 leading-relaxed">
                예기치 않은 오류가 발생했습니다.
                <br />
                페이지를 새로고침하거나 홈으로 돌아가주세요.
              </p>

              {/* 에러 메시지 (개발 모드에서만) */}
              {import.meta.env.DEV && error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-left">
                  <p className="text-xs text-red-400 font-mono break-all">
                    {error.message}
                  </p>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleRefresh}
                  className="btn-neon flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  새로고침
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  홈으로 이동
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default GlobalErrorBoundary;

