import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { assertNoA11yViolations, runA11yScan, logA11yReport } from '../../src/helpers/a11y.helper';
import { compareScreenshot } from '../../src/helpers/visual.helper';
import { VALID_CREDENTIALS, INVALID_CREDENTIALS } from '../../src/data/test-data';

/**
 * Authentication — Login Page Tests
 *
 * Tags:
 *  @smoke      — critical path, runs on every commit
 *  @regression — full regression suite
 *  @a11y       — accessibility scans
 *  @visual     — visual regression snapshots
 */
test.describe('Login Page @smoke @regression', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ── Functional Tests ────────────────────────────────────────────────────

  test('should display the login form correctly', async () => {
    await loginPage.expectPageLoaded();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('should log in successfully with valid credentials', async ({ page }) => {
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await loginPage.expectDashboard();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show an error message with wrong password', async () => {
    await loginPage.login(
      INVALID_CREDENTIALS.wrongPassword.email,
      INVALID_CREDENTIALS.wrongPassword.password
    );
    await loginPage.expectErrorMessage();
    // Should remain on the login page
    await expect(loginPage.loginForm).toBeVisible();
  });

  test('should show an error message for an unknown user', async () => {
    await loginPage.login(
      INVALID_CREDENTIALS.unknownUser.email,
      INVALID_CREDENTIALS.unknownUser.password
    );
    await loginPage.expectErrorMessage();
  });

  test('should prevent submission with empty email', async ({ page }) => {
    await loginPage.fillPassword(VALID_CREDENTIALS.password);
    await loginPage.submit();
    // HTML5 validation or custom error should prevent navigation
    await expect(page).toHaveURL(/\/login/);
  });

  test('should prevent submission with empty password', async ({ page }) => {
    await loginPage.fillEmail(VALID_CREDENTIALS.email);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should reject a malformed email address', async () => {
    await loginPage.login(
      INVALID_CREDENTIALS.malformedEmail.email,
      INVALID_CREDENTIALS.malformedEmail.password
    );
    // Should stay on login page — either HTML5 validation or server error
    await expect(loginPage.loginForm).toBeVisible();
  });

  test('should have a working forgot-password link', async ({ page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  // ── Accessibility Tests ─────────────────────────────────────────────────

  test('login page should have no WCAG 2.1 AA violations @a11y', async ({ page }) => {
    await assertNoA11yViolations(page);
  });

  test('login page a11y scan should log a detailed report @a11y', async ({ page }) => {
    const violations = await runA11yScan(page);
    logA11yReport(violations);
    // Log-only test: does not fail on violations, useful for auditing
    console.log(`Login page violations found: ${violations.length}`);
  });

  // ── Visual Regression Tests ─────────────────────────────────────────────

  test('login page should match visual baseline @visual', async ({ page }) => {
    // Mask any dynamic content before snapping
    await compareScreenshot(page, 'login-page-default.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('login page should match visual baseline on mobile @visual', async ({ page }) => {
    await compareScreenshot(page, 'login-page-mobile.png', {
      viewport: { width: 375, height: 812 },
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('login error state should match visual baseline @visual', async ({ page }) => {
    await loginPage.login(
      INVALID_CREDENTIALS.wrongPassword.email,
      INVALID_CREDENTIALS.wrongPassword.password
    );
    await loginPage.expectErrorMessage();
    await compareScreenshot(page, 'login-page-error-state.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
