import { type Locator, type Page } from '@playwright/test';
import { VisibleSurfaces } from './visible.surfaces';
import { HiddenSurfaces } from './hidden.surfaces';

export class DamageStep {

  constructor(
    private page: Page
  ) {}

  getDamageStepHeader(): Locator {
    return this.page.getByText('Upload Images of Damaged Product');
  }

  async uploadImages(...imagePaths: string[]): Promise<void> {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.page.getByRole('button', { name: 'Upload Images' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(imagePaths);
  }

  async enablePackageApplicable(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Package Select applicable' })
      .getByLabel('Applicable')
      .check();
  }

  async checkPackageApplicableDamaged(): Promise<void> {
    await this.page.getByRole('checkbox', { name: 'Damaged' }).check();
  }

  async checkPackageApplicableDirty(): Promise<void> {
    await this.page.getByRole('checkbox', { name: 'Dirty' }).check();
  }

  async checkPackageApplicableRepackage(): Promise<void> {
    await this.page.getByRole('checkbox', { name: 'Repackage Material Available' }).check();
  }

  visibleSurfaces(): VisibleSurfaces {
    const expansionPanel = this.page
      .locator('mat-expansion-panel')
      .filter({ hasText: 'Select applicable damage for Visible Surfaces' });
    return new VisibleSurfaces(expansionPanel);
  }

  hiddenSurfaces(): HiddenSurfaces {
    const expansionPanel = this.page
      .locator('mat-expansion-panel')
      .filter({ hasText: 'Select applicable damage for Hidden Surfaces' });
    return new HiddenSurfaces(expansionPanel);
  }

  async fillProductPrice(price: number): Promise<void> {
    await this.page.getByLabel('Product Price')
      .fill(price.toString());
  }

  async fillProductRepairPrice(price: number): Promise<void> {
    await this.page.getByLabel('Product Repair Price')
      .fill(price.toString());
  }
  
  async next(): Promise<void> {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }

  noImageUploadedError(): Locator {
    return this.page.getByText("At least one image must be uploaded");
  }
  
  tooManyFilesError(): Locator {
    // exact: true is needed to avoid matching the hidden CDK tooltip that contains the same text
    return this.page.getByText('Upload is limited to 3 files', { exact: true });
  }

  invalidFileExtensionError(): Locator {
    return this.page.getByText('Only jpg, jpeg, png and bmp extensions are supported');
  }
}