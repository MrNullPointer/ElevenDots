import { expect, test } from '@playwright/test';

test.describe('About page', () => {
  test('standalone about route', async ({ page }) => {
    await page.goto('/about');
    await page.waitForTimeout(320);
    await expect(page).toHaveScreenshot('about-page.png');
  });
});
