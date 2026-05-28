import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Fintech application Login page.
 *
 * Encapsulates all selectors and interactions for `/login`,
 * keeping test files clean and maintainable.
 *
 * @example
 * ```ts
 * const loginPage = new LoginPage(page);
 * await loginPage.goto();
 * await loginPage.fillEmail('user@example.com');
 * await loginPage.fillPassword('secret');
 * await loginPage.submit();
 * await loginPage.expectDashboard();
 * ```
 */
export class LoginPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginForm: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly logoImage: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginForm = page.locator('[data-testid="login-form"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="login-submit-btn"]');
    this.errorMessage = page.locator('[data-testid="login-error-message"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.logoImage = page.locator('[data-testid="app-logo"]');
    this.pageHeading = page.locator('h1');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigate to the login page and wait for the form to be visible.
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.loginForm.waitFor({ state: 'visible' });
  }

  /**
   * Fill the email input field.
   * @param email - The email address to enter.
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  /**
   * Fill the password input field.
   * @param password - The password to enter.
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login submit button and wait for navigation.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Perform a full login: fill credentials and submit.
   * @param email - User email.
   * @param password - User password.
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert that the browser has navigated to the dashboard after login.
   */
  async expectDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await expect(this.page.locator('[data-testid="dashboard-heading"]')).toBeVisible();
  }

  /**
   * Assert that an error message is displayed (e.g. wrong credentials).
   * @param message - Optional substring to match within the error text.
   */
  async expectErrorMessage(message?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  /**
   * Assert that the login page is fully rendered and ready.
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.loginForm).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
  }
}
