import { Locator, Page } from "@playwright/test";

export class WashingMachineHistoryViewModal {

  constructor(
    private page: Page
  ) {}
  
  async open(index: number): Promise<void> {
    await this.page
      .locator('tr.mat-mdc-row')
      .nth(index)
      .getByRole('button', { name: 'View' })
      .click();
  }

  category(): Locator {
    return this.productInformationList().filter({ hasText: 'Category:' });
  }

  manufacturer(): Locator {
    return this.productInformationList().filter({ hasText: 'Manufacturer:' });
  }

  serialNumber(): Locator {
    return this.productInformationList().filter({ hasText: 'Serial Number:' });
  }

  model(): Locator {
    return this.productInformationList().filter({ hasText: 'Model:' });
  }

  type(): Locator {
    return this.productInformationList().filter({ hasText: 'Type:' });
  }

  private productInformationList(): Locator {
    return this.page.getByRole('list').first().getByRole('listitem');
  }

  identificationMode(): Locator {
    return this.identificationModeAndDamageTypeList().filter({ hasText: 'Identification Mode:' });
  }

  returnType(): Locator {
    return this.identificationModeAndDamageTypeList().filter({ hasText: 'Return Type:' });
  }

  damageType(): Locator {
    return this.identificationModeAndDamageTypeList().filter({ hasText: 'Damage Type:' });
  }

  private identificationModeAndDamageTypeList(): Locator {
    return this.page.getByRole('list').nth(1).getByRole('listitem');
  }

  async close(): Promise<void> {
    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async downloadRecommendation(): Promise<void> {
    await this.page.getByRole('button', { name: 'Download Recommendation' }).click();
  }


}