import { Page, Locator, expect } from '@playwright/test';

/**
 * Options for filtering transactions by date range.
 */
export interface DateRangeFilter {
  /** Start date in YYYY-MM-DD format */
  from: string;
  /** End date in YYYY-MM-DD format */
  to: string;
}

/**
 * Page Object Model for the Fintech application Transactions page.
 *
 * Covers transaction listing, filtering, searching, and CSV export.
 *
 * @example
 * ```ts
 * const txPage = new TransactionsPage(page);
 * await txPage.goto();
 * await txPage.filterByDateRange({ from: '2024-01-01', to: '2024-01-31' });
 * await txPage.expectTransactionRow('Netflix');
 * ```
 */
export class TransactionsPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly heading: Locator;
  readonly transactionTable: Locator;
  readonly transactionRows: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly applyFilterButton: Locator;
  readonly clearFilterButton: Locator;
  readonly exportCsvButton: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrev: Locator;
  readonly emptyStateMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly filterPanel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.locator('[data-testid="transactions-heading"]');
    this.transactionTable = page.locator('[data-testid="transactions-table"]');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');
    this.searchInput = page.locator('[data-testid="transaction-search-input"]');
    this.searchButton = page.locator('[data-testid="transaction-search-btn"]');
    this.dateFromInput = page.locator('[data-testid="date-from-input"]');
    this.dateToInput = page.locator('[data-testid="date-to-input"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-btn"]');
    this.clearFilterButton = page.locator('[data-testid="clear-filter-btn"]');
    this.exportCsvButton = page.locator('[data-testid="export-csv-btn"]');
    this.paginationNext = page.locator('[data-testid="pagination-next"]');
    this.paginationPrev = page.locator('[data-testid="pagination-prev"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.filterPanel = page.locator('[data-testid="filter-panel"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigate to the transactions page and wait for the table to load.
   */
  async goto(): Promise<void> {
    await this.page.goto('/transactions');
    await this.heading.waitFor({ state: 'visible', timeout: 15_000 });
    // Wait for any loading spinner to disappear
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {
      // Spinner may not be present; ignore
    });
  }

  /**
   * Filter the transaction list by a date range.
   * @param range - Object with `from` and `to` dates (YYYY-MM-DD).
   */
  async filterByDateRange(range: DateRangeFilter): Promise<void> {
    await this.dateFromInput.fill(range.from);
    await this.dateToInput.fill(range.to);
    await this.applyFilterButton.click();
    // Wait for the table to refresh
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  /**
   * Search for a transaction by keyword.
   * @param query - The search term (e.g. merchant name or reference).
   */
  async searchTransaction(query: string): Promise<void> {
    await this.searchInput.clear();
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  /**
   * Clear all active filters and reset the transaction list.
   */
  async clearFilters(): Promise<void> {
    await this.clearFilterButton.click();
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  /**
   * Trigger a CSV export download.
   * Returns the download object so callers can inspect the file.
   */
  async exportCSV(): Promise<void> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportCsvButton.click(),
    ]);
    // Verify the download started (filename should end in .csv)
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  }

  /**
   * Navigate to the next page of transactions.
   */
  async goToNextPage(): Promise<void> {
    await this.paginationNext.click();
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert that a transaction row containing the given text is visible.
   * @param text - Text to match within a transaction row (e.g. merchant name).
   */
  async expectTransactionRow(text: string): Promise<void> {
    const row = this.page.locator('[data-testid="transaction-row"]', { hasText: text });
    await expect(row).toBeVisible();
  }

  /**
   * Assert that the transactions table is visible and has at least one row.
   */
  async expectTransactionsLoaded(): Promise<void> {
    await expect(this.transactionTable).toBeVisible();
    const count = await this.transactionRows.count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Assert that the export CSV button is visible and enabled.
   */
  async expectExportCsvVisible(): Promise<void> {
    await expect(this.exportCsvButton).toBeVisible();
    await expect(this.exportCsvButton).toBeEnabled();
  }

  /**
   * Assert that the empty state message is shown (no results).
   */
  async expectEmptyState(): Promise<void> {
    await expect(this.emptyStateMessage).toBeVisible();
  }
}
