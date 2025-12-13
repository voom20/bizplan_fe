/**
 * 파일명: ProtectedRoute.tsx
 * 
 * 파일 용도:
 * 보호된 라우트 컴포넌트
 * - 인증되지 않은 사용자의 접근 차단
 * - 로그인 페이지로 리다이렉트
 * - 로그인 후 원래 페이지로 복귀 지원
 * 
 * 사용법:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface ProtectedRouteProps {
  /**
   * 인증되지 않은 경우 리다이렉트할 경로
   * @default '/login'
   */
  redirectTo?: string;
  
  /**
   * 자식 컴포넌트 (Outlet 대신 사용)
   */
  children?: React.ReactNode;
}

/**
 * ProtectedRoute 컴포넌트
 * 
 * 역할:
 * - 인증 상태 확인
 * - 비인증 시 로그인 페이지로 리다이렉트
 * - 현재 경로를 state로 전달하여 로그인 후 복귀 지원
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/login',
  children,
}) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    // 현재 경로를 state로 전달하여 로그인 후 복귀 가능하도록 함
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // 인증된 경우 자식 컴포넌트 또는 Outlet 렌더링
  return children ? <>{children}</> : <Outlet />;
};

/**
 * 게스트 전용 라우트 (로그인하지 않은 사용자만 접근 가능)
 * 예: 로그인, 회원가입 페이지
 */
interface GuestOnlyRouteProps {
  /**
   * 인증된 경우 리다이렉트할 경로
   * @default '/'
   */
  redirectTo?: string;
  
  /**
   * 자식 컴포넌트
   */
  children?: React.ReactNode;
}

export const GuestOnlyRoute: React.FC<GuestOnlyRouteProps> = ({
  redirectTo = '/',
  children,
}) => {
  const { isAuthenticated } = useAuthStore();

  // 이미 인증된 경우 홈으로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // 비인증 상태면 자식 컴포넌트 또는 Outlet 렌더링
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

