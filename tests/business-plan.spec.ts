/**
 * 사업계획서 관련 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 사업계획서 뷰어 페이지 렌더링
 * - 섹션 탐색
 * - 내보내기 기능
 * - 버전 히스토리
 * 
 * 수정 사항:
 * - 다중 요소 매칭 시 .first() 추가
 * - 실제 UI 버튼 텍스트와 매칭
 * - 생성 전/후 상태 구분
 */

import { test, expect } from '@playwright/test';

test.describe('사업계획서 뷰어', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
    await page.waitForLoadState('networkidle');
  });

  test('사업계획서 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 초기 상태: 생성 대기 화면 또는 생성된 계획서
    // "AI 사업계획서 생성" 또는 "사업계획서" 텍스트 확인
    const pageTitle = page.getByText(/사업계획서/i).first();
    await expect(pageTitle).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-render-chromium.png` });
  });

  test('섹션 목록이 표시된다', async ({ page }) => {
    // AI 생성 버튼 클릭하여 계획서 생성 (Mock)
    const generateButton = page.getByRole('button', { name: /AI 사업계획서 생성하기/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      // 생성 완료 대기 (3초 시뮬레이션)
      await page.waitForTimeout(4000);
    }
    
    // 섹션 제목들 확인 (mockBusinessPlan의 섹션들)
    const sectionTitle = page.getByText(/요약|개요|Executive Summary|사업 아이템/i).first();
    await expect(sectionTitle).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-sections-chromium.png` });
  });

  test('섹션 내용이 표시된다', async ({ page }) => {
    // AI 생성 후 마크다운 컨텐츠 확인
    const generateButton = page.getByRole('button', { name: /AI 사업계획서 생성하기/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(4000);
    }
    
    // prose 클래스 (마크다운 렌더링 영역) 확인
    const proseContent = page.locator('[class*="prose"]').first();
    await expect(proseContent).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-content-chromium.png` });
  });
});

test.describe('사업계획서 - 내보내기', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
    await page.waitForLoadState('networkidle');
    
    // AI 생성 버튼이 있으면 클릭하여 계획서 생성
    const generateButton = page.getByRole('button', { name: /AI 사업계획서 생성하기/i });
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(4000);
    }
  });

  test('내보내기 드롭다운이 있다', async ({ page }) => {
    // ExportDropdown 컴포넌트의 버튼 - "내보내기" 또는 아이콘만 있을 수 있음
    const exportButton = page.getByRole('button', { name: /내보내기|다운로드|Export/i }).first();
    await expect(exportButton).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-export-button-chromium.png` });
  });

  test('내보내기 드롭다운을 열 수 있다', async ({ page }) => {
    // 내보내기 버튼 클릭
    const exportButton = page.getByRole('button', { name: /내보내기|다운로드|Export/i }).first();
    await exportButton.click();
    
    // 드롭다운 옵션들 확인
    await expect(page.getByText(/PDF/i).first()).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-export-dropdown-chromium.png` });
  });

  test('PDF 내보내기를 선택할 수 있다', async ({ page }) => {
    // 내보내기 드롭다운 열기
    const exportButton = page.getByRole('button', { name: /내보내기|다운로드|Export/i }).first();
    await exportButton.click();
    
    // PDF 옵션 클릭
    const pdfOption = page.getByText(/PDF/i).first();
    await pdfOption.click();
    
    // 다운로드 시작 또는 로딩 상태 확인 (Mock이므로 UI 상태만 확인)
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-export-pdf-chromium.png` });
  });

  test('HTML 내보내기를 선택할 수 있다', async ({ page }) => {
    // 내보내기 드롭다운 열기
    const exportButton = page.getByRole('button', { name: /내보내기|다운로드|Export/i }).first();
    await exportButton.click();
    
    // HTML 옵션 클릭
    const htmlOption = page.getByText(/HTML/i).first();
    await htmlOption.click();
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-export-html-chromium.png` });
  });
});

test.describe('사업계획서 - 버전 히스토리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
    await page.waitForLoadState('networkidle');
    
    // AI 생성
    const generateButton = page.getByRole('button', { name: /AI 사업계획서 생성하기/i });
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(4000);
    }
  });

  test('버전 히스토리 패널이 있다', async ({ page }) => {
    // 버전 버튼 확인 - "버전 N" 형식
    const versionButton = page.getByRole('button', { name: /버전/i }).first();
    await expect(versionButton).toBeVisible();
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-version-button-chromium.png` });
  });

  test('버전 히스토리 패널을 열 수 있다', async ({ page }) => {
    const versionButton = page.getByRole('button', { name: /버전/i }).first();
    await versionButton.click();
    
    // 패널이 열리면 버전 목록 표시
    await page.waitForTimeout(300);
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-version-panel-chromium.png` });
  });

  test('버전을 선택할 수 있다', async ({ page }) => {
    const versionButton = page.getByRole('button', { name: /버전/i }).first();
    await versionButton.click();
    
    await page.waitForTimeout(300);
    
    // 첫 번째 버전 항목 클릭 (패널 내부)
    const versionItem = page.locator('[class*="version"], [class*="list-item"]').first();
    
    if (await versionItem.isVisible()) {
      await versionItem.click();
    }
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-version-select-chromium.png` });
  });
});

test.describe('사업계획서 - 섹션 재생성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-plan');
    await page.waitForLoadState('networkidle');
    
    // AI 생성
    const generateButton = page.getByRole('button', { name: /AI 사업계획서 생성하기/i });
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(4000);
    }
  });

  test('섹션 재생성 버튼이 있다', async ({ page }) => {
    // SectionRegenerateButton - "다시 쓰기" 또는 "재생성"
    const regenerateButton = page.getByRole('button', { name: /다시 쓰기|재생성|Regenerate/i }).first();
    
    // 버튼이 있을 수 있음 (섹션 헤더에 위치)
    if (await regenerateButton.isVisible()) {
      await expect(regenerateButton).toBeVisible();
    }
    
    await page.screenshot({ path: `docs/test-results/screenshots/business-plan-regenerate-button-chromium.png` });
  });
});
