import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.locator('input[name="userName"]').click();
    await page.locator('input[name="userName"]').fill('test');
    await page.locator('input[name="userName"]').press('Tab');
    const randomId = `u${Math.random().toString(36).slice(2, 8)}`;
    await page.locator('input[name="userId"]').fill(randomId);
    await page.locator('input[name="userId"]').press('Tab');
    await page.locator('input[name="password"]').fill('Test');
    await page.locator('input[name="password"]').press('Tab');
    await page.locator('input[name="confirmPassword"]').fill('Test');
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('button', { name: 'register' }).click();
    await page.locator('input[name="userId"]').click();
    await page.locator('input[name="userId"]').fill(randomId);
    await page.locator('input[name="userId"]').press('Tab');
    await page.locator('input[name="password"]').fill('Test');
    await page.getByRole('button', { name: 'login' }).click();
});
