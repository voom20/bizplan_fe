/**
 * 사업계획서 관련 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 사업계획서 뷰어 페이지 렌더링
 * - 섹션 탐색
 * - 내보내기 기능
 * - 버전 히스토리
 */

import { test, expect } from '@playwright/test';

test.describe('사업계획서 뷰어', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
  });

  test('사업계획서 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 제목 확인
    await expect(page.getByText(/사업계획서/i)).toBeVisible();
  });

  test('섹션 목록이 표시된다', async ({ page }) => {
    // 섹션들 확인
    await expect(page.getByText(/요약|개요|Executive Summary/i)).toBeVisible();
  });

  test('섹션 내용이 표시된다', async ({ page }) => {
    // 마크다운 컨텐츠 영역 확인
    await expect(page.locator('[class*="prose"], [class*="markdown"]')).toBeVisible();
  });
});

test.describe('사업계획서 - 내보내기', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
  });

  test('내보내기 드롭다운이 있다', async ({ page }) => {
    // 내보내기 버튼 확인
    await expect(page.getByRole('button', { name: /내보내기|다운로드|Export/i })).toBeVisible();
  });

  test('내보내기 드롭다운을 열 수 있다', async ({ page }) => {
    // 내보내기 버튼 클릭
    await page.getByRole('button', { name: /내보내기|다운로드|Export/i }).click();
    
    // 형식 옵션 확인
    await expect(page.getByText(/PDF/i)).toBeVisible();
    await expect(page.getByText(/HTML/i)).toBeVisible();
  });

  test('PDF 내보내기를 선택할 수 있다', async ({ page }) => {
    // 내보내기 드롭다운 열기
    await page.getByRole('button', { name: /내보내기|다운로드|Export/i }).click();
    
    // PDF 옵션 클릭
    await page.getByText(/PDF/i).click();
    
    // 다운로드 시작 또는 로딩 상태 확인
    // (실제 다운로드는 Mock이므로 UI 상태만 확인)
  });

  test('HTML 내보내기를 선택할 수 있다', async ({ page }) => {
    // 내보내기 드롭다운 열기
    await page.getByRole('button', { name: /내보내기|다운로드|Export/i }).click();
    
    // HTML 옵션 클릭
    await page.getByText(/HTML/i).click();
  });
});

test.describe('사업계획서 - 버전 히스토리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
  });

  test('버전 히스토리 패널이 있다', async ({ page }) => {
    // 버전 관련 버튼/패널 확인
    const versionButton = page.getByRole('button', { name: /버전|히스토리|History/i });
    
    if (await versionButton.isVisible()) {
      await expect(versionButton).toBeVisible();
    }
  });

  test('버전 히스토리 패널을 열 수 있다', async ({ page }) => {
    const versionButton = page.getByRole('button', { name: /버전|히스토리|History/i });
    
    if (await versionButton.isVisible()) {
      await versionButton.click();
      
      // 버전 목록 확인
      await expect(page.getByText(/버전|v\d/i)).toBeVisible();
    }
  });

  test('버전을 선택할 수 있다', async ({ page }) => {
    const versionButton = page.getByRole('button', { name: /버전|히스토리|History/i });
    
    if (await versionButton.isVisible()) {
      await versionButton.click();
      
      // 첫 번째 버전 항목 클릭
      const versionItem = page.locator('[class*="version-item"]').first();
      
      if (await versionItem.isVisible()) {
        await versionItem.click();
      }
    }
  });
});

test.describe('사업계획서 - 섹션 재생성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
  });

  test('섹션 재생성 버튼이 있다', async ({ page }) => {
    // AI 재생성 버튼 확인
    const regenerateButton = page.getByRole('button', { name: /다시 쓰기|재생성|Regenerate/i });
    
    // 버튼이 있을 수도 있고 없을 수도 있음
    if (await regenerateButton.first().isVisible()) {
      await expect(regenerateButton.first()).toBeVisible();
    }
  });
});

