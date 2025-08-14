import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.locator('input[name="userId"]').click();
    await page.locator('input[name="userId"]').fill('');
    await page.locator('input[name="userId"]').fill('thankyou_rabit');
    await page.locator('input[name="userId"]').press('Tab');
    await page.locator('input[name="password"]').fill('Arigatou');
    await page.locator('input[name="password"]').press('Enter');
    await page.getByRole('button', { name: 'logout' }).click();
});