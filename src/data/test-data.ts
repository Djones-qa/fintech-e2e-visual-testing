/**
 * Centralised test data constants for the fintech E2E test suite.
 *
 * All sensitive values (real credentials, real account numbers) must be
 * sourced from environment variables at runtime. The constants here are
 * safe mock/fixture values used in tests.
 */

// ── Credentials ─────────────────────────────────────────────────────────────

/** Valid test user credentials (values pulled from env at runtime). */
export const VALID_CREDENTIALS = {
  email: process.env.TEST_USER_EMAIL ?? 'testuser@fintech-demo.com',
  password: process.env.TEST_USER_PASSWORD ?? 'SuperSecureP@ssw0rd!',
} as const;

/** Invalid credential sets used to verify error handling. */
export const INVALID_CREDENTIALS = {
  wrongPassword: {
    email: process.env.TEST_USER_EMAIL ?? 'testuser@fintech-demo.com',
    password: 'WrongPassword123!',
  },
  unknownUser: {
    email: 'nobody@fintech-demo.com',
    password: 'AnyPassword123!',
  },
  emptyEmail: {
    email: '',
    password: 'AnyPassword123!',
  },
  emptyPassword: {
    email: process.env.TEST_USER_EMAIL ?? 'testuser@fintech-demo.com',
    password: '',
  },
  malformedEmail: {
    email: 'not-an-email',
    password: 'AnyPassword123!',
  },
} as const;

// ── Account Data ─────────────────────────────────────────────────────────────

/** Masked account numbers used in UI assertions (last 4 digits only). */
export const MASKED_ACCOUNTS = {
  checking: '****4321',
  savings: '****8765',
  investment: '****2109',
} as const;

/** Expected balance ranges for assertions (not exact values — avoids flakiness). */
export const BALANCE_PATTERNS = {
  /** Regex matching a USD balance, e.g. "$12,345.67" */
  usd: /\$[\d,]+\.\d{2}/,
  /** Regex matching any currency balance */
  any: /[\$€£¥][\d,]+(\.\d{2})?/,
} as const;

// ── Transaction Data ──────────────────────────────────────────────────────────

/** Mock transaction records used for search and filter tests. */
export const MOCK_TRANSACTIONS = [
  {
    id: 'txn-001',
    merchant: 'Netflix',
    amount: -15.99,
    currency: 'USD',
    date: '2024-06-01',
    category: 'Entertainment',
    status: 'completed',
  },
  {
    id: 'txn-002',
    merchant: 'Whole Foods Market',
    amount: -87.43,
    currency: 'USD',
    date: '2024-06-03',
    category: 'Groceries',
    status: 'completed',
  },
  {
    id: 'txn-003',
    merchant: 'Direct Deposit - Employer',
    amount: 3500.0,
    currency: 'USD',
    date: '2024-06-05',
    category: 'Income',
    status: 'completed',
  },
  {
    id: 'txn-004',
    merchant: 'Amazon',
    amount: -129.99,
    currency: 'USD',
    date: '2024-06-07',
    category: 'Shopping',
    status: 'completed',
  },
  {
    id: 'txn-005',
    merchant: 'Pending Transfer',
    amount: -250.0,
    currency: 'USD',
    date: '2024-06-10',
    category: 'Transfer',
    status: 'pending',
  },
] as const;

// ── Date Ranges ───────────────────────────────────────────────────────────────

/** Pre-defined date ranges for transaction filter tests. */
export const DATE_RANGES = {
  /** Current month (June 2024 — adjust as needed for your test environment) */
  currentMonth: {
    from: '2024-06-01',
    to: '2024-06-30',
  },
  /** Previous month */
  previousMonth: {
    from: '2024-05-01',
    to: '2024-05-31',
  },
  /** Last 7 days relative to a fixed anchor date */
  lastSevenDays: {
    from: '2024-06-04',
    to: '2024-06-10',
  },
  /** A range that should return no results */
  noResults: {
    from: '2000-01-01',
    to: '2000-01-02',
  },
} as const;

// ── Search Terms ──────────────────────────────────────────────────────────────

/** Search terms used in transaction search tests. */
export const SEARCH_TERMS = {
  /** Should match at least one transaction */
  validMerchant: 'Netflix',
  /** Should match multiple transactions */
  partialMatch: 'Amazon',
  /** Should return no results */
  noMatch: 'XYZNONEXISTENTMERCHANT12345',
} as const;

// ── Viewports ─────────────────────────────────────────────────────────────────

/** Standard viewport sizes used in visual regression tests. */
export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 900 },
  widescreen: { width: 1920, height: 1080 },
} as const;
