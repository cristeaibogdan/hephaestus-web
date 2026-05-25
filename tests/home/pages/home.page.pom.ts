import { Locator, type Page } from '@playwright/test';

export class HomePagePom {

  constructor(
    private page: Page
  ) {}

  async goto(): Promise<void> {
    await this.page.goto('/home');
  }

  washingMachines(): Locator {
    return this.page.getByText('Washing Machines');
  }

  dishwashers(): Locator {
    return this.page.getByText('Dishwashers');
  }

  solarPanels(): Locator {
    return this.page.getByText('Solar Panels');
  }
}