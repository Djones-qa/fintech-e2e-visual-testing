import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { assertNoA11yViolations, runA11yScan, logA11yReport } from '../../src/helpers/a11y.helper';
import { percySnapshotPage } from '../../src/helpers/percy.helper';
import { compareScreenshot, maskDynamicContent } from '../../src/helpers/visual.helper';
import { VALID_CREDENTIALS } from '../../src/data/test-data';

/**
 * Dashboard Page Tests
 *
 * Tags:
 *  @smoke      — critical path, runs on every commit
 *  @regression — full regression suite
 *  @a11y       — accessibility scans
 *  @visual     — visual regression snapshots
 */
test.describe('Dashboard Page @smoke @regression', () => {
  let dashboardPage: DashboardPage;

  /**
   * Authenticate before each test so the dashboard is accessible.
   */
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await loginPage.expectDashboard();

    dashboardPage = new DashboardPage(page);
  });

  // ── Functional Tests ────────────────────────────────────────────────────

  test('dashboard should load with the correct heading', async () => {
    await dashboardPage.expectDashboardLoaded();
    await expect(dashboardPage.heading).toBeVisible();
  });

  test('dashboard should display the account balance card', async () => {
    await dashboardPage.expectAccountBalance();
    const balance = await dashboardPage.getBalanceText();
    // Balance must be a non-empty string containing digits
    expect(balance).toMatch(/\d/);
  });

  test('dashboard should display the recent transaction list', async () => {
    await dashboardPage.expectTransactionList();
  });

  test('dashboard should display the portfolio chart', async () => {
    await dashboardPage.expectPortfolioChart();
  });

  test('dashboard should display the navigation sidebar', async () => {
    await expect(dashboardPage.navSidebar).toBeVisible();
  });

  test('dashboard quick actions panel should be visible', async () => {
    await expect(dashboardPage.quickActionsPanel).toBeVisible();
    await expect(dashboardPage.sendMoneyButton).toBeEnabled();
    await expect(dashboardPage.addFundsButton).toBeEnabled();
  });

  test('clicking Send Money should navigate to the payment flow', async ({ page }) => {
    await dashboardPage.clickSendMoney();
    await expect(page).toHaveURL(/\/(send|payment|transfer)/);
  });

  test('notification bell should be visible and clickable', async () => {
    await expect(dashboardPage.notificationBell).toBeVisible();
    await dashboardPage.notificationBell.click();
    // Notification panel or dropdown should appear
    await expect(
      dashboardPage.page.locator('[data-testid="notification-panel"]')
    ).toBeVisible();
  });

  // ── Accessibility Tests ─────────────────────────────────────────────────

  test('dashboard should have no WCAG 2.1 AA violations @a11y', async ({ page }) => {
    await assertNoA11yViolations(page);
  });

  test('dashboard a11y scan should log a detailed report @a11y', async ({ page }) => {
    const violations = await runA11yScan(page);
    logA11yReport(violations);
    console.log(`Dashboard violations found: ${violations.length}`);
  });

  // ── Visual Regression Tests ─────────────────────────────────────────────

  test('dashboard should match Percy visual baseline @visual', async ({ page }) => {
    // Mask live/dynamic data to prevent false positives
    await maskDynamicContent(page, [
      '[data-testid="balance-amount"]',
      '[data-testid="live-price"]',
      '[data-testid="portfolio-chart"] canvas',
      '[data-testid="transaction-list-item"] .timestamp',
    ]);
    await percySnapshotPage(page, 'Dashboard - Default State');
  });

  test('dashboard should match Playwright native screenshot baseline @visual', async ({
    page,
  }) => {
    await maskDynamicContent(page, [
      '[data-testid="balance-amount"]',
      '[data-testid="portfolio-chart"] canvas',
    ]);
    await compareScreenshot(page, 'dashboard-default.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('dashboard should match visual baseline on tablet @visual', async ({ page }) => {
    await maskDynamicContent(page, ['[data-testid="balance-amount"]']);
    await compareScreenshot(page, 'dashboard-tablet.png', {
      viewport: { width: 768, height: 1024 },
      fullPage: true,
      animations: 'disabled',
    });
  });
});
