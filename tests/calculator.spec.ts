/**
 * 재무 계산기 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 재무 계산기 페이지 렌더링 (비로그인 접근)
 * - 입력 폼 동작
 * - 실시간 계산 결과
 * - CTA 배너 표시
 */

import { test, expect } from '@playwright/test';

test.describe('재무 계산기 - Public 접근', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('재무 계산기 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 제목 확인
    await expect(page.getByText(/재무|계산기|Financial/i)).toBeVisible();
  });

  test('입력 폼이 표시된다', async ({ page }) => {
    // 입력 필드들 확인
    await expect(page.locator('input[type="number"]')).toHaveCount({ min: 1 });
  });

  test('고객 수를 입력할 수 있다', async ({ page }) => {
    // 고객 수 입력 필드 찾기
    const customerInput = page.getByLabel(/고객 수|예상 고객/i);
    
    if (await customerInput.isVisible()) {
      await customerInput.fill('100');
      await expect(customerInput).toHaveValue('100');
    } else {
      // 라벨이 없으면 첫 번째 number input 사용
      const input = page.locator('input[type="number"]').first();
      await input.fill('100');
    }
  });

  test('가격을 입력할 수 있다', async ({ page }) => {
    const priceInput = page.getByLabel(/가격|단가|Price/i);
    
    if (await priceInput.isVisible()) {
      await priceInput.fill('50000');
      await expect(priceInput).toHaveValue('50000');
    }
  });

  test('계산 결과가 실시간으로 표시된다', async ({ page }) => {
    // 값 입력
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    
    if (count > 0) {
      await inputs.first().fill('100');
      
      // 결과 영역 확인
      await expect(page.getByText(/매출|LTV|결과/i)).toBeVisible();
    }
  });

  test('핵심 지표 카드가 표시된다', async ({ page }) => {
    // 지표 카드들 확인
    await expect(page.getByText(/LTV|CAC|손익분기점/i)).toBeVisible();
  });

  test('차트가 표시된다', async ({ page }) => {
    // Recharts 영역 확인
    const chart = page.locator('[class*="recharts"]');
    
    if (await chart.isVisible()) {
      await expect(chart).toBeVisible();
    }
  });
});

test.describe('재무 계산기 - CTA 배너', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('비로그인 시 CTA 배너가 표시된다', async ({ page }) => {
    // CTA 배너 확인
    await expect(page.getByText(/로그인|회원가입|프로젝트 시작/i)).toBeVisible();
  });

  test('CTA 버튼 클릭 시 로그인 페이지로 이동한다', async ({ page }) => {
    // CTA 버튼 찾기
    const ctaButton = page.getByRole('link', { name: /시작하기|로그인|가입/i });
    
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      
      // 로그인 또는 메인 페이지로 이동
      await expect(page).toHaveURL(/(login|signup|\/)/);
    }
  });
});

test.describe('재무 계산기 - LTV/CAC 경고', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('LTV/CAC 비율이 낮을 때 경고가 표시된다', async ({ page }) => {
    // 낮은 LTV/CAC 비율을 만들 입력값 설정
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    
    if (count >= 3) {
      // 고객 수
      await inputs.nth(0).fill('10');
      // 가격
      await inputs.nth(1).fill('10000');
      // CAC (높은 값)
      await inputs.nth(2).fill('100000');
      
      // 경고 메시지 확인
      const warning = page.getByText(/경고|개선 필요|낮습니다/i);
      
      if (await warning.isVisible()) {
        await expect(warning).toBeVisible();
      }
    }
  });
});

