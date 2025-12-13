# BizPlan - AI 기반 사업계획서 작성 플랫폼

<div align="center">

![BizPlan](https://img.shields.io/badge/BizPlan-AI%20Business%20Plan-22c55e?style=for-the-badge&logo=rocket&logoColor=white)

**초기 창업가를 위한 SaaS형 비즈니스 컨설팅 플랫폼**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev/)

</div>

---

## ✨ 특징

- 🌙 **다크 테마** - 눈의 피로를 줄이는 세련된 다크 모드 UI
- 🔮 **글래스모피즘** - 반투명 블러 효과의 현대적인 디자인
- 💚 **네온 액센트** - 그린, 시안, 바이올렛 네온 컬러 시스템
- ⚡ **실시간 저장** - 입력 즉시 자동 저장
- 📊 **재무 시뮬레이션** - 실시간 차트와 손익분기점 분석
- 🎯 **PMF 진단** - Product-Market Fit 점수 및 개선 제안
- 🔐 **인증 시스템** - 로그인/회원가입 및 프로필 관리
- 📄 **문서 내보내기** - PDF/HTML 형식 지원
- 📜 **버전 관리** - 문서 히스토리 및 비교 기능

---

## 🚀 주요 기능

### 1. 프로젝트 생성 및 템플릿 선택
| 템플릿 | 설명 | 대상 |
|--------|------|------|
| 🚀 **예비창업패키지** | 아이디어 검증 중심 | 창업 준비 단계 |
| 💼 **초기창업패키지** | PMF 검증 및 성장 전략 | 1-2년차 스타트업 |
| 🏦 **은행용 대출** | 담보/신용 분석, 상환 계획 | 금융기관 대출 심사용 |

### 2. 5단계 Wizard 기반 입력
| 단계 | 내용 |
|------|------|
| **Step 1** | 아이템 개요 - 사업 아이템, 문제/솔루션, 타겟 고객 |
| **Step 2** | 시장 분석 - TAM/SAM/SOM, 경쟁 분석, 경쟁 우위 |
| **Step 3** | 실현 방안 - 비즈니스 모델, 수익원, 마케팅 전략 |
| **Step 4** | 재무 계획 - 재무 시뮬레이션 및 실시간 차트 |
| **Step 5** | PMF 진단 - Product-Market Fit 설문 및 리포트 |

### 3. 핵심 기능
- **Auto-save**: 사용자 입력 1초 후 자동 저장
- **AI 사업계획서 생성**: 전문가급 사업계획서 자동 생성
- **재무 시뮬레이션**: LTV, CAC, LTV/CAC 비율, 손익분기점 분석
- **PMF 진단**: 10개 질문 기반 점수 산출
- **문서 내보내기**: PDF/HTML 형식 다운로드
- **버전 히스토리**: 문서 변경 이력 관리

---

## 🛠 기술 스택

### Core
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.0 | UI 프레임워크 |
| TypeScript | 5.9.3 | 타입 안정성 |
| Vite | 7.2.4 | 빌드 도구 |

### Styling & UI
| 기술 | 버전 | 용도 |
|------|------|------|
| Tailwind CSS | 3.4.1 | 유틸리티 기반 스타일링 |
| Lucide React | 0.554.0 | 아이콘 시스템 |
| clsx | 2.1.1 | 조건부 클래스 결합 |

### State & Data
| 기술 | 버전 | 용도 |
|------|------|------|
| Zustand | 5.0.8 | 전역 상태 관리 |
| React Router DOM | 7.9.6 | 클라이언트 라우팅 |
| React Hook Form | 7.66.1 | 폼 관리 |
| Zod | 4.1.12 | 스키마 검증 |

### Visualization & Testing
| 기술 | 버전 | 용도 |
|------|------|------|
| Recharts | 3.4.1 | 재무 차트 시각화 |
| Playwright | latest | E2E 테스트 |

---

## 📦 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/voom20/bizplan_fe.git
cd bizplan_fe

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

개발 서버 실행 후 **http://localhost:5173** 에서 확인할 수 있습니다.

---

## 🧪 E2E 테스트

### Playwright 설치
```bash
npm install -D @playwright/test
npx playwright install
```

### 테스트 실행
```bash
# 모든 테스트 실행
npx playwright test

# UI 모드로 실행
npx playwright test --ui

# 특정 테스트 파일 실행
npx playwright test tests/auth.spec.ts

# 헤드리스 모드 비활성화 (브라우저 보이기)
npx playwright test --headed
```

### 테스트 시나리오
자세한 테스트 시나리오는 [`tests/`](./tests/) 디렉토리에서 확인할 수 있습니다.

---

## 📁 프로젝트 구조

```
bizplan_fe/
├── src/
│   ├── components/                  # 공용 컴포넌트
│   │   ├── index.ts                 # 통합 barrel export
│   │   ├── ui/                      # UI 프리미티브
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   ├── layout/                  # 레이아웃 컴포넌트
│   │   │   ├── Layout.tsx
│   │   │   ├── PageLoadingFallback.tsx
│   │   │   ├── ComponentLoadingFallback.tsx
│   │   │   └── index.ts
│   │   ├── feedback/                # 피드백 컴포넌트
│   │   │   ├── Toast/
│   │   │   ├── Modal/
│   │   │   ├── SaveIndicator.tsx
│   │   │   └── index.ts
│   │   ├── auth/                    # 인증 관련 컴포넌트
│   │   │   ├── AuthFormLayout.tsx
│   │   │   ├── PasswordInput.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── index.ts
│   │   └── financial/               # 재무 컴포넌트
│   │       ├── FinancialMetrics.tsx
│   │       ├── FinancialCharts.tsx
│   │       └── index.ts
│   │
│   ├── pages/                       # 페이지 (관련 컴포넌트 포함)
│   │   ├── ProjectCreate.tsx        # 프로젝트 생성 (메인)
│   │   ├── auth/                    # 인증 페이지
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── index.ts
│   │   ├── wizard/                  # 마법사 페이지
│   │   │   ├── WizardStep.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   ├── FinancialSimulation.tsx
│   │   │   ├── PMFSurvey.tsx
│   │   │   └── index.ts
│   │   ├── business-plan/           # 사업계획서 페이지
│   │   │   ├── BusinessPlanViewer.tsx
│   │   │   ├── ExportDropdown.tsx
│   │   │   ├── VersionHistoryPanel.tsx
│   │   │   ├── DiffView.tsx
│   │   │   └── index.ts
│   │   ├── calculator/              # 재무 계산기 페이지
│   │   │   ├── FinancialCalculatorPage.tsx
│   │   │   ├── PreviewFinancialForm.tsx
│   │   │   ├── CTABanner.tsx
│   │   │   └── index.ts
│   │   └── profile/                 # 프로필 페이지
│   │       ├── ProfilePage.tsx
│   │       ├── ProfileEditForm.tsx
│   │       ├── ChangePasswordForm.tsx
│   │       ├── DeleteAccountModal.tsx
│   │       └── index.ts
│   │
│   ├── error/                       # 에러 처리 통합
│   │   ├── GlobalErrorBoundary.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ServerErrorPage.tsx
│   │   ├── apiErrorHandler.ts
│   │   ├── errorTypes.ts
│   │   ├── errorMessages.ts
│   │   └── index.ts
│   │
│   ├── common/                      # 공통 유틸리티
│   │   ├── utils.ts
│   │   ├── axios.ts
│   │   ├── downloadFile.ts
│   │   └── index.ts
│   │
│   ├── stores/                      # Zustand 스토어
│   │   ├── useAuthStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useWizardStore.ts
│   │   ├── useFinancialStore.ts
│   │   └── usePMFStore.ts
│   │
│   ├── hooks/                       # 커스텀 훅
│   │   ├── useAutoSave.ts
│   │   ├── useFinancialCalc.ts
│   │   ├── useExportDocument.ts
│   │   └── index.ts
│   │
│   ├── types/                       # 타입 정의
│   │   ├── index.ts
│   │   └── mockData.ts
│   │
│   ├── router/                      # 라우팅
│   │   ├── AppRoutes.tsx
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── tests/                           # E2E 테스트
│   ├── auth.spec.ts
│   ├── wizard.spec.ts
│   ├── financial.spec.ts
│   └── business-plan.spec.ts
│
├── docs/                            # 프로젝트 문서
├── tasks/                           # 개선 작업 태스크
├── playwright.config.ts             # Playwright 설정
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎨 Import 패턴

### 컴포넌트 Import
```typescript
// 모든 컴포넌트를 @/components에서 import
import { 
  Button, 
  Input, 
  Card,
  Layout, 
  ToastProvider,
  Modal,
  ProtectedRoute,
  FinancialMetrics,
} from '@/components';
```

### 에러 처리 Import
```typescript
import { 
  GlobalErrorBoundary,
  handleApiError,
  AppError,
  ValidationError,
} from '@/error';
```

### 공통 유틸리티 Import
```typescript
import { cn, debounce, formatCurrency } from '@/common';
```

---

## 🎨 디자인 시스템

### Color Palette
| 카테고리 | 색상 | 용도 |
|----------|------|------|
| **Neon Green** | `#22c55e` ~ `#4ade80` | 주요 액센트, CTA 버튼 |
| **Cyan** | `#06b6d4` ~ `#22d3ee` | 보조 액센트, 시각적 강조 |
| **Violet** | `#8b5cf6` ~ `#a78bfa` | 보조 액센트, 배경 효과 |
| **Slate** | `#020617` ~ `#f8fafc` | 배경, 텍스트, 보더 |

### Typography
| 폰트 | 용도 |
|------|------|
| **Outfit** | 본문, UI 텍스트 |
| **Sora** | 헤딩, 강조 텍스트 |
| **JetBrains Mono** | 코드, 숫자 |

---

## 📊 데이터 흐름

```
[사용자 입력] → [Zustand Store] → [LocalStorage Persist]
                     ↓
              [재무 계산 Hook]
                     ↓
              [차트 렌더링]
                     ↓
           [AI 사업계획서 생성]
                     ↓
              [PDF/HTML 내보내기]
```

---

## 🔑 핵심 UX 특징

| 특징 | 설명 |
|------|------|
| 🧭 **직관적 네비게이션** | 좌측 사이드바에서 현재 진행 상황 확인 |
| ⚡ **실시간 피드백** | 입력 즉시 자동 저장 및 검증 |
| 🎯 **시각적 피드백** | 진행률 바, 완료 체크마크, 색상 코딩 |
| ✨ **부드러운 애니메이션** | 페이지 전환 및 상태 변화 시 효과 |
| 📱 **반응형 디자인** | 다양한 화면 크기 지원 |

---

## 📚 문서

| 문서 | 설명 |
|------|------|
| [컴포넌트 구조 분석](./docs/01-component-structure-analysis.md) | 컴포넌트 트리, 아키텍처 개요 |
| [코드 품질 평가](./docs/02-code-quality-assessment.md) | 가독성, 재사용성, 성능 평가 |
| [코드 문서화 가이드](./docs/03-code-documentation-guide.md) | 주석 작성 규칙 |
| [함수 호출 구조](./docs/04-function-call-hierarchy.md) | 페이지별 호출 구조, 데이터 흐름 |

---

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 라이선스

MIT License

---

<div align="center">

**Made with 💚 for early-stage entrepreneurs**

[📝 Issues](https://github.com/voom20/bizplan_fe/issues) · [🔀 Pull Requests](https://github.com/voom20/bizplan_fe/pulls)

</div>
