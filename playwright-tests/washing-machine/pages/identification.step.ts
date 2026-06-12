import { expect, type Locator, type Page } from '@playwright/test';

export class IdentificationStep {

  constructor(
    private page: Page
  ) {}

  async selectIdentificationMode(mode: 'Data Matrix' | 'QR Code'): Promise<void> {
    // By default, mat-button-toggle-group acts like a radio-button group- only one item can be selected.
    await this.page.getByRole('radio', { name: mode }).click();
  }

  async selectManufacturer(manufacturer: string): Promise<void> {
    await this.page.getByLabel('Manufacturer').click();
    await this.page.getByRole('option', { name: manufacturer }).click();
  }

  async selectType(type: string): Promise<void> {
    await this.page.getByLabel('Type').click();
    await this.page.getByRole('option', { name: type }).click();
  }

  async selectModel(model: string): Promise<void> {
    await this.page.getByLabel('Model').click();
    await this.page.getByRole('option', { name: model }).click();
  }

  async fillSerialNumber(serialNumber: string): Promise<void> {
    await this.page.getByLabel('Serial Number').fill(serialNumber);

    /**
     * due to async validator which triggers on blur, we need to click outside 
     * and wait for the hint to be visible before proceeding further
     */
    await this.page.locator('body').click();
    await expect(this.page.getByText('Serial number is valid')).toBeVisible();
  }

  async selectReturnType(returnType: 'Service' | 'Commercial' | 'Transport'): Promise<void> {
    await this.page.getByRole('radio', { name: returnType }).click();
  }

  async selectDamageType(damageType: 'In Use' | 'In Transit'): Promise<void> {
    await this.page.getByRole('radio', { name: damageType }).click();
  }

  manufacturerRequired(): Locator {
    return this.page.getByText('Manufacturer is required');
  }

  /**
   * Both 'model' and 'type' fields share the same error message with no distinguishing attribute.
   * .first() is intentional — we only need to assert the error is visible at least once.
   */ 
  modelAndTypeRequired(): Locator {
    return this.page.getByText('At least model or type is required').first()
  }

  serialNumberRequired(): Locator {
    return this.page.getByText('Serial number is required');    
  }

  async next(): Promise<void> {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }

  async complete(): Promise<void> {
    await this.selectIdentificationMode('Data Matrix');
    await this.selectManufacturer('Bosch');
    await this.selectModel('WGB256A1GB');
    await this.selectType('BOS001');
    await this.fillSerialNumber('Un serial');
    await this.selectReturnType('Service');
    await this.selectDamageType('In Use');
    await this.next();
  }
}