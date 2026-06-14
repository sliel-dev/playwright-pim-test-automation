import { test, expect, Page } from '@playwright/test';

async function login(page: Page, username: string, password: string) {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test('OrangeHRM PIM 사원 등록 및 삭제 (정상 흐름)', async ({ page }) => {
  const uniqueId = Date.now().toString();
  const randomFirstName = `kim${uniqueId.slice(-4)}`; 
  const randomEmpId = uniqueId.slice(-6);

  await test.step('1. 관리자 로그인', async () => {
    await login(page, 'admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/); 
  });

  await test.step('2. PIM 신규 사원 등록', async () => {
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('button', { name: ' Add' }).click();

    await page.getByRole('textbox', { name: 'First Name' }).fill(randomFirstName);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill('pi');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('zza');
    await page.getByRole('textbox').nth(4).fill(randomEmpId);
    
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/pim\/viewPersonalDetails/);
  });

  await test.step('3. 등록한 사원 검색 및 삭제', async () => {
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill(randomFirstName);
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(`${randomFirstName} pi`)).toBeVisible();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
    await page.getByRole('button', { name: ' Yes, Delete' }).click();
    await expect(page.getByText('SuccessSuccessfully Deleted×')).toBeVisible();
  });

  await test.step('4. 로그아웃 및 복귀 검증', async () => {
    await page.locator('.oxd-userdropdown-name').click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/auth\/login/);
  });
});

test('OrangeHRM PIM 사원 등록 예외 테스트 (이름 누락)', async ({ page }) => {
  await test.step('1. 관리자 로그인 및 PIM 진입', async () => {
    await login(page, 'admin', 'admin123');
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('button', { name: ' Add' }).click();
  });

  await test.step('2. 필수값 공백 상태로 저장 시 Required 문구 검증', async () => {
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Required').first()).toBeVisible(); 
    await expect(page.getByText('Required').nth(1)).toBeVisible(); 
  });
});