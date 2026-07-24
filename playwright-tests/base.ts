import {Page, test as base} from '@playwright/test';
import { WashingMachineCreatePom } from './washing-machine/pages/washing-machine-create.pom';
import { WashingMachineHistoryPom } from './washing-machine/pages/washing-machine-history.pom';
import { HomePom } from './home/pages/home.pom';
import {WashingMachineApi} from "./washing-machine/washing-machine.api";
import {WashingMachineApiMock} from "./washing-machine/washing-machine.api-mock";
import {NotificationPom} from "./shared/notification.pom";

interface PomFixtures {
  homePom: HomePom,
  washingMachineCreatePom: WashingMachineCreatePom,
  washingMachineHistoryPom: WashingMachineHistoryPom,
  notificationPom: NotificationPom
}

interface PageTestFixtures extends PomFixtures {
  washingMachineApiMock: WashingMachineApiMock
}

interface E2ETestFixtures extends PomFixtures {
  washingMachineApi: WashingMachineApi
}

const sharedTest = base.extend<PomFixtures>({
  /**
   * Overrides the default `page` fixture to intercept Angular Material's initialization
   * spinner dialog before each test.
   *
   * The dialog is triggered by `APP_INITIALIZER` on every browser bootstrap, and blocks
   * interaction with the page until the backends respond or the user skips.
   *
   * `addLocatorHandler` fires when the trigger locator is found mid-test, and re-checks
   * immediately after the handler returns. The handler MUST fully remove the trigger from
   * the DOM before returning — otherwise Playwright fires it again on the lingering overlay.
   * Angular Material's dialog teardown is async (exit animation), so `waitFor({ state: 'hidden' })`
   * is required at the end of both branches to satisfy this contract.
   */
  page: async ({ page }, use) => {
    await page.addLocatorHandler(
      page.getByText('Welcome to Household Appliance Recommendation Services!'),
      async () => {
        const skipButton = page.getByRole('button', { name: 'Skip Initialization' });
        const dialogText = page.getByText('Welcome to Household Appliance Recommendation Services!');

        if (await skipButton.isVisible()) {
          // Backends are down — dialog is staying open, intervene manually.
          await skipButton.click({ force: true }); // force: true bypasses Angular Material's unstable ripple state
          await page.waitForURL('**/initialization-fail'); // wait for redirect before goBack to avoid a navigation race
          await page.goBack();
        }
        // else: backends responded, wakeupBackends() closed the dialog itself, nothing to do.

        // Both branches: hold the handler open until Angular Material fully removes
        // the overlay from the DOM. Without this, Playwright re-checks immediately,
        // finds the still-animating dialog, and fires the handler a second time.
        await dialogText.waitFor({ state: 'hidden' });
      }
    );
    await use(page);
  },

  homePom: async({ page }, use) => {
    await use(new HomePom(page))
  },

  washingMachineCreatePom: async({ page }, use) => {
    // login logic => see video Playwright Myths
    await use(new WashingMachineCreatePom(page))
  },

  washingMachineHistoryPom: async({ page }, use) => {
    await use(new WashingMachineHistoryPom(page))
  },

  notificationPom: async ({ page }, use) => {
    await use(new NotificationPom(page));
  },
});

export const e2eTest = sharedTest.extend<E2ETestFixtures>({
  washingMachineApi: async ({ request }, use) => {
    const api = new WashingMachineApi(request);
    try {
      await use(api);
    } finally {
      await api.cleanup();
    }
  },
})

export const pageTest = sharedTest.extend<PageTestFixtures>({
  washingMachineApiMock: async ({ page }, use) => {
    // await wakeupSuccessMock(page); // TODO: Causes collision issues in mocked tests. You can't mock a second time, so it always returns []
    await use(new WashingMachineApiMock(page));
  }
})

/**
 * Mocks the backend wake-up checks performed by `InitializationService` so that
 * `wakeupBackends()` resolves immediately with both services reporting "awake".
 *
 * Without this, `pageTest` runs have no real backend behind these endpoints, causing
 * `wakeupWashingMachine()` / `wakeupProduct()` to retry (3x, 1s delay) and potentially
 * redirect to `/initialization-fail` mid-test — a race that manifests as an intermittent
 * timeout depending on when it fires relative to the test's own assertions.
 */
async function wakeupSuccessMock(page: Page): Promise<void> {
  await page.route("**/v1/washing-machines/*/validate", route => route.fulfill({ status: 200 }));
  await page.route("**/v1/products/*/manufacturers", route =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) })
  );
}
