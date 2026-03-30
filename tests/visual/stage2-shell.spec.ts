import { test, expect, type Page } from '@playwright/test';

type StageState = {
  activeDestination?: 'pulse' | 'axiom' | 'about' | null;
  activePanel?: 'about' | null;
  frozen?: boolean;
  reducedMotion?: boolean;
  qualityTier?: 'high' | 'medium' | 'low';
  scenePhase?: 'idle' | 'navigating';
};

async function setStageState(page: Page, state: StageState) {
  await page.evaluate((nextState) => {
    const store = (window as Window & {
      __ZUSTAND_STORE__?: {
        setState: (partial: StageState) => void;
      };
    }).__ZUSTAND_STORE__;

    if (!store) {
      throw new Error('Zustand store is not available on window.');
    }

    store.setState(nextState);
  }, state);
}

async function openStageState(
  page: Page,
  options: {
    state?: StageState;
  } = {},
) {
  await page.goto('/');
  await page.waitForTimeout(520);
  const nextState = {
    frozen: true,
    reducedMotion: false,
    qualityTier: 'high' as const,
    activeDestination: null,
    activePanel: null,
    ...options.state,
  };

  await setStageState(page, {
    ...nextState,
    scenePhase:
      nextState.scenePhase ??
      (nextState.activePanel || nextState.activeDestination ? 'navigating' : 'idle'),
  });
  await page.waitForTimeout(120);
}

test.describe('Stage 2 shell states', () => {
  test('idle baseline', async ({ page }) => {
    await openStageState(page);
    await expect(page).toHaveScreenshot('stage2-idle.png');
  });

  test('pulse focused', async ({ page }) => {
    await openStageState(page, {
      state: {
        activeDestination: 'pulse',
      },
    });
    await expect(page).toHaveScreenshot('stage2-pulse.png');
  });

  test('axiom focused', async ({ page }) => {
    await openStageState(page, {
      state: {
        activeDestination: 'axiom',
      },
    });
    await expect(page).toHaveScreenshot('stage2-axiom.png');
  });

  test('about focused', async ({ page }) => {
    await openStageState(page, {
      state: {
        activeDestination: 'about',
      },
    });
    await expect(page).toHaveScreenshot('stage2-about.png');
  });

  test('panel open', async ({ page }) => {
    await openStageState(page, {
      state: {
        activeDestination: 'about',
        activePanel: 'about',
      },
    });
    await expect(page).toHaveScreenshot('stage2-panel-open.png');
  });
});

test.describe('Stage 2 reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('reduced motion state', async ({ page }) => {
    await openStageState(page, {
      state: {
        activeDestination: 'pulse',
        reducedMotion: true,
      },
    });
    await expect(page).toHaveScreenshot('stage2-reduced-motion.png');
  });
});
