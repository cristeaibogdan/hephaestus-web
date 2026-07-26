import { type Locator, type Page } from '@playwright/test';
import { VisibleSurfaces } from './visible.surfaces';
import { HiddenSurfaces } from './hidden.surfaces';
import {TEST_FILES} from "../../assets/file.provider";

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

  async completeAndContinue(): Promise<void> {
    await this.uploadImages(
      TEST_FILES.images.jpg.landscape,
      TEST_FILES.images.jpeg.mountains,
      TEST_FILES.images.bmp.trail,
    );

    await this.enablePackageApplicable();
    await this.checkPackageApplicableDamaged();
    await this.checkPackageApplicableDirty();
    await this.checkPackageApplicableRepackage();

    const visibleSurfaces = this.visibleSurfaces();
    await visibleSurfaces.enable();
    await visibleSurfaces.checkScratches();
    await visibleSurfaces.fillScratchesLength(5);
    await visibleSurfaces.checkDents();
    await visibleSurfaces.fillDentsDepth(8.5);
    await visibleSurfaces.checkMinorDamages();
    await visibleSurfaces.fillMinorDamages("Some Minor Damages");
    await visibleSurfaces.checkMajorDamages();
    await visibleSurfaces.fillMajorDamages("Some Major major Damages");

    const hiddenSurfaces = this.hiddenSurfaces();
    await hiddenSurfaces.enable();
    await hiddenSurfaces.checkScratches();
    await hiddenSurfaces.fillScratchesLength(9);
    await hiddenSurfaces.checkDents();
    await hiddenSurfaces.fillDentsDepth(10);
    await hiddenSurfaces.checkMinorDamages();
    await hiddenSurfaces.fillMinorDamages("Some tiny minor hidden Damage");
    await hiddenSurfaces.checkMajorDamages();
    await hiddenSurfaces.fillMajorDamages("Some Major hidden Damage");

    await this.fillProductPrice(100);
    await this.fillProductRepairPrice(20);

    await this.next();
  }
}
