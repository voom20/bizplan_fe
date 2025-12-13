/**
 * 파일명: AppRoutes.tsx
 * 
 * 파일 용도:
 * 애플리케이션 라우팅 설정 (Code Splitting 적용)
 * - React.lazy()를 사용한 라우트 기반 Code Splitting
 * - Suspense로 로딩 상태 처리
 * - 전체 라우팅 구조를 중앙 집중화
 * 
 * 라우팅 구조:
 * / (루트)
 *   └─> ProjectCreate: 프로젝트 생성 페이지
 * /login
 *   └─> LoginPage: 로그인 페이지 (게스트 전용)
 * /signup
 *   └─> SignupPage: 회원가입 페이지 (게스트 전용)
 * /wizard/:stepId
 *   └─> Layout > WizardStep: 단계별 마법사 페이지
 * /business-plan
 *   └─> Layout > BusinessPlanViewer: 사업계획서 뷰어 페이지
 * /error
 *   └─> ServerErrorPage: 서버 에러 페이지
 * /* (기타)
 *   └─> NotFoundPage: 404 페이지
 * 
 * 성능 최적화:
 * - 페이지별 Lazy Loading으로 초기 번들 크기 감소
 * - Suspense fallback으로 로딩 UX 개선
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, PageLoadingFallback } from '@/components';

// ============================================
// Lazy Loading 페이지 컴포넌트
// ============================================

/** 프로젝트 생성 페이지 (메인) */
const ProjectCreate = lazy(() => import('@/pages/ProjectCreate'));

/** 로그인 페이지 */
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

/** 회원가입 페이지 */
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));

/** 마법사 단계 페이지 */
const WizardStep = lazy(() => import('@/pages/wizard/WizardStep'));

/** 사업계획서 뷰어 페이지 */
const BusinessPlanViewer = lazy(() => import('@/pages/business-plan/BusinessPlanViewer'));

/** 서버 에러 페이지 */
const ServerErrorPage = lazy(() => import('@/error/ServerErrorPage'));

/** 404 페이지 */
const NotFoundPage = lazy(() => import('@/error/NotFoundPage'));

/** 프로필 페이지 */
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));

/** 재무 계산기 페이지 (Public) */
const FinancialCalculatorPage = lazy(() => import('@/pages/calculator/FinancialCalculatorPage'));

/**
 * SuspenseWrapper 컴포넌트
 * 
 * 역할:
 * - 자식 컴포넌트를 Suspense로 감싸서 로딩 상태 처리
 * 
 * @param {React.ReactNode} children - Lazy Loading된 컴포넌트
 * @returns {JSX.Element} Suspense로 감싸진 컴포넌트
 */
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoadingFallback />}>
    {children}
  </Suspense>
);

/**
 * AppRoutes 컴포넌트
 * 
 * 역할:
 * - 애플리케이션의 전체 라우팅 구조 정의
 * - 페이지별 Lazy Loading 적용
 * - 공통 레이아웃 구조 설정
 * 
 * @returns {JSX.Element} 라우팅 설정
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 공개 페이지: 프로젝트 생성 (메인) */}
      <Route
        path="/"
        element={
          <SuspenseWrapper>
            <ProjectCreate />
          </SuspenseWrapper>
        }
      />

      {/* 인증 페이지 (로그인하지 않은 사용자용) */}
      <Route
        path="/login"
        element={
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        }
      />
      <Route
        path="/signup"
        element={
          <SuspenseWrapper>
            <SignupPage />
          </SuspenseWrapper>
        }
      />

      {/* 프로필 페이지 (인증된 사용자용, 레이아웃 없음) */}
      <Route
        path="/profile"
        element={
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        }
      />

      {/* 재무 계산기 페이지 (Public, 비로그인도 접근 가능) */}
      <Route
        path="/calculator"
        element={
          <SuspenseWrapper>
            <FinancialCalculatorPage />
          </SuspenseWrapper>
        }
      />

      {/* Layout으로 감싸진 페이지들 (공통 레이아웃 적용) */}
      {/* 
       * 참고: 현재는 인증 없이도 접근 가능 (MVP 단계)
       * 추후 ProtectedRoute로 감싸서 인증 필수로 변경 가능:
       * <Route element={<ProtectedRoute />}>
       *   <Route element={<Layout />}>
       *     ...
       *   </Route>
       * </Route>
       */}
      <Route element={<Layout />}>
        <Route
          path="/wizard/:stepId"
          element={
            <SuspenseWrapper>
              <WizardStep />
            </SuspenseWrapper>
          }
        />
        <Route
          path="/business-plan"
          element={
            <SuspenseWrapper>
              <BusinessPlanViewer />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* 에러 페이지 */}
      <Route
        path="/error"
        element={
          <SuspenseWrapper>
            <ServerErrorPage />
          </SuspenseWrapper>
        }
      />

      {/* 404 처리: 모든 미정의 경로 */}
      <Route
        path="*"
        element={
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

