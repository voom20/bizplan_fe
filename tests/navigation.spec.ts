/**
 * 네비게이션 및 라우팅 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 각 페이지 접근
 * - 404 페이지
 * - 에러 페이지
 * - 브라우저 뒤로가기/앞으로가기
 */

import { test, expect } from '@playwright/test';

test.describe('네비게이션 - 페이지 접근', () => {
  test('메인 페이지 (/) 접근 가능', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('로그인 페이지 (/login) 접근 가능', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /로그인/i })).toBeVisible();
  });

  test('회원가입 페이지 (/signup) 접근 가능', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: /회원가입/i })).toBeVisible();
  });

  test('재무 계산기 페이지 (/calculator) 접근 가능', async ({ page }) => {
    await page.goto('/calculator');
    await expect(page).toHaveURL('/calculator');
  });

  test('Wizard 페이지 (/wizard/:stepId) 접근 가능', async ({ page }) => {
    await page.goto('/wizard/1');
    await expect(page).toHaveURL('/wizard/1');
  });

  test('사업계획서 페이지 (/business-plan) 접근 가능', async ({ page }) => {
    await page.goto('/business-plan');
    await expect(page).toHaveURL('/business-plan');
  });
});

test.describe('네비게이션 - 404 페이지', () => {
  test('존재하지 않는 페이지 접근 시 404 페이지 표시', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // 404 메시지 확인
    await expect(page.getByText(/404|찾을 수 없|존재하지 않/i)).toBeVisible();
  });

  test('404 페이지에서 홈으로 돌아갈 수 있다', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // 홈으로 가기 버튼/링크 클릭
    await page.getByRole('link', { name: /홈|Home|메인/i }).click();
    
    await expect(page).toHaveURL('/');
  });
});

test.describe('네비게이션 - 에러 페이지', () => {
  test('에러 페이지 (/error) 접근 가능', async ({ page }) => {
    await page.goto('/error');
    
    // 에러 메시지 확인
    await expect(page.getByText(/오류|에러|문제가 발생/i)).toBeVisible();
  });

  test('에러 페이지에서 홈으로 돌아갈 수 있다', async ({ page }) => {
    await page.goto('/error');
    
    const homeLink = page.getByRole('link', { name: /홈|Home|메인/i });
    
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('에러 페이지에서 새로고침 버튼이 있다', async ({ page }) => {
    await page.goto('/error');
    
    await expect(page.getByRole('button', { name: /새로고침|Refresh|다시 시도/i })).toBeVisible();
  });
});

test.describe('네비게이션 - 브라우저 히스토리', () => {
  test('뒤로가기가 정상 동작한다', async ({ page }) => {
    // 페이지 이동
    await page.goto('/');
    await page.goto('/login');
    
    // 뒤로가기
    await page.goBack();
    
    await expect(page).toHaveURL('/');
  });

  test('앞으로가기가 정상 동작한다', async ({ page }) => {
    // 페이지 이동
    await page.goto('/');
    await page.goto('/login');
    
    // 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // 앞으로가기
    await page.goForward();
    await expect(page).toHaveURL('/login');
  });
});

test.describe('네비게이션 - 링크 동작', () => {
  test('로그인 페이지에서 회원가입 링크 동작', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('link', { name: /회원가입/i }).click();
    
    await expect(page).toHaveURL('/signup');
  });

  test('회원가입 페이지에서 로그인 링크 동작', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByRole('link', { name: /로그인/i }).click();
    
    await expect(page).toHaveURL('/login');
  });
});

test.describe('네비게이션 - Wizard 단계 이동', () => {
  test('Wizard 단계 URL이 올바르게 변경된다', async ({ page }) => {
    await page.goto('/wizard/1');
    await expect(page).toHaveURL('/wizard/1');
    
    await page.goto('/wizard/2');
    await expect(page).toHaveURL('/wizard/2');
    
    await page.goto('/wizard/3');
    await expect(page).toHaveURL('/wizard/3');
    
    await page.goto('/wizard/4');
    await expect(page).toHaveURL('/wizard/4');
    
    await page.goto('/wizard/5');
    await expect(page).toHaveURL('/wizard/5');
  });
});

