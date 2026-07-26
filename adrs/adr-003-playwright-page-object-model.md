## Playwright Page Object Model with Fixtures

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.
Fixture implementation superseded by ADR-005.

## Context
We use Playwright for integration and e2e tests.
The suite is in its early stages with no established pattern for structuring test logic.

Pain points:
- Selectors and interaction logic duplicated across spec files
- Multi-step flows cannot be reused across tests
- Specs mix "*what is tested*" with "*how to drive the UI*"

## Decision
Two complementary concepts are used: **Page Object Model (POM)** and **Playwright Fixtures**.

### Page Object Model
A Page Object is a class that wraps a page or component and exposes **intent-based methods**
instead of raw locator calls. Specs interact with the application through these methods only —
they never reference selectors directly.

```ts
// washing-machine-create.pom.ts
export class WashingMachineCreatePom {
  constructor(private readonly page: Page) {}

  async selectProgram(program: string) {
    await this.page.getByLabel('Program').click();
    await this.page.getByRole('option', { name: program }).click();
  }

  async startCycle() {
    await this.page.getByRole('button', { name: 'Start' }).click();
  }

  getCycleStatus() {
    return this.page.getByTestId('cycle-status');
  }
}
```
Page Objects may represent either an entire page or a reusable UI component shared across multiple pages.
For example, notifications are centralized in `notification.pom.ts`:

```ts
export class NotificationPom {
  constructor(private page: Page) { }

  getMessage(message: string, exact = false): Locator {
    return this.page.getByText(message, { exact: exact });
  }
}
```

### Fixtures
By default, every test receives a `page` fixture from Playwright. 
We extend this to inject our own Page Objects.

```ts
// base.ts
import { test as base } from '@playwright/test';

interface MyFixtures {
  washingMachineCreatePom: WashingMachineCreatePom,
  solarPanelHistoryPom: SolarPanelHistoryPom,
  notificationPom: NotificationPom
};

export const customTest = base.extend<MyFixtures>({
  washingMachineCreatePom: async ({ page }, use) => {
    await use(new WashingMachineCreatePom(page));
  },

  solarPanelHistoryPom: async ({ page }, use) => {
    await use(new SolarPanelHistoryPom(page));
  },

  notificationPom: async ({ page }, use) => {
    await use(new NotificationPom(page));
  },
});
```

With the fixture in place, a spec only imports `customTest` and declares only the Page Objects it requires.
```ts
import { customTest } from '../fixtures';
import { expect } from '@playwright/test';

customTest('starts a wash cycle', async ({ washingMachineCreatePom }) => {
  await washingMachineCreatePom.selectProgram('Cotton');
  await washingMachineCreatePom.startCycle();
  await expect(washingMachineCreatePom.getCycleStatus()).toHaveText('Running');
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
Exceptions are to be documented on the spot.
```ts
async fillSerialNumber(serialNumber: string): Promise<void> {
  await this.page.getByLabel('Serial Number').fill(serialNumber);

  /**
   * due to async validator which triggers on blur, we need to click outside
   * and wait for the hint to be visible before proceeding further.
   */
  await this.page.locator('body').click();
  await expect(this.page.getByText('Serial number is valid')).toBeVisible();
}
```

### POM Smartness
Composite methods sit on top of atomic methods for pages filled out the same way in most tests.
Atomic methods remain public for edge cases; composites are convenience only.

Composite methods may either use predefined values or require caller-provided inputs, whichever best matches the scenario.
```ts
interface CompleteOptions {
  identificationMode: 'Data Matrix' | 'QR Code',
  manufacturer: string,
  model: string
}

async completeAndContinue({
    identificationMode = 'Data Matrix',
    manufacturer = 'Bosch',
    model = 'WGB256A1GB',
}: Partial<CompleteOptions> = {}): Promise<void> {
    await this.selectIdentificationMode(identificationMode);
    await this.selectManufacturer(manufacturer);
    await this.selectModel(model);
    await this.next();
}

await identificationStep.completeAndContinue();                            // works with zero args
await identificationStep.completeAndContinue({ manufacturer: 'Siemens' }); // overrides just one field
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
Enforcement is performed during code review.

## References
- https://www.reddit.com/r/QualityAssurance/comments/1248csz/playwright_framework_best_practicesstructure/ 
- https://playwright.dev/docs/pom
- https://playwright.dev/docs/test-fixtures
- https://www.youtube.com/watch?v=k488kAtT-Pw
