import { test, type Page } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import {
  percySnapshotPage,
  percySnapshotAllWidths,
  FINTECH_WIDTHS,
} from '../../src/helpers/percy.helper';
import {
  compareScreenshot,
  compareScreenshotAllViewports,
  maskDynamicContent,
} from '../../src/helpers/visual.helper';
import { VALID_CREDENTIALS, VIEWPORTS } from '../../src/data/test-data';

/**
 * Dedicated Visual Regression Test Suite
 *
 * Captures full-page snapshots of all key fintech pages at multiple
 * viewports using both Percy (cloud diffing) and Playwright native
 * screenshots (local baseline diffing).
 *
 * Tags: @visual
 */
test.describe('Visual Regression Suite @visual', () => {
  /**
   * Helper: authenticate and return to the given URL.
   */
  async function authenticateAndGoto(page: Page, url: string) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await loginPage.expectDashboard();
    await page.goto(url);
  }

  // ── Login Page ──────────────────────────────────────────────────────────

  test.describe('Login Page', () => {
    test('Percy — login page at all fintech widths', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.expectPageLoaded();
      await percySnapshotPage(page, 'Login Page - All Widths', {
        widths: FINTECH_WIDTHS,
      });
    });

    test('Percy — login page per-viewport snapshots', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await percySnapshotAllWidths(page, 'Login Page');
    });

    test('Playwright — login page desktop baseline', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await compareScreenshot(page, 'login-desktop.png', {
        viewport: VIEWPORTS.desktop,
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Playwright — login page mobile baseline', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await compareScreenshot(page, 'login-mobile.png', {
        viewport: VIEWPORTS.mobile,
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Playwright — login page all viewports', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await compareScreenshotAllViewports(page, 'login', FINTECH_WIDTHS, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  // ── Dashboard Page ──────────────────────────────────────────────────────

  test.describe('Dashboard Page', () => {
    test('Percy — dashboard at all fintech widths', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      await maskDynamicContent(page, [
        '[data-testid="balance-amount"]',
        '[data-testid="portfolio-chart"] canvas',
        '[data-testid="live-price"]',
      ]);
      await percySnapshotPage(page, 'Dashboard - All Widths', {
        widths: FINTECH_WIDTHS,
      });
    });

    test('Percy — dashboard per-viewport snapshots', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      await maskDynamicContent(page, ['[data-testid="balance-amount"]']);
      await percySnapshotAllWidths(page, 'Dashboard');
    });

    test('Playwright — dashboard desktop baseline', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      await maskDynamicContent(page, [
        '[data-testid="balance-amount"]',
        '[data-testid="portfolio-chart"] canvas',
      ]);
      await compareScreenshot(page, 'dashboard-desktop.png', {
        viewport: VIEWPORTS.desktop,
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Playwright — dashboard widescreen baseline', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      await maskDynamicContent(page, ['[data-testid="balance-amount"]']);
      await compareScreenshot(page, 'dashboard-widescreen.png', {
        viewport: VIEWPORTS.widescreen,
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Playwright — dashboard all viewports', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      await maskDynamicContent(page, ['[data-testid="balance-amount"]']);
      await compareScreenshotAllViewports(page, 'dashboard', FINTECH_WIDTHS, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  // ── Transactions Page ───────────────────────────────────────────────────

  test.describe('Transactions Page', () => {
    test('Percy — transactions at all fintech widths', async ({ page }) => {
      await authenticateAndGoto(page, '/transactions');
      await maskDynamicContent(page, [
        '[data-testid="transaction-row"] .date',
        '[data-testid="transaction-row"] .amount',
      ]);
      await percySnapshotPage(page, 'Transactions - All Widths', {
        widths: FINTECH_WIDTHS,
      });
    });

    test('Playwright — transactions desktop baseline', async ({ page }) => {
      await authenticateAndGoto(page, '/transactions');
      await compareScreenshot(page, 'transactions-desktop.png', {
        viewport: VIEWPORTS.desktop,
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Playwright — transactions mobile baseline', async ({ page }) => {
      await authenticateAndGoto(page, '/transactions');
      await compareScreenshot(page, 'transactions-mobile.png', {
        viewport: VIEWPORTS.mobile,
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Playwright — transactions all viewports', async ({ page }) => {
      await authenticateAndGoto(page, '/transactions');
      await compareScreenshotAllViewports(page, 'transactions', FINTECH_WIDTHS, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  // ── Payment / Send Money Flow ───────────────────────────────────────────

  test.describe('Payment Flow', () => {
    test('Percy — payment flow at all fintech widths', async ({ page }) => {
      await authenticateAndGoto(page, '/send');
      await percySnapshotPage(page, 'Payment Flow - Send Money', {
        widths: FINTECH_WIDTHS,
      });
    });

    test('Playwright — payment flow desktop baseline', async ({ page }) => {
      await authenticateAndGoto(page, '/send');
      await compareScreenshot(page, 'payment-flow-desktop.png', {
        viewport: VIEWPORTS.desktop,
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
});
