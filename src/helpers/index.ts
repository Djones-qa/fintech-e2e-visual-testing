/**
 * Central export point for all test helpers.
 *
 * @example
 * ```ts
 * import {
 *   runA11yScan,
 *   assertNoA11yViolations,
 *   percySnapshotPage,
 *   compareScreenshot,
 * } from '@helpers/index';
 * ```
 */

// Accessibility helpers (axe-core)
export {
  runA11yScan,
  assertNoA11yViolations,
  logA11yReport,
} from './a11y.helper';

// Percy visual snapshot helpers
export {
  percySnapshotPage,
  percySnapshotAllWidths,
  FINTECH_WIDTHS,
} from './percy.helper';
export type { PercySnapshotOptions } from './percy.helper';

// Playwright native screenshot helpers
export {
  compareScreenshot,
  compareScreenshotAllViewports,
  maskDynamicContent,
} from './visual.helper';
export type { ScreenshotCompareOptions } from './visual.helper';
