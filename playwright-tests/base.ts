import { test as base } from '@playwright/test';
import { WashingMachineCreatePom } from './washing-machine/pages/washing-machine-create.pom';
import { WashingMachineHistoryPom } from './washing-machine/pages/washing-machine-history.pom';
import { HomePom } from './home/pages/home.pom';
import {SearchSolarPanelPlaywrightAdapter} from "../src/use-cases/search-solar-panel-playwright-adapter";

type MyFixtures = {
  homePom: HomePom,
  washingMachineCreatePom: WashingMachineCreatePom,
  washingMachineHistoryPom: WashingMachineHistoryPom,
  searchSolarPanelPlaywrightAdapter: SearchSolarPanelPlaywrightAdapter,
}

export const customTest = base.extend<MyFixtures>({

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

  searchSolarPanelPlaywrightAdapter: async ({ page }, use) => {
    await use(new SearchSolarPanelPlaywrightAdapter(page));
  }
})
