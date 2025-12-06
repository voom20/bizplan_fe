# BizPlan - AI 기반 사업계획서 작성 플랫폼

<div align="center">

![BizPlan](https://img.shields.io/badge/BizPlan-AI%20Business%20Plan-22c55e?style=for-the-badge&logo=rocket&logoColor=white)

**초기 창업가를 위한 SaaS형 비즈니스 컨설팅 플랫폼**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ 특징

- 🌙 **다크 테마** - 눈의 피로를 줄이는 세련된 다크 모드 UI
- 🔮 **글래스모피즘** - 반투명 블러 효과의 현대적인 디자인
- 💚 **네온 액센트** - 그린, 시안, 바이올렛 네온 컬러 시스템
- ⚡ **실시간 저장** - 입력 즉시 자동 저장
- 📊 **재무 시뮬레이션** - 실시간 차트와 손익분기점 분석
- 🎯 **PMF 진단** - Product-Market Fit 점수 및 개선 제안

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
- **Auto-save**: 사용자 입력 1초 후 자동 저장, 우측 상단 저장 상태 표시
- **AI 사업계획서 생성**: 전문가급 사업계획서 자동 생성, 섹션별 "다시 쓰기"
- **재무 시뮬레이션**: LTV, CAC, LTV/CAC 비율, 12개월 손익분기점 분석
- **PMF 진단**: 10개 질문 기반 점수 산출, 리스크 및 개선 제언

---

## 🛠 기술 스택

### Core
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2 | UI 프레임워크 |
| TypeScript | 5.9 | 타입 안정성 |
| Vite | 7.2 | 빌드 도구 |

### Styling & UI
| 기술 | 용도 |
|------|------|
| Tailwind CSS | 유틸리티 기반 스타일링 |
| Lucide React | 아이콘 시스템 |
| clsx + tailwind-merge | 조건부 클래스 결합 |

### State & Data
| 기술 | 용도 |
|------|------|
| Zustand | 전역 상태 관리 (persist middleware) |
| React Router DOM v6 | 클라이언트 사이드 라우팅 |
| React Hook Form + Zod | 폼 관리 및 검증 |

### Visualization
| 기술 | 용도 |
|------|------|
| Recharts | 재무 차트 시각화 |
| React Markdown | 마크다운 렌더링 |

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

## 📁 프로젝트 구조

```
bizplan_fe/
├── src/
│   ├── components/
│   │   ├── ui/                      # 공통 UI 컴포넌트 (글래스모피즘 스타일)
│   │   │   ├── Button.tsx           # 네온 글로우 버튼
│   │   │   ├── Card.tsx             # 글래스 카드
│   │   │   ├── Input.tsx            # 글래스 입력 필드
│   │   │   ├── Textarea.tsx         # 글래스 텍스트 영역
│   │   │   ├── Badge.tsx            # 상태 배지
│   │   │   ├── Progress.tsx         # 네온 진행률 바
│   │   │   ├── Spinner.tsx          # 로딩 스피너
│   │   │   └── index.ts             # 컴포넌트 exports
│   │   ├── wizard/                  # Wizard 전용 컴포넌트
│   │   │   ├── QuestionForm.tsx     # 질문 폼
│   │   │   ├── FinancialSimulation.tsx  # 재무 시뮬레이션
│   │   │   └── PMFSurvey.tsx        # PMF 설문
│   │   ├── Layout.tsx               # 메인 레이아웃 (다크 테마)
│   │   └── SaveIndicator.tsx        # 저장 상태 표시
│   ├── pages/
│   │   ├── ProjectCreate.tsx        # 프로젝트 생성 (메인 페이지)
│   │   ├── WizardStep.tsx           # Wizard 단계별 페이지
│   │   └── BusinessPlanViewer.tsx   # 사업계획서 뷰어
│   ├── stores/
│   │   ├── useProjectStore.ts       # 프로젝트 상태 관리
│   │   ├── useWizardStore.ts        # Wizard 상태 관리
│   │   ├── useFinancialStore.ts     # 재무 상태 관리
│   │   └── usePMFStore.ts           # PMF 진단 상태 관리
│   ├── hooks/
│   │   ├── useAutoSave.ts           # Auto-save 커스텀 훅
│   │   ├── useFinancialCalc.ts      # 재무 계산 커스텀 훅
│   │   └── index.ts                 # 훅 exports
│   ├── types/
│   │   ├── index.ts                 # TypeScript 타입 정의
│   │   └── mockData.ts              # Mock 데이터
│   ├── lib/
│   │   └── utils.ts                 # 유틸리티 함수 (cn)
│   ├── App.tsx                      # 라우팅 설정
│   ├── main.tsx                     # 앱 진입점
│   └── index.css                    # 전역 스타일 (다크 테마)
├── public/                          # 정적 파일
├── index.html                       # HTML 엔트리
├── package.json                     # 프로젝트 설정
├── tailwind.config.js               # Tailwind 설정
├── vite.config.ts                   # Vite 설정
└── tsconfig.json                    # TypeScript 설정
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

### Components

- **글래스모피즘 카드**: `backdrop-blur-xl` + 반투명 배경
- **네온 버튼**: 그라디언트 배경 + `box-shadow` 글로우
- **입력 필드**: 포커스 시 네온 링 효과
- **진행률 바**: 그라디언트 + 쉐도우

### Animations

| 애니메이션 | 효과 |
|------------|------|
| `float` | 플로팅 오브 효과 (8s) |
| `fade-in` | 페이드 인 (0.6s) |
| `slide-up` | 슬라이드 업 (0.5s) |
| `scale-in` | 스케일 인 (0.3s) |
| `pulse-slow` | 느린 펄스 (4s) |
| `glow` | 네온 글로우 (2s) |

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
              [PDF/HWP 내보내기]
```

1. **입력**: Wizard에서 각 질문에 답변
2. **저장**: Zustand store에 실시간 저장 (LocalStorage persist)
3. **계산**: 재무 데이터 입력 시 자동 메트릭 계산
4. **생성**: Mock 데이터 기반 사업계획서 생성
5. **내보내기**: HWP/PDF 형식 다운로드 (시뮬레이션)

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

## 📝 주요 사용자 흐름

```
1. 시작     → 프로젝트 이름 입력 및 템플릿 선택
2. 입력     → 5단계 Wizard에서 각 질문에 답변
3. 재무     → 실시간 차트로 재무 건전성 확인
4. PMF 진단 → 설문 완료 후 진단 리포트 확인
5. 생성     → AI 사업계획서 자동 생성
6. 내보내기 → HWP/PDF 형식으로 다운로드
```

---

## 🚧 향후 개선 사항

- [ ] 실제 AI API 연동 (OpenAI, Anthropic, Google Gemini)
- [ ] 백엔드 연동 (사용자 인증, 프로젝트 클라우드 저장)
- [ ] 협업 기능 (팀원 초대, 댓글, 실시간 편집)
- [ ] 버전 히스토리 및 비교
- [ ] 템플릿 커스터마이징
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 모바일 앱 (React Native)

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
