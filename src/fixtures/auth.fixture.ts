import { test as base, Page } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Shape of the authenticated user context provided by the auth fixture.
 */
export interface AuthFixture {
  /** A Playwright Page that is already authenticated as the test user. */
  authenticatedPage: Page;
}

/**
 * Performs a full login flow for the fintech application.
 *
 * Navigates to /login, fills in credentials from environment variables,
 * submits the form, and waits until the dashboard URL is reached.
 *
 * @param page - The Playwright Page instance to authenticate.
 */
async function loginUser(page: Page): Promise<void> {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in the environment. ' +
        'Copy .env.example to .env and fill in the values.'
    );
  }

  // Navigate to the login page
  await page.goto('/login');

  // Wait for the login form to be visible
  await page.waitForSelector('[data-testid="login-form"]', { state: 'visible' });

  // Fill in credentials
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);

  // Submit the form
  await page.click('[data-testid="login-submit-btn"]');

  // Wait for successful redirect to the dashboard
  await page.waitForURL('**/dashboard', { timeout: 15_000 });

  // Confirm the dashboard heading is present
  await page.waitForSelector('[data-testid="dashboard-heading"]', {
    state: 'visible',
    timeout: 10_000,
  });
}

/**
 * Extended Playwright test fixture that provides an `authenticatedPage`.
 *
 * @example
 * ```ts
 * import { test } from '@fixtures/auth.fixture';
 *
 * test('dashboard loads', async ({ authenticatedPage }) => {
 *   await expect(authenticatedPage).toHaveURL(/dashboard/);
 * });
 * ```
 */
export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }, use) => {
    await loginUser(page);
    // Hand the authenticated page to the test
    await use(page);
    // Teardown: clear cookies/storage after each test for isolation
    await page.context().clearCookies();
  },
});

export { expect } from '@playwright/test';
