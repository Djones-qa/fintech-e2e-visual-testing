import { Page } from '@playwright/test';
import percySnapshot from '@percy/playwright';

/**
 * Options for a Percy visual snapshot.
 */
export interface PercySnapshotOptions {
  /** Viewport widths (px) to capture. Defaults to fintech-standard widths. */
  widths?: number[];
  /** Minimum height of the snapshot in pixels. */
  minHeight?: number;
  /** Whether to enable JavaScript execution during snapshot rendering. */
  enableJavaScript?: boolean;
  /** CSS to inject into the page before snapshotting. */
  percyCSS?: string;
}

/**
 * Fintech-standard viewport widths covering mobile, tablet, desktop, and wide-screen.
 */
export const FINTECH_WIDTHS: number[] = [375, 768, 1280, 1920];

/**
 * Default Percy snapshot options for fintech pages.
 */
const DEFAULT_PERCY_OPTIONS: PercySnapshotOptions = {
  widths: FINTECH_WIDTHS,
  minHeight: 600,
  enableJavaScript: true,
};

/**
 * Capture a Percy visual snapshot of the current page state.
 *
 * Wraps `@percy/playwright` with fintech-specific defaults (multi-viewport
 * widths: 375, 768, 1280, 1920) and merges any caller-supplied overrides.
 *
 * Percy snapshots are only uploaded when the `PERCY_TOKEN` environment
 * variable is set (i.e. in CI). Locally the call is a no-op unless Percy
 * CLI is running.
 *
 * @param page - The Playwright Page to snapshot.
 * @param name - A unique, descriptive name for this snapshot.
 * @param options - Optional overrides for Percy snapshot settings.
 *
 * @example
 * ```ts
 * await percySnapshotPage(page, 'Dashboard - Default State');
 * await percySnapshotPage(page, 'Login - Mobile', { widths: [375] });
 * ```
 */
export async function percySnapshotPage(
  page: Page,
  name: string,
  options: PercySnapshotOptions = {}
): Promise<void> {
  const mergedOptions: PercySnapshotOptions = {
    ...DEFAULT_PERCY_OPTIONS,
    ...options,
  };

  await percySnapshot(page, name, mergedOptions);
}

/**
 * Capture Percy snapshots at each of the fintech-standard viewport widths
 * individually, naming each snapshot with the width suffix.
 *
 * Useful when you need separate Percy snapshots per breakpoint rather than
 * a single multi-width snapshot.
 *
 * @param page - The Playwright Page to snapshot.
 * @param baseName - Base name for the snapshots (width is appended automatically).
 * @param widths - Viewport widths to iterate over. Defaults to `FINTECH_WIDTHS`.
 *
 * @example
 * ```ts
 * await percySnapshotAllWidths(page, 'Transactions Page');
 * // Creates: "Transactions Page - 375px", "Transactions Page - 768px", etc.
 * ```
 */
export async function percySnapshotAllWidths(
  page: Page,
  baseName: string,
  widths: number[] = FINTECH_WIDTHS
): Promise<void> {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await percySnapshot(page, `${baseName} - ${width}px`, {
      widths: [width],
      minHeight: 600,
      enableJavaScript: true,
    });
  }
}
