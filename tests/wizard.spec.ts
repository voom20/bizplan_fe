/**
 * Wizard 관련 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 프로젝트 생성 및 템플릿 선택
 * - Wizard 단계별 이동
 * - 질문 폼 입력 및 저장
 * - 진행률 표시
 */

import { test, expect } from '@playwright/test';

test.describe('프로젝트 생성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('메인 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 제목 확인
    await expect(page.getByText(/사업계획서/i)).toBeVisible();
    
    // 템플릿 카드들 확인
    await expect(page.getByText(/예비창업패키지/i)).toBeVisible();
    await expect(page.getByText(/초기창업패키지/i)).toBeVisible();
    await expect(page.getByText(/은행용 대출/i)).toBeVisible();
  });

  test('프로젝트 이름 입력 필드가 있다', async ({ page }) => {
    await expect(page.getByPlaceholder(/프로젝트|이름/i)).toBeVisible();
  });

  test('템플릿 카드를 선택할 수 있다', async ({ page }) => {
    // 예비창업패키지 선택
    await page.getByText(/예비창업패키지/i).click();
    
    // 선택된 상태 확인 (클래스나 스타일 변화)
    const card = page.locator('[class*="border-neon"]').first();
    await expect(card).toBeVisible();
  });

  test('프로젝트 생성 후 Wizard로 이동한다', async ({ page }) => {
    // 프로젝트 이름 입력
    await page.getByPlaceholder(/프로젝트|이름/i).fill('테스트 프로젝트');
    
    // 템플릿 선택
    await page.getByText(/예비창업패키지/i).click();
    
    // 시작 버튼 클릭
    await page.getByRole('button', { name: /시작|생성/i }).click();
    
    // Wizard 페이지로 이동 확인
    await expect(page).toHaveURL(/\/wizard\/1/);
  });
});

test.describe('Wizard 단계별 진행', () => {
  test.beforeEach(async ({ page }) => {
    // 프로젝트 생성 후 Wizard 시작
    await page.goto('/');
    await page.getByPlaceholder(/프로젝트|이름/i).fill('테스트 프로젝트');
    await page.getByText(/예비창업패키지/i).click();
    await page.getByRole('button', { name: /시작|생성/i }).click();
  });

  test('Step 1: 아이템 개요 페이지가 렌더링된다', async ({ page }) => {
    await expect(page).toHaveURL(/\/wizard\/1/);
    
    // 질문 폼 확인
    await expect(page.getByText(/사업 아이템|아이템 개요/i)).toBeVisible();
  });

  test('다음 버튼으로 Step 2로 이동할 수 있다', async ({ page }) => {
    // 다음 버튼 클릭
    await page.getByRole('button', { name: /다음/i }).click();
    
    // Step 2로 이동 확인
    await expect(page).toHaveURL(/\/wizard\/2/);
  });

  test('이전 버튼으로 뒤로 이동할 수 있다', async ({ page }) => {
    // Step 2로 이동
    await page.getByRole('button', { name: /다음/i }).click();
    await expect(page).toHaveURL(/\/wizard\/2/);
    
    // 이전 버튼 클릭
    await page.getByRole('button', { name: /이전/i }).click();
    
    // Step 1로 돌아감 확인
    await expect(page).toHaveURL(/\/wizard\/1/);
  });

  test('사이드바에서 진행 상태를 확인할 수 있다', async ({ page }) => {
    // 사이드바 진행률 확인
    await expect(page.locator('[class*="progress"]')).toBeVisible();
  });

  test('질문에 답변을 입력할 수 있다', async ({ page }) => {
    // 텍스트 입력 필드 찾기
    const textarea = page.locator('textarea').first();
    
    if (await textarea.isVisible()) {
      await textarea.fill('테스트 답변입니다.');
      
      // 입력 값 확인
      await expect(textarea).toHaveValue('테스트 답변입니다.');
    }
  });
});

test.describe('Wizard - 재무 시뮬레이션 (Step 4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wizard/4');
  });

  test('재무 시뮬레이션 페이지가 렌더링된다', async ({ page }) => {
    // 재무 관련 입력 필드 확인
    await expect(page.getByText(/고객 수|월 예상 고객/i)).toBeVisible();
  });

  test('재무 지표가 표시된다', async ({ page }) => {
    // 핵심 지표 확인
    await expect(page.getByText(/LTV|매출|수익/i)).toBeVisible();
  });

  test('숫자 입력 시 차트가 업데이트된다', async ({ page }) => {
    // 고객 수 입력
    const input = page.locator('input[type="number"]').first();
    
    if (await input.isVisible()) {
      await input.fill('100');
      
      // 차트 영역 확인
      await expect(page.locator('[class*="recharts"]')).toBeVisible();
    }
  });
});

test.describe('Wizard - PMF 진단 (Step 5)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wizard/5');
  });

  test('PMF 설문 페이지가 렌더링된다', async ({ page }) => {
    // PMF 관련 제목 확인
    await expect(page.getByText(/PMF|Product-Market Fit/i)).toBeVisible();
  });

  test('설문 질문이 표시된다', async ({ page }) => {
    // 설문 카드 확인
    await expect(page.locator('[class*="card"]')).toHaveCount({ min: 1 });
  });

  test('답변 선택 시 점수가 업데이트된다', async ({ page }) => {
    // 답변 버튼 클릭
    const answerButtons = page.locator('button').filter({ hasText: /매우|보통|약간/i });
    
    if (await answerButtons.first().isVisible()) {
      await answerButtons.first().click();
      
      // 점수나 진행률 업데이트 확인
      await expect(page.locator('[class*="progress"]')).toBeVisible();
    }
  });
});

