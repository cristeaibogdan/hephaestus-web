import { expect } from '@playwright/test';
import { customTest } from '../base';

customTest('displays all product categories when Home is reached', async ({ homePom }) => {
  await homePom.goto();

  await expect(homePom.washingMachines()).toBeVisible();
  await expect(homePom.dishwashers()).toBeVisible();
  await expect(homePom.solarPanels()).toBeVisible();
});
