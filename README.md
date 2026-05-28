# 🏦 fintech-e2e-visual-testing

> Enterprise-grade E2E visual regression & accessibility testing suite for FinTech applications.

[![CI](https://github.com/Djones-qa/fintech-e2e-visual-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/Djones-qa/fintech-e2e-visual-testing/actions/workflows/ci.yml)
[![Percy](https://percy.io/static/images/percy-badge.svg)](https://percy.io)
[![Chromatic](https://img.shields.io/badge/chromatic-visual--review-fc521f?logo=storybook&logoColor=white)](https://www.chromatic.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![axe-core](https://img.shields.io/badge/a11y-axe--core%20WCAG%202.1%20AA-663399?logo=accessibility&logoColor=white)](https://www.deque.com/axe/)

---

## Description

**fintech-e2e-visual-testing** is a production-ready, enterprise-grade end-to-end testing suite purpose-built for FinTech web applications. It combines **Playwright** for browser automation, **Percy** and **Chromatic** for cloud-based visual regression diffing, and **axe-core** for automated WCAG 2.1 AA accessibility compliance — all wired into a **GitHub Actions** CI/CD pipeline with cross-browser matrix testing across Chromium, Firefox, and WebKit.

The suite follows the **Page Object Model (POM)** pattern for maintainability, ships with fintech-specific test scenarios (login, dashboard, transactions, payment flows), and is fully typed with TypeScript strict mode.

---

## Topics

`#fintech` `#playwright` `#visual-testing` `#accessibility` `#a11y` `#percy` `#chromatic` `#cross-browser` `#qa-automation` `#e2e-testing` `#wcag` `#typescript` `#ci-cd` `#regression-testing` `#fintech-qa`

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Visual Testing](#visual-testing)
- [Accessibility Testing](#accessibility-testing)
- [CI/CD](#cicd)
- [Test Tags](#test-tags)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Features

- **Visual Regression (Percy)** — Cloud-based pixel-perfect diffing at 4 fintech-standard viewports (375, 768, 1280, 1920 px). Every PR gets a visual review link.
- **Visual Regression (Chromatic)** — Storybook component-level visual review integrated into the PR workflow.
- **Playwright Native Screenshots** — Local baseline diffing with configurable pixel-ratio and colour-threshold tolerances.
- **Accessibility (axe-core + WCAG 2.1 AA)** — Automated a11y scans on every key page. Violations are logged with severity (critical → minor), help URLs, and affected node targets.
- **Cross-browser Testing** — Full matrix across Chromium, Firefox, and WebKit (desktop + mobile viewports) via Playwright projects.
- **Page Object Model** — Clean, reusable POMs for Login, Dashboard, and Transactions pages. Tests stay readable and DRY.
- **CI/CD (GitHub Actions)** — Parallel browser matrix, Percy visual upload, Chromatic storybook review, HTML report artifacts, and retry logic on flaky tests.
- **FinTech-specific Scenarios** — Login flows, account balance assertions, transaction filtering/search, CSV export, portfolio chart rendering, and payment flows.
- **TypeScript Strict Mode** — Full type safety across all test code, helpers, and page objects.
- **Dynamic Content Masking** — Utility to hide live prices, timestamps, and chart canvases before snapshotting to eliminate false positives.

---

## Tech Stack

| Tool | Purpose | Version |
|---|---|---|
| [Playwright](https://playwright.dev) | Browser automation & test runner | ^1.44.1 |
| [@percy/playwright](https://docs.percy.io/docs/playwright) | Percy visual snapshot integration | ^1.0.6 |
| [@percy/cli](https://docs.percy.io/docs/cli) | Percy CLI for CI execution | ^1.28.8 |
| [Chromatic](https://www.chromatic.com) | Storybook visual review | ^11.5.4 |
| [axe-core](https://www.deque.com/axe/) | Accessibility rule engine | ^4.9.1 |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | axe-core Playwright integration | ^4.9.1 |
| [TypeScript](https://www.typescriptlang.org) | Type-safe test authoring | ^5.4.5 |
| [ESLint](https://eslint.org) | Linting & code quality | ^8.57.0 |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable loading | ^16.4.5 |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline | — |

---

## Project Structure

```
fintech-e2e-visual-testing/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
├── src/
│   ├── data/
│   │   └── test-data.ts            # Credentials, mock transactions, date ranges
│   ├── fixtures/
│   │   ├── auth.fixture.ts         # Authenticated page fixture
│   │   └── index.ts                # Fixture re-exports
│   ├── helpers/
│   │   ├── a11y.helper.ts          # axe-core scan helpers
│   │   ├── percy.helper.ts         # Percy snapshot helpers
│   │   ├── visual.helper.ts        # Playwright screenshot helpers
│   │   └── index.ts                # Helper re-exports
│   └── pages/
│       ├── LoginPage.ts            # Login POM
│       ├── DashboardPage.ts        # Dashboard POM
│       ├── TransactionsPage.ts     # Transactions POM
│       └── index.ts                # Page re-exports
├── tests/
│   ├── a11y/
│   │   └── accessibility.spec.ts   # Dedicated WCAG 2.1 AA suite
│   ├── auth/
│   │   └── login.spec.ts           # Login functional + visual + a11y
│   ├── dashboard/
│   │   └── dashboard.spec.ts       # Dashboard functional + visual + a11y
│   ├── transactions/
│   │   └── transactions.spec.ts    # Transactions functional + visual + a11y
│   └── visual/
│       └── visual-regression.spec.ts # Dedicated visual regression suite
├── snapshots/                      # Playwright screenshot baselines (committed)
├── .env.example                    # Environment variable template
├── .eslintrc.json                  # ESLint configuration
├── .gitignore
├── .percy.yml                      # Percy configuration
├── package.json
├── playwright.config.ts            # Playwright configuration
├── README.md
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20 ([download](https://nodejs.org))
- **npm** >= 10
- A running instance of your FinTech application (or a staging URL)

### Install

```bash
git clone https://github.com/Djones-qa/fintech-e2e-visual-testing.git
cd fintech-e2e-visual-testing
npm install
```

### Install Playwright Browsers

```bash
npx playwright install --with-deps
```

To install a specific browser only:

```bash
npx playwright install --with-deps chromium
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
BASE_URL=https://your-fintech-app.com
API_BASE_URL=https://your-fintech-app.com/api
TEST_USER_EMAIL=testuser@yourapp.com
TEST_USER_PASSWORD=YourSecurePassword!
PERCY_TOKEN=your_percy_token
CHROMATIC_PROJECT_TOKEN=your_chromatic_token
```

> **Never commit `.env` to version control.** It is listed in `.gitignore`.

---

## Running Tests

### Run all tests

```bash
npm test
```

### Run by browser

```bash
npm run test:chromium   # Chromium only
npm run test:firefox    # Firefox only
npm run test:webkit     # WebKit / Safari only
```

### Run by tag

```bash
npm run test:smoke       # @smoke — critical path tests
npm run test:regression  # @regression — full regression suite
npm run test:a11y        # @a11y — accessibility scans only
npm run test:visual      # @visual — visual regression only
```

### View the HTML report

```bash
npm run report
```

### Lint & type-check

```bash
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run typecheck    # TypeScript type-check (no emit)
```

### CI mode (GitHub Actions reporter)

```bash
npm run ci
```

---

## Visual Testing

### Percy

[Percy](https://percy.io) captures full-page snapshots and diffs them against the approved baseline in the cloud. Every PR gets a Percy build link showing exactly what changed visually.

**Run Percy locally** (requires `PERCY_TOKEN` in your `.env`):

```bash
npm run percy:exec
```

This runs `percy exec -- playwright test --grep @visual`, uploading snapshots to your Percy project.

**How it works:**

1. `percySnapshotPage(page, 'Dashboard - Default State')` is called inside `@visual` tests.
2. Percy captures the page at widths `[375, 768, 1280, 1920]` (configured in `.percy.yml`).
3. On the first run, Percy establishes the baseline.
4. On subsequent runs (PRs), Percy diffs against the baseline and posts a status check.

**Dynamic content masking** prevents false positives from live prices, timestamps, and chart canvases:

```ts
await maskDynamicContent(page, ['[data-testid="balance-amount"]']);
await percySnapshotPage(page, 'Dashboard - Masked');
```

### Chromatic

[Chromatic](https://www.chromatic.com) provides component-level visual review for Storybook stories. It runs automatically on PRs and posts a review link.

```bash
npm run chromatic
```

Requires `CHROMATIC_PROJECT_TOKEN` in your environment.

### Playwright Native Screenshots

For local baseline diffing without a cloud service, use `compareScreenshot`:

```ts
await compareScreenshot(page, 'login-desktop.png', {
  viewport: { width: 1280, height: 900 },
  maxDiffPixelRatio: 0.02,
  threshold: 0.2,
});
```

On first run, Playwright writes the baseline to `snapshots/`. Commit these files. On subsequent runs, Playwright diffs against the committed baseline and fails if the diff exceeds the threshold.

---

## Accessibility Testing

Accessibility tests use **axe-core** via `@axe-core/playwright` and target **WCAG 2.1 AA** compliance.

### Run a11y tests

```bash
npm run test:a11y
```

### How it works

The `a11y.helper.ts` module exposes three functions:

| Function | Description |
|---|---|
| `runA11yScan(page, options?)` | Runs axe-core and returns the violations array |
| `assertNoA11yViolations(page)` | Throws if any violations are found |
| `logA11yReport(violations)` | Pretty-prints violations sorted by severity |

**Example usage in a test:**

```ts
import { assertNoA11yViolations } from '../../src/helpers/a11y.helper';

test('dashboard should have no WCAG 2.1 AA violations @a11y', async ({ page }) => {
  await page.goto('/dashboard');
  await assertNoA11yViolations(page);
});
```

**Violation output format:**

```
♿  Accessibility Report — 2 violation(s) found

1. 🔴 [CRITICAL] color-contrast
   Description : Elements must have sufficient color contrast
   Help        : https://dequeuniversity.com/rules/axe/4.9/color-contrast
   Tags        : wcag2aa, wcag143
   Nodes (1):
     1. Target : .balance-amount
        Fix    : Fix any of the following: Element has insufficient color contrast...
```

### WCAG 2.1 AA Coverage

The suite scans for all `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `best-practice` axe-core tags, covering:

- Colour contrast (1.4.3)
- Keyboard navigation (2.1.1)
- Focus visible (2.4.7)
- Labels for form inputs (1.3.1, 4.1.2)
- ARIA roles and attributes
- Image alt text (1.1.1)
- Heading structure (1.3.1)

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `main` and `develop`.

### Jobs

| Job | Trigger | Description |
|---|---|---|
| `lint` | All pushes/PRs | ESLint + TypeScript type-check |
| `e2e` | All pushes/PRs | Cross-browser matrix (Chromium, Firefox, WebKit) |
| `a11y` | All pushes/PRs | WCAG 2.1 AA scans on Chromium |
| `percy` | PRs + main | Percy visual regression upload |
| `chromatic` | PRs + main | Chromatic Storybook visual review |

### Artifacts

- **HTML reports** — uploaded per browser, retained for 30 days.
- **Test results** (traces, screenshots, videos) — uploaded on failure, retained for 7 days.

### Secrets required

Add these to your GitHub repository secrets (`Settings → Secrets and variables → Actions`):

| Secret | Description |
|---|---|
| `BASE_URL` | URL of the application under test |
| `API_BASE_URL` | API base URL |
| `TEST_USER_EMAIL` | Test user email |
| `TEST_USER_PASSWORD` | Test user password |
| `PERCY_TOKEN` | Percy project token |
| `CHROMATIC_PROJECT_TOKEN` | Chromatic project token |

---

## Test Tags

Tests are tagged using Playwright's `--grep` flag. Tags are embedded in `test.describe` and `test` names.

| Tag | Purpose | Command |
|---|---|---|
| `@smoke` | Critical path — login, dashboard load | `npm run test:smoke` |
| `@regression` | Full regression suite | `npm run test:regression` |
| `@visual` | Visual regression snapshots (Percy + Playwright) | `npm run test:visual` |
| `@a11y` | Accessibility scans (axe-core WCAG 2.1 AA) | `npm run test:a11y` |

**Example — run only critical + visual tests on Firefox:**

```bash
npx playwright test --grep "@smoke|@visual" --project=firefox
```

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Write tests for your changes.
4. Ensure all tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Commit with a conventional commit message: `git commit -m "feat: add payment confirmation visual test"`
7. Push and open a pull request against `main`.

Please keep PRs focused. One feature or fix per PR.

---

## Author

**Darrius Jones**

- GitHub: [Djones-qa](https://github.com/Djones-qa)
- LinkedIn: [darrius-jones-28226b350](https://www.linkedin.com/in/darrius-jones-28226b350/)

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Darrius Jones

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
