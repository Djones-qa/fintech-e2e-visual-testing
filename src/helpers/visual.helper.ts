import { Page, PageScreenshotOptions, expect } from '@playwright/test';
import * as path from 'path';

/**
 * Options for a Playwright native screenshot comparison.
 */
export interface ScreenshotCompareOptions {
  /**
   * Maximum ratio of pixels that are allowed to differ.
   * Value between 0 and 1. Default: 0.02 (2%).
   */
  maxDiffPixelRatio?: number;
  /**
   * Pixel-level colour difference threshold (0–1).
   * Default: 0.2.
   */
  threshold?: number;
  /**
   * Viewport to set before taking the screenshot.
   * If omitted, the current viewport is used.
   */
  viewport?: { width: number; height: number };
  /**
   * Additional Playwright screenshot options (clip, fullPage, etc.).
   */
  screenshotOptions?: PageScreenshotOptions;
  /**
   * Whether to capture a full-page screenshot. Default: true.
   */
  fullPage?: boolean;
  /**
   * Animations handling. Default: 'disabled' for deterministic snapshots.
   */
  animations?: 'disabled' | 'allow';
}

/**
 * Default screenshot comparison options for fintech pages.
 */
const DEFAULT_COMPARE_OPTIONS: Required<
  Pick<ScreenshotCompareOptions, 'maxDiffPixelRatio' | 'threshold' | 'fullPage' | 'animations'>
> = {
  maxDiffPixelRatio: 0.02,
  threshold: 0.2,
  fullPage: true,
  animations: 'disabled',
};

/**
 * Compare the current page state against a stored Playwright screenshot baseline.
 *
 * Uses `expect(page).toHaveScreenshot()` under the hood. On first run,
 * Playwright creates the baseline. Subsequent runs diff against it.
 *
 * @param page - The Playwright Page to screenshot.
 * @param name - Snapshot file name (e.g. `'dashboard-default.png'`).
 * @param options - Optional overrides for comparison thresholds and viewport.
 *
 * @example
 * ```ts
 * await compareScreenshot(page, 'login-page.png');
 * await compareScreenshot(page, 'dashboard-mobile.png', { viewport: { width: 375, height: 812 } });
 * ```
 */
export async function compareScreenshot(
  page: Page,
  name: string,
  options: ScreenshotCompareOptions = {}
): Promise<void> {
  const {
    maxDiffPixelRatio = DEFAULT_COMPARE_OPTIONS.maxDiffPixelRatio,
    threshold = DEFAULT_COMPARE_OPTIONS.threshold,
    fullPage = DEFAULT_COMPARE_OPTIONS.fullPage,
    animations = DEFAULT_COMPARE_OPTIONS.animations,
    viewport,
  } = options;

  // Optionally resize the viewport before snapping
  if (viewport) {
    await page.setViewportSize(viewport);
    // Allow layout to settle after resize
    await page.waitForTimeout(300);
  }

  // Ensure the snapshot name always ends with .png
  const snapshotName = name.endsWith('.png') ? name : `${name}.png`;

  await expect(page).toHaveScreenshot(snapshotName, {
    maxDiffPixelRatio,
    threshold,
    fullPage,
    animations,
    ...options.screenshotOptions,
  });
}

/**
 * Capture screenshots of the page at multiple viewport widths and compare
 * each against its stored baseline.
 *
 * @param page - The Playwright Page to screenshot.
 * @param baseName - Base name for the snapshots (viewport suffix is appended).
 * @param viewports - Array of viewport widths to test. Default: [375, 768, 1280, 1920].
 * @param options - Optional comparison options applied to all viewports.
 *
 * @example
 * ```ts
 * await compareScreenshotAllViewports(page, 'transactions');
 * // Compares: transactions-375.png, transactions-768.png, etc.
 * ```
 */
export async function compareScreenshotAllViewports(
  page: Page,
  baseName: string,
  viewports: number[] = [375, 768, 1280, 1920],
  options: Omit<ScreenshotCompareOptions, 'viewport'> = {}
): Promise<void> {
  for (const width of viewports) {
    const height = width <= 768 ? 812 : 900;
    const snapshotName = `${path.parse(baseName).name}-${width}.png`;
    await compareScreenshot(page, snapshotName, {
      ...options,
      viewport: { width, height },
    });
  }
}

/**
 * Mask dynamic content (e.g. timestamps, live prices) before taking a
 * screenshot to prevent false positives in visual diffs.
 *
 * @param page - The Playwright Page.
 * @param selectors - CSS selectors of elements to mask with a solid rectangle.
 *
 * @example
 * ```ts
 * await maskDynamicContent(page, ['[data-testid="live-price"]', '.timestamp']);
 * await compareScreenshot(page, 'dashboard-masked.png');
 * ```
 */
export async function maskDynamicContent(
  page: Page,
  selectors: string[]
): Promise<void> {
  for (const selector of selectors) {
    await page.evaluate((sel: string) => {
      const elements = document.querySelectorAll<HTMLElement>(sel);
      elements.forEach((el) => {
        el.style.visibility = 'hidden';
      });
    }, selector);
  }
}
