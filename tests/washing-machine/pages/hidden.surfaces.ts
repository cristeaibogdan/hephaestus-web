import { type Locator } from '@playwright/test';

/**
 * locator(mat-checkbox) wrapper is used throughout instead of getByRole('checkbox') or getByLabel().
 * Clicking the native input directly fails because mat-card intercepts pointer events,
 * causing a timeout. Clicking the mat-checkbox wrapper works around this limitation.
 */
export class HiddenSurfaces {
  
  constructor(
    private expansionPanel: Locator
  ) {}
  
  async enable(): Promise<void> {
    await this.expansionPanel
      .getByRole('checkbox', { name: 'Applicable' })
      .click();
  }

  async checkScratches(): Promise<void> {
    await this.expansionPanel
      .locator('mat-checkbox', { hasText: 'Scratches' })
      .click();
  }

  async fillScratchesLength(value: number): Promise<void> {
    await this.expansionPanel
      .getByRole('article')
      .filter({ hasText: 'Select scratches length (cm)' })
      .getByRole('slider')
      .fill(String(value));
  }

  async checkDents(): Promise<void> {
    await this.expansionPanel
      .locator('mat-checkbox', { hasText: 'Dents' })
      .click();
  }

  async fillDentsDepth(value: number): Promise<void> {
    await this.expansionPanel
      .getByRole('article')
      .filter({ hasText: 'Select dents depth (cm)' })
      .getByRole('slider')
      .fill(String(value));
  }

  async checkMinorDamages(): Promise<void> {
    await this.expansionPanel
      .locator('mat-checkbox', { hasText: 'Minor Damages' })
      .click();
  }

  async fillMinorDamages(value: string): Promise<void> {
    await this.expansionPanel
      .getByRole('article')
      .filter({ hasText: 'Input minor damages description' })
      .getByRole('textbox')
      .fill(value);
  }

  async checkMajorDamages(): Promise<void> {
    await this.expansionPanel
      .locator('mat-checkbox', { hasText: 'Major Damages' })
      .click();
  }

  async fillMajorDamages(value: string): Promise<void> {
    await this.expansionPanel
      .getByRole('article')
      .filter({ hasText: 'Input major damages description' })
      .getByRole('textbox')
      .fill(value);
  }
}