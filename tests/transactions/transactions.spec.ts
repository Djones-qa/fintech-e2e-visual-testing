import { test, expect } from '@playwright/test';
import { TransactionsPage } from '../../src/pages/TransactionsPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { assertNoA11yViolations, runA11yScan, logA11yReport } from '../../src/helpers/a11y.helper';
import { percySnapshotPage } from '../../src/helpers/percy.helper';
import { compareScreenshot, maskDynamicContent } from '../../src/helpers/visual.helper';
import {
  VALID_CREDENTIALS,
  DATE_RANGES,
  SEARCH_TERMS,
  MOCK_TRANSACTIONS,
} from '../../src/data/test-data';

/**
 * Transactions Page Tests
 *
 * Tags:
 *  @regression — full regression suite
 *  @a11y       — accessibility scans
 *  @visual     — visual regression snapshots
 */
test.describe('Transactions Page @regression', () => {
  let transactionsPage: TransactionsPage;

  /**
   * Authenticate and navigate to the transactions page before each test.
   */
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await loginPage.expectDashboard();

    transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();
  });

  // ── Functional Tests ────────────────────────────────────────────────────

  test('transactions page should load with the transaction table', async () => {
    await transactionsPage.expectTransactionsLoaded();
  });

  test('should filter transactions by current month date range', async () => {
    await transactionsPage.filterByDateRange(DATE_RANGES.currentMonth);
    await transactionsPage.expectTransactionsLoaded();
  });

  test('should filter transactions by previous month date range', async () => {
    await transactionsPage.filterByDateRange(DATE_RANGES.previousMonth);
    // May return results or empty state — both are valid
    const rowCount = await transactionsPage.transactionRows.count();
    if (rowCount === 0) {
      await transactionsPage.expectEmptyState();
    } else {
      await transactionsPage.expectTransactionsLoaded();
    }
  });

  test('should show empty state for a date range with no transactions', async () => {
    await transactionsPage.filterByDateRange(DATE_RANGES.noResults);
    await transactionsPage.expectEmptyState();
  });

  test('should search for a transaction by merchant name', async () => {
    await transactionsPage.searchTransaction(SEARCH_TERMS.validMerchant);
    await transactionsPage.expectTransactionRow(SEARCH_TERMS.validMerchant);
  });

  test('should show empty state for a search with no matches', async () => {
    await transactionsPage.searchTransaction(SEARCH_TERMS.noMatch);
    await transactionsPage.expectEmptyState();
  });

  test('should clear filters and restore the full transaction list', async () => {
    await transactionsPage.filterByDateRange(DATE_RANGES.noResults);
    await transactionsPage.expectEmptyState();
    await transactionsPage.clearFilters();
    await transactionsPage.expectTransactionsLoaded();
  });

  test('export CSV button should be visible and enabled', async () => {
    await transactionsPage.expectExportCsvVisible();
  });

  test('should trigger a CSV download when export button is clicked', async () => {
    await transactionsPage.exportCSV();
  });

  test('should display a known mock transaction row', async () => {
    // Search for the first mock transaction merchant
    const merchant = MOCK_TRANSACTIONS[0].merchant;
    await transactionsPage.searchTransaction(merchant);
    await transactionsPage.expectTransactionRow(merchant);
  });

  test('pagination next button should navigate to the next page', async ({ page }) => {
    const nextBtn = transactionsPage.paginationNext;
    const isVisible = await nextBtn.isVisible();
    if (isVisible) {
      await transactionsPage.goToNextPage();
      await transactionsPage.expectTransactionsLoaded();
    } else {
      // Single page of results — skip pagination assertion
      console.log('Pagination not present (single page of results).');
    }
  });

  // ── Accessibility Tests ─────────────────────────────────────────────────

  test('transactions page should have no WCAG 2.1 AA violations @a11y', async ({ page }) => {
    await assertNoA11yViolations(page);
  });

  test('transactions page a11y scan should log a detailed report @a11y', async ({ page }) => {
    const violations = await runA11yScan(page);
    logA11yReport(violations);
    console.log(`Transactions page violations found: ${violations.length}`);
  });

  test('filtered transactions state should have no a11y violations @a11y', async ({ page }) => {
    await transactionsPage.filterByDateRange(DATE_RANGES.currentMonth);
    await assertNoA11yViolations(page);
  });

  // ── Visual Regression Tests ─────────────────────────────────────────────

  test('transactions page should match Percy visual baseline @visual', async ({ page }) => {
    await maskDynamicContent(page, [
      '[data-testid="transaction-row"] .amount',
      '[data-testid="transaction-row"] .date',
    ]);
    await percySnapshotPage(page, 'Transactions - Default State');
  });

  test('transactions page should match Playwright screenshot baseline @visual', async ({
    page,
  }) => {
    await maskDynamicContent(page, [
      '[data-testid="transaction-row"] .date',
    ]);
    await compareScreenshot(page, 'transactions-default.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('transactions filtered state should match visual baseline @visual', async ({ page }) => {
    await transactionsPage.filterByDateRange(DATE_RANGES.currentMonth);
    await compareScreenshot(page, 'transactions-filtered.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
