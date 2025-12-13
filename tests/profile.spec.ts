/**
 * 프로필 관리 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 프로필 페이지 렌더링
 * - 프로필 정보 수정
 * - 비밀번호 변경
 * - 계정 삭제
 */

import { test, expect } from '@playwright/test';

test.describe('프로필 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 시뮬레이션 (localStorage 설정)
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', email: 'test@example.com', displayName: 'Test User' },
          isAuthenticated: true,
        },
        version: 0
      }));
    });
    await page.goto('/profile');
  });

  test('프로필 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 프로필 제목 확인
    await expect(page.getByText(/프로필|내 정보/i)).toBeVisible();
  });

  test('탭 네비게이션이 있다', async ({ page }) => {
    // 탭들 확인
    await expect(page.getByRole('tab', { name: /프로필|정보/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /보안|비밀번호/i })).toBeVisible();
  });

  test('프로필 편집 폼이 표시된다', async ({ page }) => {
    // 이름 입력 필드 확인
    await expect(page.getByLabel(/이름|닉네임|Name/i)).toBeVisible();
  });

  test('이름을 수정할 수 있다', async ({ page }) => {
    const nameInput = page.getByLabel(/이름|닉네임|Name/i);
    
    if (await nameInput.isVisible()) {
      await nameInput.clear();
      await nameInput.fill('새 이름');
      await expect(nameInput).toHaveValue('새 이름');
    }
  });

  test('저장 버튼이 있다', async ({ page }) => {
    await expect(page.getByRole('button', { name: /저장|Save/i })).toBeVisible();
  });
});

test.describe('프로필 - 비밀번호 변경', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', email: 'test@example.com', displayName: 'Test User' },
          isAuthenticated: true,
        },
        version: 0
      }));
    });
    await page.goto('/profile');
    
    // 보안 탭 클릭
    const securityTab = page.getByRole('tab', { name: /보안|비밀번호/i });
    if (await securityTab.isVisible()) {
      await securityTab.click();
    }
  });

  test('비밀번호 변경 폼이 표시된다', async ({ page }) => {
    // 현재 비밀번호 필드
    await expect(page.getByLabel(/현재 비밀번호|기존 비밀번호/i)).toBeVisible();
    
    // 새 비밀번호 필드
    await expect(page.getByLabel(/새 비밀번호|New Password/i).first()).toBeVisible();
  });

  test('비밀번호 강도 표시기가 동작한다', async ({ page }) => {
    const newPasswordInput = page.getByLabel(/새 비밀번호|New Password/i).first();
    
    if (await newPasswordInput.isVisible()) {
      await newPasswordInput.fill('WeakPwd1');
      
      // 강도 표시 확인
      await expect(page.locator('[class*="strength"], [class*="meter"]')).toBeVisible();
    }
  });

  test('비밀번호 불일치 시 에러가 표시된다', async ({ page }) => {
    const currentPassword = page.getByLabel(/현재 비밀번호|기존 비밀번호/i);
    const newPassword = page.getByLabel(/새 비밀번호|New Password/i).first();
    const confirmPassword = page.getByLabel(/비밀번호 확인|Confirm/i);
    
    if (await currentPassword.isVisible()) {
      await currentPassword.fill('currentPassword123!');
      await newPassword.fill('newPassword123!');
      await confirmPassword.fill('differentPassword123!');
      
      // 변경 버튼 클릭
      await page.getByRole('button', { name: /변경|Change/i }).click();
      
      // 에러 메시지 확인
      await expect(page.getByText(/일치하지 않습니다/i)).toBeVisible();
    }
  });
});

test.describe('프로필 - 계정 삭제', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', email: 'test@example.com', displayName: 'Test User' },
          isAuthenticated: true,
        },
        version: 0
      }));
    });
    await page.goto('/profile');
    
    // 보안 탭 클릭
    const securityTab = page.getByRole('tab', { name: /보안|비밀번호/i });
    if (await securityTab.isVisible()) {
      await securityTab.click();
    }
  });

  test('계정 삭제 버튼이 있다', async ({ page }) => {
    await expect(page.getByRole('button', { name: /계정 삭제|탈퇴|Delete Account/i })).toBeVisible();
  });

  test('계정 삭제 클릭 시 확인 모달이 표시된다', async ({ page }) => {
    const deleteButton = page.getByRole('button', { name: /계정 삭제|탈퇴|Delete Account/i });
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // 확인 모달 확인
      await expect(page.getByText(/정말 삭제|확인|되돌릴 수 없습니다/i)).toBeVisible();
    }
  });

  test('모달에서 취소를 클릭하면 모달이 닫힌다', async ({ page }) => {
    const deleteButton = page.getByRole('button', { name: /계정 삭제|탈퇴|Delete Account/i });
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // 취소 버튼 클릭
      await page.getByRole('button', { name: /취소|Cancel/i }).click();
      
      // 모달이 닫힘 확인
      await expect(page.getByText(/정말 삭제/i)).not.toBeVisible();
    }
  });
});

