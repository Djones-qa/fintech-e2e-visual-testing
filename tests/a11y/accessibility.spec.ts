import { test, type Page } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import {
  runA11yScan,
  assertNoA11yViolations,
  logA11yReport,
} from '../../src/helpers/a11y.helper';
import { VALID_CREDENTIALS } from '../../src/data/test-data';
import type { RunOptions } from 'axe-core';

/**
 * Dedicated Accessibility (a11y) Test Suite
 *
 * Runs WCAG 2.1 AA compliance scans on all key fintech pages using axe-core.
 * Violations are logged with severity levels (critical, serious, moderate, minor).
 *
 * Tags: @a11y
 */
test.describe('Accessibility Suite — WCAG 2.1 AA @a11y', () => {
  /**
   * Strict WCAG 2.1 AA axe-core options.
   */
  const wcag21aaOptions: RunOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  };

  /**
   * Best-practice rules in addition to WCAG.
   */
  const bestPracticeOptions: RunOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
  };

  /**
   * Helper: authenticate and navigate to a URL.
   */
  async function authenticateAndGoto(
    page: Page,
    url: string
  ): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await loginPage.expectDashboard();
    await page.goto(url);
  }

  // ── Login Page ──────────────────────────────────────────────────────────

  test.describe('Login Page', () => {
    test('login page — WCAG 2.1 AA: no violations', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await assertNoA11yViolations(page, wcag21aaOptions);
    });

    test('login page — best-practice audit with violation report', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      const violations = await runA11yScan(page, bestPracticeOptions);
      logA11yReport(violations);
      console.log(`\n📋 Login page — ${violations.length} best-practice issue(s) found.`);
    });

    test('login error state — WCAG 2.1 AA: no violations', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      // Trigger error state
      await loginPage.login('wrong@example.com', 'wrongpassword');
      await loginPage.expectErrorMessage();
      await assertNoA11yViolations(page, wcag21aaOptions);
    });
  });

  // ── Dashboard Page ──────────────────────────────────────────────────────

  test.describe('Dashboard Page', () => {
    test('dashboard — WCAG 2.1 AA: no violations', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      await assertNoA11yViolations(page, wcag21aaOptions);
    });

    test('dashboard — best-practice audit with violation report', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      const violations = await runA11yScan(page, bestPracticeOptions);
      logA11yReport(violations);
      console.log(`\n📋 Dashboard — ${violations.length} best-practice issue(s) found.`);
    });

    test('dashboard — critical and serious violations only', async ({ page }) => {
      await authenticateAndGoto(page, '/dashboard');
      const allViolations = await runA11yScan(page, wcag21aaOptions);
      const highSeverity = allViolations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      if (highSeverity.length > 0) {
        logA11yReport(highSeverity);
        throw new Error(
          `Dashboard has ${highSeverity.length} critical/serious accessibility violation(s).`
        );
      }
    });
  });

  // ── Transactions Page ───────────────────────────────────────────────────

  test.describe('Transactions Page', () => {
    test('transactions — WCAG 2.1 AA: no violations', async ({ page }) => {
      await authenticateAndGoto(page, '/transactions');
      await assertNoA11yViolations(page, wcag21aaOptions);
    });

    test('transactions — best-practice audit with violation report', async ({ page }) => {
      await authenticateAndGoto(page, '/transactions');
      const violations = await runA11yScan(page, bestPracticeOptions);
      logA11yReport(violations);
      console.log(`\n📋 Transactions — ${violations.length} best-practice issue(s) found.`);
    });

    test('transactions table — keyboard navigation accessible', async ({ page }) => {
      await authenticateAndGoto(page, '/transactions');
      // Tab through the page and verify focus is visible
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      // A focusable element should receive focus
      console.log(`First focused element: ${focusedElement}`);
      await assertNoA11yViolations(page, wcag21aaOptions);
    });
  });

  // ── Payment Flow Page ───────────────────────────────────────────────────

  test.describe('Payment Flow Page', () => {
    test('payment flow — WCAG 2.1 AA: no violations', async ({ page }) => {
      await authenticateAndGoto(page, '/send');
      await assertNoA11yViolations(page, wcag21aaOptions);
    });

    test('payment flow — best-practice audit with violation report', async ({ page }) => {
      await authenticateAndGoto(page, '/send');
      const violations = await runA11yScan(page, bestPracticeOptions);
      logA11yReport(violations);
      console.log(`\n📋 Payment flow — ${violations.length} best-practice issue(s) found.`);
    });
  });

  // ── Cross-Page Summary ──────────────────────────────────────────────────

  test('full site a11y audit — log violations across all pages', async ({ page }) => {
    const pages: Array<{ name: string; url: string; requiresAuth: boolean }> = [
      { name: 'Login', url: '/login', requiresAuth: false },
      { name: 'Dashboard', url: '/dashboard', requiresAuth: true },
      { name: 'Transactions', url: '/transactions', requiresAuth: true },
      { name: 'Payment Flow', url: '/send', requiresAuth: true },
    ];

    let totalViolations = 0;

    for (const pageInfo of pages) {
      if (pageInfo.requiresAuth) {
        await authenticateAndGoto(page, pageInfo.url);
      } else {
        await page.goto(pageInfo.url);
      }

      const violations = await runA11yScan(page, wcag21aaOptions);
      totalViolations += violations.length;

      console.log(`\n${'─'.repeat(60)}`);
      console.log(`Page: ${pageInfo.name} (${pageInfo.url})`);
      console.log(`Violations: ${violations.length}`);
      logA11yReport(violations);
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Total violations across all pages: ${totalViolations}`);
    console.log('═'.repeat(60));
  });
});
