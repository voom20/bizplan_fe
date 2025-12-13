# EPIC0-FE 구현 현황 분석

> **분석일**: 2025년 12월 6일  
> **분석 대상**: EPIC0-FE-001 ~ EPIC0-FE-012

---

## 📊 요약 대시보드

```
┌────────────────────────────────────────────────────┐
│  전체 EPIC: 12개                                    │
│  ✅ 완료: 5개 (42%)                                 │
│  ⚠️  부분 구현: 2개 (17%)                            │
│  ❌ 미구현: 5개 (42%)                               │
└────────────────────────────────────────────────────┘

우선순위별 현황:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Must (필수)     ████████░░░░░░░░ 4/7 완료 (57%)
Should (권장)   ██████░░░░░░░░░░ 1/3 완료 (33%)
Could (선택)    ░░░░░░░░░░░░░░░░ 0/2 완료 (0%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ✅ 완료된 EPIC (5개)

### EPIC0-FE-001: 프로젝트 생성 및 Wizard 기본 레이아웃 PoC
| 요구사항 | 상태 | 구현 위치 |
|----------|------|----------|
| 프로젝트 생성 페이지 | ✅ | `src/pages/ProjectCreate.tsx` |
| 템플릿 선택 UI (카드 형태) | ✅ | `src/pages/ProjectCreate.tsx` |
| Wizard 레이아웃 (사이드바 + 메인 영역) | ✅ | `src/components/Layout.tsx` |
| Mock API 연동 | ✅ | `src/stores/useProjectStore.ts` |

---

### EPIC0-FE-002: Wizard 입력 폼 및 자동저장 UI PoC
| 요구사항 | 상태 | 구현 위치 |
|----------|------|----------|
| Textarea, Input 등 기본 입력 컴포넌트 | ✅ | `src/components/ui/` |
| 필수 항목(Required) 검증 UI | ✅ | `src/components/wizard/QuestionForm.tsx` |
| Debounce 자동저장 | ✅ | `src/hooks/useAutoSave.ts` |
| '다음 단계' 버튼 동작 | ✅ | `src/pages/WizardStep.tsx` |
| 저장 상태 표시 | ✅ | `src/components/SaveIndicator.tsx` |

---

### EPIC0-FE-003: 사업계획서 초안 생성 및 뷰어 UI PoC
| 요구사항 | 상태 | 구현 위치 |
|----------|------|----------|
| '초안 생성' 버튼 및 로딩 UI | ✅ | `src/pages/BusinessPlanViewer.tsx` |
| 생성된 문서 뷰어 (Markdown) | ✅ | `react-markdown` 사용 |
| '내보내기(HWP/PDF)' 버튼 (Mock) | ✅ | `handleExport()` 함수 |
| 섹션별 'AI 다시 쓰기' 버튼 | ✅ | `handleRegenerate()` 함수 |

---

### EPIC0-FE-004: 재무 입력 및 유닛 이코노믹스 시각화 UI PoC
| 요구사항 | 상태 | 구현 위치 |
|----------|------|----------|
| 재무 전용 입력 폼 | ✅ | `src/components/wizard/FinancialSimulation.tsx` |
| Recharts 그래프 렌더링 | ✅ | `recharts` 라이브러리 |
| 주요 지표 카드 (LTV, CAC, BEP) | ✅ | `src/hooks/useFinancialCalc.ts` |
| LTV/CAC < 3 경고 뱃지 | ✅ | 조건부 렌더링 구현 |

---

### EPIC0-FE-005: PMF 진단 설문 및 리포트 UI PoC
| 요구사항 | 상태 | 구현 위치 |
|----------|------|----------|
| PMF 진단 설문 페이지 | ✅ | `src/components/wizard/PMFSurvey.tsx` |
| 진단 결과 리포트 | ✅ | `src/stores/usePMFStore.ts` |
| Score 게이지 차트 | ✅ | 컴포넌트 내 구현 |
| 데이터 부족 경고 | ⚠️ | 기본적인 검증만 구현 |

---

## ⚠️ 부분 구현된 EPIC (2개)

### EPIC0-FE-010: 문서 내보내기 실제 구현 UI PoC
| 요구사항 | 상태 | 비고 |
|----------|------|------|
| 내보내기 버튼 (PDF, HWP) | ✅ | Mock alert만 |
| 형식 선택 드롭다운 | ❌ | 현재 버튼 2개로 분리 |
| 다운로드 진행 상태 표시 | ❌ | 미구현 |
| 다운로드 완료/실패 토스트 | ❌ | Toast 시스템 없음 |
| 특정 버전 내보내기 옵션 | ❌ | 버전 관리 미구현 |
| 에러 처리 | ❌ | 미구현 |

**필요 작업:**
- [ ] 실제 파일 다운로드 API 연동
- [ ] 형식 선택 드롭다운 UI 구현
- [ ] 다운로드 상태 표시 (로딩/완료/실패)
- [ ] Toast 알림 연동

---

### EPIC0-FE-011: 공통 컴포넌트 및 전역 에러 핸들링 UI PoC
| 요구사항 | 상태 | 비고 |
|----------|------|------|
| Spinner 컴포넌트 | ✅ | `src/components/ui/Spinner.tsx` |
| Toast 알림 시스템 | ❌ | 미구현 |
| 전역 에러 바운더리 | ❌ | 미구현 |
| 404 Not Found 페이지 | ❌ | 현재 "/" 로 리다이렉트 |
| 500 Server Error 페이지 | ❌ | 미구현 |
| API 에러 핸들링 유틸 | ❌ | 미구현 |
| Skeleton 로딩 | ❌ | 미구현 |
| 공통 모달 | ❌ | 미구현 |

**필요 작업:**
- [ ] Toast Provider 및 useToast 훅 구현
- [ ] GlobalErrorBoundary 컴포넌트 구현
- [ ] NotFoundPage (404) 구현
- [ ] ServerErrorPage (500) 구현
- [ ] apiErrorHandler 유틸 함수 구현
- [ ] SkeletonCard, FullPageLoader 구현
- [ ] ConfirmModal, AlertModal 공통 모달 구현

---

## ❌ 미구현 EPIC (5개)

### EPIC0-FE-006: 회원가입 및 로그인 인증 UI PoC ⭐ 우선순위: Must
| 요구사항 | 필요 파일/컴포넌트 |
|----------|-------------------|
| 회원가입 페이지 | `src/pages/SignupPage.tsx` |
| 로그인 페이지 | `src/pages/LoginPage.tsx` |
| JWT 토큰 저장 및 관리 | localStorage / httpOnly Cookie |
| Protected Route | `src/components/ProtectedRoute.tsx` |
| 자동 토큰 갱신 | Axios Interceptor |
| 인증 상태 관리 | `src/stores/useAuthStore.ts` |

**필요 작업:**
- [ ] SignupPage 컴포넌트 (폼 검증 포함)
- [ ] LoginPage 컴포넌트
- [ ] useAuthStore 구현 (login, logout, refreshToken)
- [ ] Axios 인스턴스 및 Interceptor 설정
- [ ] ProtectedRoute 컴포넌트
- [ ] AuthController API 연동

---

### EPIC0-FE-007: 사용자 프로필 관리 UI PoC ⭐ 우선순위: Should
**의존성**: EPIC0-FE-006 필요

| 요구사항 | 필요 파일/컴포넌트 |
|----------|-------------------|
| 프로필 조회/수정 페이지 | `src/pages/ProfilePage.tsx` |
| 비밀번호 변경 폼 | `src/components/ChangePasswordForm.tsx` |
| 회원 탈퇴 모달 | `src/components/DeleteAccountModal.tsx` |
| 비밀번호 강도 표시 | Strength Meter 컴포넌트 |

**필요 작업:**
- [ ] ProfilePage (탭 형태: 프로필, 보안)
- [ ] ProfileEditForm 컴포넌트
- [ ] ChangePasswordForm (Strength Meter 포함)
- [ ] DeleteAccountModal 컴포넌트
- [ ] UserController API 연동

---

### EPIC0-FE-008: 프로젝트 대시보드 및 목록 관리 UI PoC ⭐ 우선순위: Must
**의존성**: EPIC0-FE-006, EPIC0-FE-001 필요

| 요구사항 | 필요 파일/컴포넌트 |
|----------|-------------------|
| 프로젝트 목록 페이지 | `src/pages/DashboardPage.tsx` |
| 프로젝트 카드 컴포넌트 | `src/components/ProjectCard.tsx` |
| 검색 바 | `src/components/SearchBar.tsx` |
| 정렬 드롭다운 | `src/components/SortDropdown.tsx` |
| 빈 상태 UI | `src/components/EmptyState.tsx` |

**필요 작업:**
- [ ] DashboardPage 컴포넌트
- [ ] ProjectCard (상태 뱃지, 진행률 바 포함)
- [ ] SearchBar 및 SortDropdown
- [ ] EmptyState 컴포넌트 (CTA 버튼 포함)
- [ ] useProjects 훅 (React Query 연동)
- [ ] 상태 필터 탭 (전체, 진행 중, 완료)

---

### EPIC0-FE-009: 문서 버전 관리 및 히스토리 UI PoC ⭐ 우선순위: Should
**의존성**: EPIC0-FE-003 필요

| 요구사항 | 필요 파일/컴포넌트 |
|----------|-------------------|
| 버전 목록 패널 | `src/components/VersionHistoryPanel.tsx` |
| 버전 목록 아이템 | `src/components/VersionListItem.tsx` |
| 버전 비교 뷰 | `src/components/DiffView.tsx` |
| 섹션 재생성 버튼 | `src/components/SectionRegenerateButton.tsx` |

**필요 작업:**
- [ ] VersionHistoryPanel 컴포넌트 (사이드바 형태)
- [ ] VersionListItem 컴포넌트
- [ ] 버전 선택 시 DocumentViewer에 해당 내용 로드
- [ ] Diff 라이브러리 연동 (선택적)
- [ ] BusinessPlanController API 연동

---

### EPIC0-FE-012: 재무 추정 미리보기 (독립형) UI PoC ⭐ 우선순위: Could
**의존성**: EPIC0-FE-004 필요

| 요구사항 | 필요 파일/컴포넌트 |
|----------|-------------------|
| 독립형 재무 계산기 페이지 | `src/pages/FinancialCalculatorPage.tsx` |
| 미리보기용 폼 | `src/components/PreviewFinancialForm.tsx` |
| CTA 배너 (로그인 유도) | `src/components/CTABanner.tsx` |

**필요 작업:**
- [ ] FinancialCalculatorPage (Public Route)
- [ ] PreviewFinancialForm 컴포넌트
- [ ] EPIC0-FE-004 차트 컴포넌트 재사용
- [ ] CTABanner 컴포넌트 (로그인 유도)
- [ ] URL 파라미터로 초기값 전달 (선택)
- [ ] FinancialPreviewController API 연동

---

## 📋 구현 우선순위 권장사항

### Phase 1: 인증 및 기반 시스템 (1주)
```
1. EPIC0-FE-006 (인증) - Must ⭐
   └─> 로그인/회원가입, JWT 토큰, Protected Route

2. EPIC0-FE-011 (공통 컴포넌트) - Must
   └─> Toast, Error Boundary, 404/500 페이지
```

### Phase 2: 대시보드 및 프로젝트 관리 (1주)
```
3. EPIC0-FE-008 (대시보드) - Must ⭐
   └─> 프로젝트 목록, 검색/필터/정렬, 빈 상태

4. EPIC0-FE-010 (내보내기 완성) - Must
   └─> 실제 다운로드, 형식 선택, 에러 처리
```

### Phase 3: 사용자 및 버전 관리 (1주)
```
5. EPIC0-FE-007 (프로필) - Should
   └─> 프로필 수정, 비밀번호 변경, 회원 탈퇴

6. EPIC0-FE-009 (버전 관리) - Should
   └─> 버전 목록, 미리보기, 비교 뷰
```

### Phase 4: 추가 기능 (선택)
```
7. EPIC0-FE-012 (독립형 계산기) - Could
   └─> 비로그인 재무 계산기, CTA 전환
```

---

## 🔧 필요한 추가 패키지

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "diff": "^5.0.0",
    "react-diff-viewer-continued": "^3.0.0"
  }
}
```

---

## 📁 필요한 새 파일 목록

### 페이지
```
src/pages/
├── LoginPage.tsx          # EPIC0-FE-006
├── SignupPage.tsx         # EPIC0-FE-006
├── DashboardPage.tsx      # EPIC0-FE-008
├── ProfilePage.tsx        # EPIC0-FE-007
├── NotFoundPage.tsx       # EPIC0-FE-011
├── ServerErrorPage.tsx    # EPIC0-FE-011
└── FinancialCalculatorPage.tsx  # EPIC0-FE-012
```

### 컴포넌트
```
src/components/
├── ProtectedRoute.tsx     # EPIC0-FE-006
├── ProjectCard.tsx        # EPIC0-FE-008
├── SearchBar.tsx          # EPIC0-FE-008
├── SortDropdown.tsx       # EPIC0-FE-008
├── EmptyState.tsx         # EPIC0-FE-008
├── VersionHistoryPanel.tsx # EPIC0-FE-009
├── ChangePasswordForm.tsx  # EPIC0-FE-007
├── DeleteAccountModal.tsx  # EPIC0-FE-007
├── GlobalErrorBoundary.tsx # EPIC0-FE-011
├── Toast/                  # EPIC0-FE-011
│   ├── ToastProvider.tsx
│   └── useToast.ts
└── Modal/                  # EPIC0-FE-011
    ├── ConfirmModal.tsx
    └── AlertModal.tsx
```

### Stores
```
src/stores/
└── useAuthStore.ts        # EPIC0-FE-006
```

### Hooks
```
src/hooks/
├── useAuth.ts             # EPIC0-FE-006
├── useProjects.ts         # EPIC0-FE-008
└── useExportDocument.ts   # EPIC0-FE-010
```

### Utils
```
src/lib/
├── axios.ts               # EPIC0-FE-006 (Axios 인스턴스)
├── apiErrorHandler.ts     # EPIC0-FE-011
└── downloadFile.ts        # EPIC0-FE-010
```

---

## 📈 완료 시 예상 효과

| 지표 | 현재 | 완료 후 |
|------|------|---------|
| EPIC 완료율 | 42% (5/12) | 100% (12/12) |
| Must 완료율 | 57% (4/7) | 100% (7/7) |
| 인증 시스템 | ❌ | ✅ |
| 에러 핸들링 | ❌ | ✅ |
| 대시보드 | ❌ | ✅ |
| 프로덕션 준비 | 부분적 | 완료 |

---

**생성일**: 2025년 12월 6일  
**버전**: 1.0.0

