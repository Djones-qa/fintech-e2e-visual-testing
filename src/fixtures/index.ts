/**
 * Central export point for all Playwright test fixtures.
 *
 * Import from this module to access any custom fixture:
 * @example
 * ```ts
 * import { test, expect } from '@fixtures/index';
 * ```
 */

export { test, expect } from './auth.fixture';
export type { AuthFixture } from './auth.fixture';
