import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Playwright configuration for the fintech E2E visual testing suite.
 * Supports Chromium, Firefox, and WebKit with visual regression and a11y testing.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /** Directory containing test files */
  testDir: './tests',

  /** Maximum time one test can run (ms) */
  timeout: 60_000,

  /** Maximum time for expect() assertions (ms) */
  expect: {
    timeout: 10_000,
    /** Threshold for pixel-level screenshot comparisons */
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
    },
  },

  /** Run tests in files in parallel */
  fullyParallel: true,

  /** Fail the build on CI if test.only is accidentally left in source */
  forbidOnly: !!process.env.CI,

  /** Retry failed tests: 2 times in CI, 0 locally */
  retries: process.env.CI ? 2 : 0,

  /** Limit parallel workers in CI to avoid resource contention */
  workers: process.env.CI ? 2 : undefined,

  /** Reporter configuration */
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }], ['json', { outputFile: 'test-results/results.json' }]]
    : [['list'], ['html', { open: 'on-failure', outputFolder: 'playwright-report' }]],

  /** Shared settings for all projects */
  use: {
    /** Base URL from environment variable */
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',

    /** Collect trace on first retry for debugging */
    trace: 'on-first-retry',

    /** Capture screenshot on test failure */
    screenshot: 'only-on-failure',

    /** Record video on retry for debugging */
    video: 'on-first-retry',

    /** Viewport for desktop tests */
    viewport: { width: 1280, height: 720 },

    /** Ignore HTTPS errors in test environments */
    ignoreHTTPSErrors: true,

    /** Action timeout */
    actionTimeout: 15_000,

    /** Navigation timeout */
    navigationTimeout: 30_000,
  },

  /** Test projects for cross-browser coverage */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    /** Mobile viewports for responsive visual testing */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],

  /** Output directory for test artifacts */
  outputDir: 'test-results',

  /** Snapshot directory for visual regression baselines */
  snapshotDir: './snapshots',
});
