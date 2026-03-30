import { test, expect } from '@playwright/test';

// Helper to set test mode — disables animations for deterministic screenshots
async function setTestMode(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    // Wait for Zustand store to be available on the window
    const store = (window as Record<string, unknown>).__ZUSTAND_STORE__;
    if (store && typeof (store as { getState: () => { setTestMode: (v: boolean) => void } }).getState === 'function') {
      (store as { getState: () => { setTestMode: (v: boolean) => void } }).getState().setTestMode(true);
    }
  });
}

test.describe('No-JS shell', () => {
  test.use({ javaScriptEnabled: false });

  test('renders poster background and static content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('no-js-shell.png');
  });

  test('/about page renders without JS', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveScreenshot('no-js-about.png');
  });

  test('/credits page renders without JS', async ({ page }) => {
    await page.goto('/credits');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('/privacy page renders without JS', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('/accessibility page renders without JS', async ({ page }) => {
    await page.goto('/accessibility');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Default shell with JS', () => {
  test('renders home shell', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500); // Let dynamic import load
    await expect(
      page.locator('header').getByText('elevendots', { exact: true }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('default-shell.png');
  });
});

test.describe('Reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('renders with reduced motion', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('reduced-motion.png');
  });
});

test.describe('Opaque glass mode', () => {
  test('renders with opaque glass mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Set glass mode to opaque via store
    await page.evaluate(() => {
      localStorage.setItem('elevendots-glass-mode', 'opaque');
    });
    await page.reload();
    await page.waitForTimeout(500);

    // Open about panel to see glass effect
    await page.click('a[href="/about"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('opaque-glass-about.png');
  });
});

test.describe('Mobile 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('renders at 375px', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('mobile-375.png');
  });
});

test.describe('About panel', () => {
  test('opens about panel on desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.click('a[href="/about"]');
    await page.waitForTimeout(300);
    await expect(page.getByRole('dialog', { name: 'About' })).toBeVisible();
    await expect(page).toHaveScreenshot('about-panel-desktop.png');
  });

  test('opens about panel on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.click('a[href="/about"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('about-panel-mobile.png');
  });
});

test.describe('404 page', () => {
  test('renders 404', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page).toHaveScreenshot('404.png');
  });
});
