import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  snapshotPathTemplate: 'tests/visual/snapshots/{platform}-{projectName}/{testFileName}/{arg}{ext}',
  timeout: 30000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'desktop',
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
