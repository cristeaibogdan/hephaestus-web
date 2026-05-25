import { test as base } from '@playwright/test';
import { WashingMachineCreatePagePom } from './washing-machine/pages/washing-machine-create.page.pom';
import { WashingMachineHistoryPagePom } from './washing-machine/pages/washing-machine-history.page.pom';
import { HomePagePom } from './home/pages/home.page.pom';

type MyFixtures = {
  homePagePom: HomePagePom,
  washingMachineCreatePagePom: WashingMachineCreatePagePom,
  washingMachineHistoryPagePom: WashingMachineHistoryPagePom
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

  homePagePom: async({ page }, use) => {
    await use(new HomePagePom(page))
  },

  washingMachineCreatePagePom: async({ page }, use) => {
    // login logic => see video Playwright Myths
    await use(new WashingMachineCreatePagePom(page))
  },

  washingMachineHistoryPagePom: async({ page }, use) => {
    await use(new WashingMachineHistoryPagePom(page))
  }
})