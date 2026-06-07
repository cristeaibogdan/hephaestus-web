import { test as base } from '@playwright/test';
import { WashingMachineCreatePom } from './washing-machine/pages/washing-machine-create.pom';
import { WashingMachineHistoryPom } from './washing-machine/pages/washing-machine-history.pom';
import { HomePom } from './home/pages/home.pom';

type MyFixtures = {
  homePom: HomePom,
  washingMachineCreatePom: WashingMachineCreatePom,
  washingMachineHistoryPom: WashingMachineHistoryPom
}

export const customTest = base.extend<MyFixtures>({

  /**
   * Handles the initialization popup that appears when UI first starts.
   * Deactivated as clicking the skip initialization button redirects to another page and
   * breaks the flow of every test.
   */
  // page: async ({ page }, use) => {
  //   await page.addLocatorHandler(
  //     page.getByText('Welcome to Household Appliance Recommendation Services!'),
  //     async () => {
  //       await page.getByRole('button', { name: 'Skip Initialization' }).click();
  //       await page.getByRole('button', { name: 'Home' }).click();
  //     }
  //   );
  //   await use(page);
  // },

  homePom: async({ page }, use) => {
    await use(new HomePom(page))
  },

  washingMachineCreatePom: async({ page }, use) => {
    // login logic => see video Playwright Myths
    await use(new WashingMachineCreatePom(page))
  },

  washingMachineHistoryPom: async({ page }, use) => {
    await use(new WashingMachineHistoryPom(page))
  }
})
