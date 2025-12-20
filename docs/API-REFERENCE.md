# BizPlan API Reference

> 🚀 AI Co-Pilot for First-time Founders  
> 창업자를 위한 AI 사업계획서 자동 생성 플랫폼 백엔드 API

## 개요

| 항목 | 내용 |
|------|------|
| **Base URL (개발)** | `http://localhost:8080` |
| **Base URL (운영)** | `https://api.bizplan.vibe.com` (예정) |
| **API Version** | v1.0.0 |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **OpenAPI Spec** | http://localhost:8080/api-docs |

## 인증 방식

### JWT Bearer Token
- **Access Token**: 1시간 유효
- **Refresh Token**: 7일 유효

```
Authorization: Bearer {accessToken}
```

### 에러 응답 형식

```json
{
  "timestamp": "2025-01-01T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "에러 메시지",
  "path": "/api/v1/..."
}
```

---

## 🔐 Auth (인증 API)

### 회원가입
```
POST /api/v1/auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "company": "스타트업" // optional
}
```

**Response (201):**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "홍길동"
}
```

| Status | Description |
|--------|-------------|
| 201 | 회원가입 성공 |
| 400 | 유효성 검사 실패 |
| 409 | 이메일 중복 |

---

### 로그인
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | 로그인 성공 |
| 401 | 이메일 또는 비밀번호 불일치 |

---

### 토큰 갱신
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Status | Description |
|--------|-------------|
| 200 | 갱신 성공 |
| 401 | 유효하지 않은 리프레시 토큰 |

---

### 로그아웃
```
POST /api/v1/auth/logout
🔒 Authorization Required
```

**Response (200):**
```json
{
  "message": "로그아웃 성공"
}
```

---

## 👤 Users (사용자 API)

### 내 프로필 조회
```
GET /api/v1/users/me
🔒 Authorization Required
```

**Response (200):**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "company": "스타트업",
  "createdAt": "2025-01-01T12:00:00",
  "updatedAt": "2025-01-01T12:00:00"
}
```

---

### 프로필 수정
```
PATCH /api/v1/users/me
🔒 Authorization Required
```

**Request Body:**
```json
{
  "name": "김철수",
  "company": "새로운 회사"
}
```

**Response (200):** 수정된 사용자 정보

---

### 비밀번호 변경
```
PUT /api/v1/users/me/password
🔒 Authorization Required
```

**Request Body:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword123",
  "newPasswordConfirm": "newPassword123"
}
```

| Status | Description |
|--------|-------------|
| 200 | 변경 성공 |
| 400 | 비밀번호 불일치 또는 잘못된 요청 |

---

### 회원 탈퇴
```
DELETE /api/v1/users/me
🔒 Authorization Required
```

**Request Body:**
```json
{
  "password": "currentPassword123"
}
```

---

## 📁 Projects (프로젝트 API)

### 템플릿 목록 조회
```
GET /projects/templates
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | 템플릿 카테고리 필터 (government, bank, investor) |

**Response (200):**
```json
{
  "templates": [
    {
      "code": "pre-startup",
      "name": "예비창업패키지",
      "description": "예비 창업자를 위한 정부지원 사업계획서",
      "category": "government"
    }
  ]
}
```

---

### 프로젝트 목록 조회
```
GET /projects
🔒 Authorization Required
```

**Response (200):**
```json
[
  {
    "projectId": "project-uuid",
    "templateCode": "pre-startup",
    "title": "내 사업계획서",
    "status": "DRAFT",
    "createdAt": "2025-01-01T12:00:00",
    "updatedAt": "2025-01-01T12:00:00"
  }
]
```

**Project Status:**
| Status | Description |
|--------|-------------|
| DRAFT | 작성 중 |
| IN_PROGRESS | 진행 중 |
| SUBMITTED | 제출됨 |
| APPROVED | 승인됨 |
| REJECTED | 거절됨 |

---

### 프로젝트 생성
```
POST /projects
🔒 Authorization Required
```

**Request Body:**
```json
{
  "templateCode": "pre-startup",
  "title": "내 사업계획서" // optional, max 255자
}
```

**Response (201):**
```json
{
  "projectId": "project-uuid",
  "templateCode": "pre-startup",
  "title": "내 사업계획서",
  "status": "DRAFT",
  "wizardAnswers": {},
  "createdAt": "2025-01-01T12:00:00",
  "updatedAt": "2025-01-01T12:00:00"
}
```

| Status | Description |
|--------|-------------|
| 201 | 생성 성공 |
| 400 | 잘못된 템플릿 코드 |
| 403 | 프로젝트 생성 한도 초과 |

---

### 프로젝트 상세 조회
```
GET /projects/{projectId}
🔒 Authorization Required
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| projectId | string | 프로젝트 ID |

**Response (200):** 프로젝트 상세 정보

---

## 🧙 Wizard (위자드 API)

### 전체 답변 조회
```
GET /projects/{projectId}/wizard/answers
🔒 Authorization Required
```

**Response (200):**
```json
{
  "projectId": "project-uuid",
  "answers": {
    "step1": {
      "businessName": "우리 스타트업",
      "businessDescription": "혁신적인 서비스"
    },
    "step2": {
      "targetMarket": "2030 직장인",
      "marketSize": "100억"
    }
  },
  "completedSteps": 2,
  "totalSteps": 6
}
```

---

### 단계별 답변 조회
```
GET /projects/{projectId}/wizard/steps/{stepId}
🔒 Authorization Required
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| projectId | string | 프로젝트 ID |
| stepId | string | 단계 ID (step1, step2, ...) |

---

### 답변 저장
```
POST /projects/{projectId}/wizard/steps
🔒 Authorization Required
```

**Request Body:**
```json
{
  "stepId": "step1",
  "answers": {
    "businessName": "우리 스타트업",
    "businessDescription": "혁신적인 서비스를 제공합니다"
  }
}
```

**Response (200):**
```json
{
  "projectId": "project-uuid",
  "answers": { ... },
  "completedSteps": 1,
  "totalSteps": 6
}
```

---

## 💰 Financials (재무 API)

### 재무 추정 생성
```
POST /projects/{projectId}/financials/generate
🔒 Authorization Required
```

**Request Body:**
```json
{
  "initialCapital": 50000000,           // 초기 자본금 (원)
  "averageRevenuePerUser": 30000,       // ARPU (원)
  "monthlyMarketingBudget": 5000000,    // 월 마케팅 예산 (원)
  "customerAcquisitionCost": 10000,     // CAC (원)
  "monthlyChurnRate": 0.05,             // 월 이탈률 (0~1)
  "monthlyFixedCosts": 10000000,        // 월 고정비 (원)
  "variableCostRate": 0.3,              // 변동비율 (0~1), optional
  "initialCustomers": 100,               // 초기 고객 수, optional
  "projectionMonths": 36                 // 추정 기간 (개월), optional
}
```

**Response (200):**
```json
{
  "projectId": "project-uuid",
  "monthlyPL": [
    {
      "month": 1,
      "revenue": 3000000,
      "costs": 15000000,
      "profit": -12000000,
      "customers": 100
    }
  ],
  "yearlySummary": [
    {
      "year": 1,
      "totalRevenue": 50000000,
      "totalCosts": 180000000,
      "netProfit": -130000000
    }
  ],
  "unitEconomics": {
    "ltv": 600000,
    "cac": 10000,
    "ltvCacRatio": 60,
    "paybackPeriodMonths": 3
  }
}
```

---

### 재무 추정 미리보기 (비로그인)
```
POST /financials/preview
```

> ⚡ 프로젝트 연동 없이 재무 추정 결과를 미리 확인. 결과는 저장되지 않음.

**Request/Response:** 위의 재무 추정 생성과 동일

---

## 📄 Business Plan Documents (사업계획서 API)

### 사업계획서 전체 생성
```
POST /projects/{projectId}/documents/business-plan/generate
🔒 Authorization Required
```

> ⚠️ 동기 호출, 최대 60초 소요

**Response (200):**
```json
{
  "documentId": "doc-uuid",
  "projectId": "project-uuid",
  "version": 1,
  "status": "COMPLETED",
  "sections": [
    {
      "sectionType": "EXECUTIVE_SUMMARY",
      "title": "사업 개요",
      "content": "..."
    },
    {
      "sectionType": "MARKET_ANALYSIS",
      "title": "시장 분석",
      "content": "..."
    }
  ],
  "createdAt": "2025-01-01T12:00:00"
}
```

| Status | Description |
|--------|-------------|
| 200 | 생성 성공 |
| 400 | Wizard 미완료 |
| 500 | AI 엔진 오류 |

---

### 최신 사업계획서 조회
```
GET /projects/{projectId}/documents/business-plan/latest
🔒 Authorization Required
```

---

### 문서 버전 목록
```
GET /projects/{projectId}/documents/business-plan/versions
🔒 Authorization Required
```

**Response (200):**
```json
[
  {
    "documentId": "doc-uuid-1",
    "version": 2,
    "status": "COMPLETED",
    "createdAt": "2025-01-02T12:00:00"
  },
  {
    "documentId": "doc-uuid-2",
    "version": 1,
    "status": "COMPLETED",
    "createdAt": "2025-01-01T12:00:00"
  }
]
```

---

### 특정 문서 조회
```
GET /projects/{projectId}/documents/{documentId}
🔒 Authorization Required
```

---

### 섹션 재생성
```
POST /projects/{projectId}/documents/{documentId}/sections/{sectionType}/regenerate
🔒 Authorization Required
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| sectionType | string | 섹션 타입 (EXECUTIVE_SUMMARY, MARKET_ANALYSIS 등) |

---

## 📥 Document Export (내보내기 API)

### 사업계획서 내보내기
```
GET /projects/{projectId}/export
🔒 Authorization Required
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| format | string | pdf | 출력 형식 (pdf, html) |

**Response:** 바이너리 파일 (PDF 또는 HTML)

---

### 특정 버전 내보내기
```
GET /projects/{projectId}/export/versions/{version}
🔒 Authorization Required
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| version | integer | 문서 버전 번호 |

---

### 지원 형식 목록
```
GET /projects/{projectId}/export/formats
🔒 Authorization Required
```

**Response (200):**
```json
{
  "formats": ["pdf", "html"]
}
```

---

## 프론트엔드 연동 가이드

### API 타입 매핑

| Backend Schema | Frontend Type |
|----------------|---------------|
| `TokenResponse` | `LoginResponse` |
| `ProjectResponse` | `ProjectDetailResponse` |
| `WizardAnswersResponse` | `WizardData` |
| `FinancialAssumptionsRequest` | `FinancialSimulationRequest` |
| `FinancialProjectionResponse` | `FinancialSimulationResponse` |
| `BusinessPlanDocumentResponse` | `BusinessPlanResponse` |

### 엔드포인트 매핑

| Service | Method | Frontend Path | Backend Path |
|---------|--------|---------------|--------------|
| authService | login | `/auth/login` | `/api/v1/auth/login` |
| authService | signup | `/auth/signup` | `/api/v1/auth/signup` |
| authService | refresh | `/auth/refresh` | `/api/v1/auth/refresh` |
| authService | logout | `/auth/logout` | `/api/v1/auth/logout` |
| authService | getMe | `/auth/me` | `/api/v1/users/me` |
| projectService | getProjects | `/projects` | `/projects` |
| projectService | createProject | `/projects` | `/projects` |
| projectService | getProject | `/projects/{id}` | `/projects/{projectId}` |
| wizardService | getAnswers | `/wizard/answers` | `/projects/{projectId}/wizard/answers` |
| wizardService | saveStepAnswers | `/wizard/steps/{stepId}/answers` | `/projects/{projectId}/wizard/steps` |
| financialService | runSimulation | `/financial/simulation` | `/projects/{projectId}/financials/generate` |
| businessPlanService | generateBusinessPlan | `/business-plan/generate` | `/projects/{projectId}/documents/business-plan/generate` |
| businessPlanService | getBusinessPlan | `/business-plan` | `/projects/{projectId}/documents/business-plan/latest` |

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-12-20 | v1.0.0 | 초기 API 문서 작성 |

