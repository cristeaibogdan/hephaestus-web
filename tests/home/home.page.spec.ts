import { expect } from '@playwright/test';
import { customTest } from '../base';

customTest('displays all product categories when Home is reached', async ({ homePagePom }) => {
  await homePagePom.goto();

  await expect(homePagePom.washingMachines()).toBeVisible();
  await expect(homePagePom.dishwashers()).toBeVisible();
  await expect(homePagePom.solarPanels()).toBeVisible();
});
