/**
 * 파일명: App.tsx
 * 
 * 파일 용도:
 * 애플리케이션의 루트 컴포넌트 및 라우팅 설정
 * - React Router를 사용한 페이지 라우팅 구성
 * - 전체 애플리케이션의 네비게이션 구조 정의
 * - 전역 Provider 및 ErrorBoundary 적용
 * - 인증 라우트 보호
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
 * 데이터 흐름:
 * - URL 변경 → React Router → 해당 페이지 컴포넌트 렌더링
 * - Layout 컴포넌트는 공통 레이아웃(헤더, 사이드바 등)을 제공
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { ToastProvider } from './components/Toast';
import { ProjectCreate } from './pages/ProjectCreate';
import { WizardStep } from './pages/WizardStep';
import { BusinessPlanViewer } from './pages/BusinessPlanViewer';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServerErrorPage } from './pages/ServerErrorPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

/**
 * App 컴포넌트
 * 
 * 역할:
 * - 애플리케이션의 최상위 컴포넌트
 * - BrowserRouter로 SPA 라우팅 활성화
 * - 모든 페이지 경로와 컴포넌트 매핑
 * - 전역 에러 처리 및 Toast 알림 제공
 * 
 * @returns {JSX.Element} 라우터가 설정된 앱 컴포넌트
 */
function App() {
  return (
    <GlobalErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* 공개 페이지: 프로젝트 생성 (메인) */}
            <Route path="/" element={<ProjectCreate />} />
            
            {/* 인증 페이지 (로그인하지 않은 사용자용) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
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
              <Route path="/wizard/:stepId" element={<WizardStep />} />
              <Route path="/business-plan" element={<BusinessPlanViewer />} />
            </Route>
            
            {/* 에러 페이지 */}
            <Route path="/error" element={<ServerErrorPage />} />
            
            {/* 404 처리: 모든 미정의 경로 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
