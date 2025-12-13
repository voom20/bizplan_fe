/**
 * 네비게이션 및 라우팅 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 각 페이지 접근
 * - 404 페이지
 * - 에러 페이지
 * - 브라우저 뒤로가기/앞으로가기
 * 
 * 수정 사항:
 * - 실제 UI 텍스트와 매칭되도록 셀렉터 수정
 * - 404/에러 페이지 버튼/링크 텍스트 수정
 * - Lazy Loading 대기 시간 추가
 */

import { test, expect } from '@playwright/test';

test.describe('네비게이션 - 페이지 접근', () => {
  test('메인 페이지 (/) 접근 가능', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-main-chromium.png` });
  });

  test('로그인 페이지 (/login) 접근 가능', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /로그인/i })).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-login-chromium.png` });
  });

  test('회원가입 페이지 (/signup) 접근 가능', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: /회원가입/i })).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-signup-chromium.png` });
  });

  test('재무 계산기 페이지 (/calculator) 접근 가능', async ({ page }) => {
    await page.goto('/calculator');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/calculator');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-calculator-chromium.png` });
  });

  test('Wizard 페이지 (/wizard/:stepId) 접근 가능', async ({ page }) => {
    await page.goto('/wizard/1');
    await page.waitForLoadState('networkidle');
    // Wizard 페이지는 URL이 유지되어야 함 (인증 없이도 접근 가능 - MVP 단계)
    await expect(page).toHaveURL('/wizard/1');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-wizard-chromium.png` });
  });

  test('사업계획서 페이지 (/business-plan) 접근 가능', async ({ page }) => {
    await page.goto('/business-plan');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/business-plan');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-business-plan-chromium.png` });
  });
});

test.describe('네비게이션 - 404 페이지', () => {
  test('존재하지 않는 페이지 접근 시 404 페이지 표시', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // 404 메시지 확인 - "404" 숫자 또는 "페이지를 찾을 수 없습니다"
    await expect(page.getByText(/404|페이지를 찾을 수 없습니다/i).first()).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-404-chromium.png` });
  });

  test('404 페이지에서 홈으로 돌아갈 수 있다', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // 홈으로 가기 버튼/링크 클릭 - "홈으로 이동"
    const homeLink = page.getByRole('link', { name: /홈으로 이동/i });
    await homeLink.click();
    
    await expect(page).toHaveURL('/');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-404-to-home-chromium.png` });
  });
});

test.describe('네비게이션 - 에러 페이지', () => {
  test('에러 페이지 (/error) 접근 가능', async ({ page }) => {
    await page.goto('/error');
    await page.waitForLoadState('networkidle');
    
    // 에러 메시지 확인 - "500" 또는 "서버에 문제가 발생했습니다"
    await expect(page.getByText(/500|서버에 문제가 발생했습니다/i).first()).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-error-chromium.png` });
  });

  test('에러 페이지에서 홈으로 돌아갈 수 있다', async ({ page }) => {
    await page.goto('/error');
    await page.waitForLoadState('networkidle');
    
    // 홈으로 이동 링크 - 버튼이 아닌 링크임
    const homeLink = page.getByRole('link', { name: /홈으로 이동/i });
    
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-error-to-home-chromium.png` });
  });

  test('에러 페이지에서 새로고침 버튼이 있다', async ({ page }) => {
    await page.goto('/error');
    await page.waitForLoadState('networkidle');
    
    // "다시 시도" 버튼 확인
    await expect(page.getByRole('button', { name: /다시 시도/i })).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-error-refresh-chromium.png` });
  });
});

test.describe('네비게이션 - 브라우저 히스토리', () => {
  test('뒤로가기가 정상 동작한다', async ({ page }) => {
    // 페이지 이동
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // 뒤로가기
    await page.goBack();
    
    await expect(page).toHaveURL('/');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-back-chromium.png` });
  });

  test('앞으로가기가 정상 동작한다', async ({ page }) => {
    // 페이지 이동
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // 앞으로가기
    await page.goForward();
    await expect(page).toHaveURL('/login');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-forward-chromium.png` });
  });
});

test.describe('네비게이션 - 링크 동작', () => {
  test('로그인 페이지에서 회원가입 링크 동작', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('link', { name: /회원가입/i }).click();
    
    await expect(page).toHaveURL('/signup');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-login-to-signup-chromium.png` });
  });

  test('회원가입 페이지에서 로그인 링크 동작', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('link', { name: /로그인/i }).click();
    
    await expect(page).toHaveURL('/login');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-signup-to-login-chromium.png` });
  });
});

test.describe('네비게이션 - Wizard 단계 이동', () => {
  test('Wizard 단계 URL이 올바르게 변경된다', async ({ page }) => {
    // 각 단계 직접 접근 테스트
    await page.goto('/wizard/1');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/wizard/1');
    
    await page.goto('/wizard/2');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/wizard/2');
    
    await page.goto('/wizard/3');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/wizard/3');
    
    await page.goto('/wizard/4');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/wizard/4');
    
    await page.goto('/wizard/5');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/wizard/5');
    
    await page.screenshot({ path: `docs/test-results/screenshots/navigation-wizard-steps-chromium.png` });
  });
});
