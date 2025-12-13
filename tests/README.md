# E2E 테스트 가이드

## 📋 테스트 시나리오 개요

| 파일 | 테스트 영역 | 시나리오 수 |
|------|-------------|-------------|
| `auth.spec.ts` | 인증 (로그인/회원가입) | 12 |
| `wizard.spec.ts` | Wizard 프로젝트 생성 | 15 |
| `business-plan.spec.ts` | 사업계획서 뷰어 | 10 |
| `calculator.spec.ts` | 재무 계산기 | 9 |
| `profile.spec.ts` | 프로필 관리 | 11 |
| `navigation.spec.ts` | 네비게이션/라우팅 | 13 |

---

## 🚀 테스트 실행 방법

### 1. Playwright 설치

```bash
# 의존성 설치
npm install -D @playwright/test

# 브라우저 설치
npx playwright install
```

### 2. 테스트 실행

```bash
# 모든 테스트 실행
npx playwright test

# 헤드리스 모드 비활성화 (브라우저 보이기)
npx playwright test --headed

# UI 모드로 실행 (인터랙티브)
npx playwright test --ui

# 특정 테스트 파일 실행
npx playwright test tests/auth.spec.ts

# 특정 테스트 케이스 실행
npx playwright test -g "로그인 페이지가 정상적으로 렌더링된다"

# Chrome만 실행
npx playwright test --project=chromium

# 디버그 모드
npx playwright test --debug
```

### 3. 테스트 리포트

```bash
# 테스트 실행 후 리포트 보기
npx playwright show-report
```

---

## 📁 테스트 파일 구조

```
tests/
├── auth.spec.ts           # 인증 테스트
│   ├── 로그인 페이지 렌더링
│   ├── 로그인 폼 유효성 검사
│   ├── 로그인 성공/실패
│   ├── 회원가입 페이지 렌더링
│   └── 회원가입 폼 유효성 검사
│
├── wizard.spec.ts         # Wizard 테스트
│   ├── 프로젝트 생성
│   ├── 템플릿 선택
│   ├── 단계별 이동
│   ├── 재무 시뮬레이션
│   └── PMF 진단
│
├── business-plan.spec.ts  # 사업계획서 테스트
│   ├── 뷰어 렌더링
│   ├── 내보내기 (PDF/HTML)
│   ├── 버전 히스토리
│   └── 섹션 재생성
│
├── calculator.spec.ts     # 재무 계산기 테스트
│   ├── 페이지 렌더링
│   ├── 입력 폼 동작
│   ├── 실시간 계산
│   └── CTA 배너
│
├── profile.spec.ts        # 프로필 테스트
│   ├── 프로필 편집
│   ├── 비밀번호 변경
│   └── 계정 삭제
│
├── navigation.spec.ts     # 네비게이션 테스트
│   ├── 페이지 접근
│   ├── 404 페이지
│   ├── 에러 페이지
│   └── 브라우저 히스토리
│
└── README.md              # 이 문서
```

---

## 🧪 테스트 시나리오 상세

### 1. 인증 테스트 (auth.spec.ts)

#### 로그인
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 페이지 렌더링 | 로그인 페이지 접근 | 이메일, 비밀번호 필드, 로그인 버튼 표시 |
| 빈 폼 제출 | 아무것도 입력 안하고 제출 | 유효성 에러 메시지 표시 |
| 잘못된 이메일 | 이메일 형식 오류 | "올바른 이메일 형식" 에러 |
| 짧은 비밀번호 | 8자 미만 비밀번호 | "8자 이상" 에러 |
| 로그인 성공 | 올바른 자격 증명 | 메인 페이지로 이동 |

#### 회원가입
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 페이지 렌더링 | 회원가입 페이지 접근 | 모든 입력 필드 표시 |
| 비밀번호 불일치 | 확인 비밀번호 다름 | 불일치 에러 표시 |
| 강도 표시기 | 비밀번호 입력 | 강도 바 업데이트 |

---

### 2. Wizard 테스트 (wizard.spec.ts)

#### 프로젝트 생성
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 메인 페이지 | 페이지 접근 | 템플릿 카드 3개 표시 |
| 템플릿 선택 | 카드 클릭 | 선택 상태 표시 (border 변경) |
| 프로젝트 생성 | 이름 + 템플릿 후 시작 | /wizard/1로 이동 |

#### 단계별 진행
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 다음 버튼 | 다음 클릭 | Step 2로 이동 |
| 이전 버튼 | 이전 클릭 | 이전 Step으로 이동 |
| 진행률 표시 | 사이드바 확인 | 진행률 바 표시 |
| 입력 저장 | 텍스트 입력 | 값 저장됨 |

#### 재무 시뮬레이션 (Step 4)
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 페이지 렌더링 | Step 4 접근 | 입력 폼 + 차트 표시 |
| 숫자 입력 | 고객 수 입력 | 차트 업데이트 |

#### PMF 진단 (Step 5)
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 페이지 렌더링 | Step 5 접근 | 설문 질문 표시 |
| 답변 선택 | 버튼 클릭 | 점수 업데이트 |

---

### 3. 사업계획서 테스트 (business-plan.spec.ts)

#### 뷰어
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 페이지 렌더링 | 페이지 접근 | 섹션 목록 + 내용 표시 |

#### 내보내기
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 드롭다운 열기 | 내보내기 버튼 클릭 | PDF/HTML 옵션 표시 |
| PDF 선택 | PDF 클릭 | 다운로드 시작 |
| HTML 선택 | HTML 클릭 | 다운로드 시작 |

#### 버전 히스토리
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 패널 열기 | 버전 버튼 클릭 | 버전 목록 표시 |
| 버전 선택 | 항목 클릭 | 해당 버전 내용 표시 |

---

### 4. 재무 계산기 테스트 (calculator.spec.ts)

| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 페이지 렌더링 | /calculator 접근 | 입력 폼 표시 |
| 값 입력 | 숫자 입력 | 실시간 계산 결과 |
| 지표 표시 | 입력 후 | LTV/CAC/손익분기점 카드 |
| 차트 표시 | 입력 후 | Recharts 차트 렌더링 |
| CTA 배너 | 비로그인 시 | 로그인/가입 유도 배너 |
| LTV/CAC 경고 | 비율 < 3 | 경고 메시지 표시 |

---

### 5. 프로필 테스트 (profile.spec.ts)

#### 프로필 편집
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 페이지 렌더링 | /profile 접근 | 탭 + 폼 표시 |
| 이름 수정 | 새 이름 입력 | 값 변경됨 |

#### 비밀번호 변경
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 폼 표시 | 보안 탭 클릭 | 비밀번호 폼 표시 |
| 불일치 에러 | 확인 비밀번호 다름 | 에러 메시지 |

#### 계정 삭제
| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 모달 열기 | 삭제 버튼 클릭 | 확인 모달 표시 |
| 취소 | 취소 클릭 | 모달 닫힘 |

---

### 6. 네비게이션 테스트 (navigation.spec.ts)

| 시나리오 | 설명 | 예상 결과 |
|----------|------|-----------|
| 메인 페이지 | / 접근 | 정상 렌더링 |
| 로그인 페이지 | /login 접근 | 정상 렌더링 |
| 404 페이지 | 없는 URL 접근 | 404 페이지 표시 |
| 에러 페이지 | /error 접근 | 에러 페이지 표시 |
| 뒤로가기 | 브라우저 뒤로가기 | 이전 페이지 |
| 앞으로가기 | 브라우저 앞으로가기 | 다음 페이지 |

---

## ⚙️ 설정

### playwright.config.ts 주요 설정

```typescript
{
  testDir: './tests',           // 테스트 디렉토리
  fullyParallel: true,          // 병렬 실행
  retries: process.env.CI ? 2 : 0,  // CI에서 재시도
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',     // 자동 서버 실행
    url: 'http://localhost:5173',
  },
}
```

### 브라우저 프로젝트

- Chromium (Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

---

## 📊 CI/CD 통합

### GitHub Actions 예시

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🔧 트러블슈팅

### 테스트 실패 시

1. **스크린샷 확인**: `test-results/` 폴더
2. **트레이스 확인**: `npx playwright show-trace trace.zip`
3. **디버그 모드**: `npx playwright test --debug`
4. **특정 테스트만 실행**: `npx playwright test -g "테스트명"`

### 타임아웃 이슈

```typescript
// 특정 테스트에 타임아웃 설정
test('느린 테스트', async ({ page }) => {
  test.setTimeout(60000); // 60초
  // ...
});
```

### 셀렉터 찾기

```bash
# 코드젠 모드로 셀렉터 확인
npx playwright codegen http://localhost:5173
```

