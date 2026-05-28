import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result, RunOptions } from 'axe-core';

/**
 * Severity levels for axe-core violations, ordered from most to least severe.
 */
const SEVERITY_ORDER: Record<string, number> = {
  critical: 4,
  serious: 3,
  moderate: 2,
  minor: 1,
};

/**
 * Default axe-core run options targeting WCAG 2.1 AA compliance.
 */
const DEFAULT_AXE_OPTIONS: RunOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
  },
};

/**
 * Run an axe-core accessibility scan on the given page.
 *
 * @param page - The Playwright Page to scan.
 * @param options - Optional axe-core RunOptions to override defaults.
 * @returns Array of accessibility violations found.
 *
 * @example
 * ```ts
 * const violations = await runA11yScan(page);
 * ```
 */
export async function runA11yScan(
  page: Page,
  options: RunOptions = DEFAULT_AXE_OPTIONS
): Promise<Result[]> {
  const builder = new AxeBuilder({ page }).options(options);
  const results: AxeResults = await builder.analyze();
  return results.violations;
}

/**
 * Assert that the given page has zero accessibility violations.
 * Throws a descriptive error listing all violations if any are found.
 *
 * @param page - The Playwright Page to scan.
 * @param options - Optional axe-core RunOptions.
 *
 * @example
 * ```ts
 * await assertNoA11yViolations(page);
 * ```
 */
export async function assertNoA11yViolations(
  page: Page,
  options: RunOptions = DEFAULT_AXE_OPTIONS
): Promise<void> {
  const violations = await runA11yScan(page, options);

  if (violations.length > 0) {
    logA11yReport(violations);
    throw new Error(
      `Accessibility scan found ${violations.length} violation(s).\n` +
        `See the console output above for details.\n` +
        `URL: ${page.url()}`
    );
  }
}

/**
 * Pretty-print an array of axe-core violations to the console.
 * Violations are sorted by severity (critical → minor).
 *
 * @param violations - Array of axe-core Result objects.
 *
 * @example
 * ```ts
 * const violations = await runA11yScan(page);
 * logA11yReport(violations);
 * ```
 */
export function logA11yReport(violations: Result[]): void {
  if (violations.length === 0) {
    console.log('✅  No accessibility violations found.');
    return;
  }

  // Sort by severity descending
  const sorted = [...violations].sort(
    (a, b) =>
      (SEVERITY_ORDER[b.impact ?? 'minor'] ?? 0) -
      (SEVERITY_ORDER[a.impact ?? 'minor'] ?? 0)
  );

  console.log(`\n♿  Accessibility Report — ${violations.length} violation(s) found\n`);
  console.log('═'.repeat(70));

  sorted.forEach((violation, index) => {
    const impact = violation.impact?.toUpperCase() ?? 'UNKNOWN';
    const impactEmoji = getImpactEmoji(violation.impact ?? 'minor');

    console.log(`\n${index + 1}. ${impactEmoji} [${impact}] ${violation.id}`);
    console.log(`   Description : ${violation.description}`);
    console.log(`   Help        : ${violation.helpUrl}`);
    console.log(`   Tags        : ${violation.tags.join(', ')}`);
    console.log(`   Nodes (${violation.nodes.length}):`);

    violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
      console.log(`     ${nodeIndex + 1}. Target : ${node.target.join(', ')}`);
      if (node.failureSummary) {
        console.log(`        Fix    : ${node.failureSummary.replace(/\n/g, '\n               ')}`);
      }
    });

    if (violation.nodes.length > 3) {
      console.log(`     ... and ${violation.nodes.length - 3} more node(s)`);
    }
  });

  console.log('\n' + '═'.repeat(70) + '\n');
}

/**
 * Map an axe-core impact level to a console emoji for quick visual scanning.
 * @param impact - The impact string from axe-core.
 */
function getImpactEmoji(impact: string): string {
  const map: Record<string, string> = {
    critical: '🔴',
    serious: '🟠',
    moderate: '🟡',
    minor: '🔵',
  };
  return map[impact] ?? '⚪';
}
