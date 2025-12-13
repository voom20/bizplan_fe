/**
 * 인증 관련 E2E 테스트
 * 
 * 테스트 시나리오:
 * - 로그인 페이지 접근 및 UI 확인
 * - 로그인 폼 유효성 검사
 * - 로그인 성공/실패 흐름
 * - 회원가입 페이지 접근 및 UI 확인
 * - 회원가입 폼 유효성 검사
 * - 로그아웃 기능
 */

import { test, expect } from '@playwright/test';

test.describe('인증 - 로그인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('로그인 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 제목 확인
    await expect(page.getByRole('heading', { name: /로그인/i })).toBeVisible();
    
    // 이메일 입력 필드 확인
    await expect(page.getByPlaceholder(/이메일/i)).toBeVisible();
    
    // 비밀번호 입력 필드 확인
    await expect(page.getByPlaceholder(/비밀번호/i)).toBeVisible();
    
    // 로그인 버튼 확인
    await expect(page.getByRole('button', { name: /로그인/i })).toBeVisible();
    
    // 회원가입 링크 확인
    await expect(page.getByRole('link', { name: /회원가입/i })).toBeVisible();
  });

  test('빈 폼 제출 시 유효성 검사 에러가 표시된다', async ({ page }) => {
    // 빈 상태로 로그인 버튼 클릭
    await page.getByRole('button', { name: /로그인/i }).click();
    
    // 에러 메시지 확인
    await expect(page.getByText(/이메일을 입력해주세요/i)).toBeVisible();
    await expect(page.getByText(/비밀번호를 입력해주세요/i)).toBeVisible();
  });

  test('잘못된 이메일 형식 입력 시 에러가 표시된다', async ({ page }) => {
    // 잘못된 이메일 입력
    await page.getByPlaceholder(/이메일/i).fill('invalid-email');
    await page.getByPlaceholder(/비밀번호/i).fill('password123!');
    await page.getByRole('button', { name: /로그인/i }).click();
    
    // 이메일 형식 에러 확인
    await expect(page.getByText(/올바른 이메일 형식/i)).toBeVisible();
  });

  test('짧은 비밀번호 입력 시 에러가 표시된다', async ({ page }) => {
    await page.getByPlaceholder(/이메일/i).fill('test@example.com');
    await page.getByPlaceholder(/비밀번호/i).fill('short');
    await page.getByRole('button', { name: /로그인/i }).click();
    
    // 비밀번호 길이 에러 확인
    await expect(page.getByText(/8자 이상/i)).toBeVisible();
  });

  test('유효한 자격 증명으로 로그인 성공', async ({ page }) => {
    // 유효한 자격 증명 입력 (Mock)
    await page.getByPlaceholder(/이메일/i).fill('test@example.com');
    await page.getByPlaceholder(/비밀번호/i).fill('password123!');
    await page.getByRole('button', { name: /로그인/i }).click();
    
    // 로그인 성공 후 메인 페이지로 이동 확인
    await expect(page).toHaveURL('/');
  });

  test('회원가입 페이지로 이동할 수 있다', async ({ page }) => {
    await page.getByRole('link', { name: /회원가입/i }).click();
    
    await expect(page).toHaveURL('/signup');
  });
});

test.describe('인증 - 회원가입', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('회원가입 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 제목 확인
    await expect(page.getByRole('heading', { name: /회원가입/i })).toBeVisible();
    
    // 입력 필드들 확인
    await expect(page.getByPlaceholder(/이메일/i)).toBeVisible();
    await expect(page.getByPlaceholder(/비밀번호/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/비밀번호 확인/i)).toBeVisible();
    
    // 회원가입 버튼 확인
    await expect(page.getByRole('button', { name: /가입/i })).toBeVisible();
  });

  test('비밀번호 불일치 시 에러가 표시된다', async ({ page }) => {
    await page.getByPlaceholder(/이메일/i).fill('newuser@example.com');
    await page.getByPlaceholder(/비밀번호/i).first().fill('password123!');
    await page.getByPlaceholder(/비밀번호 확인/i).fill('different123!');
    await page.getByRole('button', { name: /가입/i }).click();
    
    // 비밀번호 불일치 에러 확인
    await expect(page.getByText(/비밀번호가 일치하지 않습니다/i)).toBeVisible();
  });

  test('비밀번호 강도 표시기가 동작한다', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/비밀번호/i).first();
    
    // 약한 비밀번호
    await passwordInput.fill('weak');
    await expect(page.getByText(/약함|매우 약함/i)).toBeVisible();
    
    // 강한 비밀번호
    await passwordInput.fill('StrongP@ssw0rd!');
    await expect(page.getByText(/강함|매우 강함/i)).toBeVisible();
  });

  test('로그인 페이지로 이동할 수 있다', async ({ page }) => {
    await page.getByRole('link', { name: /로그인/i }).click();
    
    await expect(page).toHaveURL('/login');
  });
});

