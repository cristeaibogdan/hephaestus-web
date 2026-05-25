## Playwright Page Object Model with Fixtures

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
We use Playwright for integration and e2e tests.
The suite is in its early stages with no established pattern for structuring test logic.

Pain points:
- Selectors and interaction logic duplicated across spec files
- Multi-step flows cannot be reused across tests
- Specs mix "*what is tested*" with "*how to drive the UI*"

## Decision
Two complementary patterns address this: the **Page Object Model (POM)** and **Playwright Fixtures**.

### Page Object Model
A Page Object is a class that wraps a page or component and exposes **intent-based methods**
instead of raw locator calls. Specs interact with the application through these methods only —
they never reference selectors directly.

```ts
// washing-machine.page.ts
export class WashingMachinePage {
  constructor(private readonly page: Page) {}

  async selectProgram(program: string) {
   await this.page.getByTestId('program-select').click();
   await this.page.getByRole('option', { name: program }).click();
  }

  async startCycle() {
   await this.page.getByTestId('start-button').click();
  }
}
```

### Fixtures
By default, every test receives a `page` fixture from Playwright. 
We extend this to inject our own Page Objects.

```ts
// base.ts
import { test as base } from '@playwright/test';
import { WashingMachinePage } from './washing-machine/pages/washing-machine.page';
import { WashingMachineHistoryPage } from './washing-machine/pages/washing-machine-history.page';

type MyFixtures = {
  washingMachinePage: WashingMachinePage;
  washingMachineHistoryPage: WashingMachineHistoryPage;
};

export const customTest = base.extend<MyFixtures>({
  washingMachinePage: async ({ page }, use) => {
    await use(new WashingMachinePage(page));
  },

  washingMachineHistoryPage: async ({ page }, use) => {
    await use(new WashingMachineHistoryPage(page));
  },
});
```

With the fixture in place, a spec only imports `customTest` and declares the 
page objects it needs.

```ts
import { customTest } from '../fixtures';
import { expect } from '@playwright/test';

customTest('starts a wash cycle', async ({ washingMachinePage }) => {
  await washingMachinePage.selectProgram('Cotton');
  await washingMachinePage.startCycle();
  await expect(page.getByTestId('cycle-status')).toHaveText('Running');
});
```

### Rules
1. Page Objects must not contain assertions.

```ts
// ❌ Wrong — assertion inside POM
async startCycle() {
  await this.page.getByTestId('start-button').click();
  await expect(this.page.getByTestId('status')).toHaveText('Running');
}

// ✅ Correct — POM drives, spec asserts
async startCycle() {
  await this.page.getByTestId('start-button').click();
}
```

## Consequences
**Positives:**
- Selector changes require a fix in one place only
- Specs read as user journeys, not DOM interactions
- Test setup is centralised in fixtures, not duplicated across spec files

**Negatives:**
- Developers unfamiliar with Playwright's fixture model face a short learning curve
- Page objects can grow large over time, reducing maintainability

## Compliance
Enforcement is performed during code review. Reviewers should reject:
- Raw locator calls (`page.locator()`, `page.getByTestId()`, etc.) inside spec files
- Direct imports of `test` from `@playwright/test` in spec files

## References
- https://www.reddit.com/r/QualityAssurance/comments/1248csz/playwright_framework_best_practicesstructure/ 
- https://playwright.dev/docs/pom
- https://playwright.dev/docs/test-fixtures
- https://www.youtube.com/watch?v=k488kAtT-Pw

