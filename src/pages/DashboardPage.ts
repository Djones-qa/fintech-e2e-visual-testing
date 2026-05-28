import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Fintech application Dashboard page.
 *
 * Covers the main authenticated landing page which displays account
 * balances, recent transactions, and the portfolio chart.
 *
 * @example
 * ```ts
 * const dashboard = new DashboardPage(page);
 * await dashboard.goto();
 * await dashboard.expectAccountBalance();
 * const balance = await dashboard.getBalanceText();
 * ```
 */
export class DashboardPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly heading: Locator;
  readonly accountBalanceCard: Locator;
  readonly balanceAmount: Locator;
  readonly transactionList: Locator;
  readonly transactionListItem: Locator;
  readonly portfolioChart: Locator;
  readonly portfolioChartCanvas: Locator;
  readonly quickActionsPanel: Locator;
  readonly sendMoneyButton: Locator;
  readonly addFundsButton: Locator;
  readonly notificationBell: Locator;
  readonly userAvatarMenu: Locator;
  readonly navSidebar: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.locator('[data-testid="dashboard-heading"]');
    this.accountBalanceCard = page.locator('[data-testid="account-balance-card"]');
    this.balanceAmount = page.locator('[data-testid="balance-amount"]');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionListItem = page.locator('[data-testid="transaction-list-item"]');
    this.portfolioChart = page.locator('[data-testid="portfolio-chart"]');
    this.portfolioChartCanvas = page.locator('[data-testid="portfolio-chart"] canvas');
    this.quickActionsPanel = page.locator('[data-testid="quick-actions-panel"]');
    this.sendMoneyButton = page.locator('[data-testid="send-money-btn"]');
    this.addFundsButton = page.locator('[data-testid="add-funds-btn"]');
    this.notificationBell = page.locator('[data-testid="notification-bell"]');
    this.userAvatarMenu = page.locator('[data-testid="user-avatar-menu"]');
    this.navSidebar = page.locator('[data-testid="nav-sidebar"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigate directly to the dashboard URL.
   * Assumes the user is already authenticated.
   */
  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.heading.waitFor({ state: 'visible', timeout: 15_000 });
  }

  /**
   * Retrieve the raw text content of the account balance element.
   * @returns The balance string, e.g. "$12,345.67".
   */
  async getBalanceText(): Promise<string> {
    await this.balanceAmount.waitFor({ state: 'visible' });
    return (await this.balanceAmount.textContent()) ?? '';
  }

  /**
   * Click the "Send Money" quick-action button.
   */
  async clickSendMoney(): Promise<void> {
    await this.sendMoneyButton.click();
  }

  /**
   * Click the "Add Funds" quick-action button.
   */
  async clickAddFunds(): Promise<void> {
    await this.addFundsButton.click();
  }

  /**
   * Open the user avatar dropdown menu.
   */
  async openUserMenu(): Promise<void> {
    await this.userAvatarMenu.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert that the account balance card is visible and contains a value.
   */
  async expectAccountBalance(): Promise<void> {
    await expect(this.accountBalanceCard).toBeVisible();
    await expect(this.balanceAmount).toBeVisible();
    // Balance should contain a currency symbol and digits
    await expect(this.balanceAmount).toHaveText(/[\$€£]\s?[\d,]+(\.\d{2})?/);
  }

  /**
   * Assert that the recent transaction list is visible and has at least one item.
   */
  async expectTransactionList(): Promise<void> {
    await expect(this.transactionList).toBeVisible();
    const count = await this.transactionListItem.count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Assert that the portfolio chart widget is rendered.
   */
  async expectPortfolioChart(): Promise<void> {
    await expect(this.portfolioChart).toBeVisible();
    await expect(this.portfolioChartCanvas).toBeVisible();
  }

  /**
   * Assert that the full dashboard layout is loaded and interactive.
   */
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.navSidebar).toBeVisible();
    await expect(this.accountBalanceCard).toBeVisible();
  }
}
