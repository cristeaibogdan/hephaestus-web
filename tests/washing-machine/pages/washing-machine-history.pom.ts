import { type Locator, type Page } from '@playwright/test';
import { ViewModal } from './view.modal';

/**
 * As per ADR-004, Angular Material filter rows lack labels and placeholders by default.
 * aria-label was added to each input/select in the template to enable getByRole().
 */
export class WashingMachineHistoryPom {

  readonly viewModal = new ViewModal(this.page);

  constructor(
    private page: Page
  ) {}

  async goto(): Promise<void> {
    await this.page.goto('/washing-machines/history');
  }

  async filterByCreatedDate(value: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Date filter' }).fill(value);
  }

  async filterByIdentificationMode(value: 'Data Matrix' | 'QR Code'): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Identification mode filter' }).click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async filterByManufacturer(value: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Manufacturer filter' }).fill(value);
  }

  async filterByModel(value: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Model filter' }).fill(value);
  }

  async filterByType(value: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Type filter' }).fill(value);
  }

  async filterBySerialNumber(value: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Serial number filter' }).fill(value);
  }

  async filterByReturnType(value: 'Service' | 'Commercial' | 'Transport'): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Return type filter' }).click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async filterByDamageType(value: 'In Use' | 'In Transit'): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Damage type filter' }).click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async filterByRecommendation(value: 'REPACKAGE' | 'RESALE' | 'OUTLET' | 'REPAIR' | 'DISASSEMBLE'): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Recommendation filter' }).click();
    await this.page.getByRole('option', { name: value }).click();
  }

  // TODO: Is this worth doing? YES!
  async filterBy(filters: {
    createdAt?: string;
    identificationMode?: 'Data Matrix' | 'QR Code';
    manufacturer?: string;
    model?: string;
    type?: string;
    serialNumber?: string;
    returnType?: 'Service' | 'Commercial' | 'Transport';
    damageType?: 'In Use' | 'In Transit';
    recommendation?: 'REPACKAGE' | 'RESALE' | 'OUTLET' | 'REPAIR' | 'DISASSEMBLE';
  }) {
    if (filters.createdAt) await this.filterByCreatedDate(filters.createdAt);
    if (filters.identificationMode) await this.filterByIdentificationMode(filters.identificationMode);
    if (filters.manufacturer) await this.filterByManufacturer(filters.manufacturer);
    if (filters.model) await this.filterByModel(filters.model);
    if (filters.type) await this.filterByType(filters.type);
    if (filters.serialNumber) await this.filterBySerialNumber(filters.serialNumber);
    if (filters.returnType) await this.filterByReturnType(filters.returnType);
    if (filters.damageType) await this.filterByDamageType(filters.damageType);
    if (filters.recommendation) await this.filterByRecommendation(filters.recommendation);
  }

  async applyFilter(): Promise<void> {
    await this.page.getByRole('button', { name: 'Filter' }).click();
  }

  async resetFilter(): Promise<void> {
    await this.page.getByRole('button', { name: 'Reset' }).click();
  }

  // async clickViewOnRow(index: number): Promise<void> {
  //   await this.page
  //     .locator('tr.mat-mdc-row')
  //     .nth(index)
  //     .getByRole('button', { name: 'View' })
  //     .click();
  // }

  async sortBy(
    columnName: "Created" | "Identification Mode" | "Manufacturer" | "Model" | "Type" | "Serial Number" | "Return Type" | "Damage Type" | "Recommendation",
    direction: "asc" | "desc" = "asc"
  ) {
    const header = this.page
      .getByRole('columnheader', { name: columnName.toUpperCase(), exact: true })
      .getByRole('button');

    await header.click();
    if (direction === "desc") {
      await header.click()
    };
  }

  /**
   * Finds a table row by its serial number column value.
   * Scopes the filter to the serial number cell using exact matching
   * to avoid false matches from partial serial number overlaps
   * (e.g. searching "saf" won't match "saf-yes" or "not-saf").
   *
   * @param serial - The exact serial number to search for.
   * @returns A {@link WashingMachineRow} wrapping the first matching row.
   */
  findRowBySerialNumber(serial: string): WashingMachineRow {
    const row: Locator = this.page.getByRole('row')
      .filter({
        has: this.page.locator('td.mat-column-serialNumber', { hasText: new RegExp(`^${serial}$`) }) // exact match
      })
      .first();

    return new WashingMachineRow(row);
  }
}

export class WashingMachineRow {
  constructor(private row: Locator) {}

  /**
   * Angular Material automatically adds mat-column-{columnDef} to every cell based
   * on the matColumnDef value in template — these are stable as long as the column
   * definition name doesn't change, which is far less likely than column order changing.
   */
  manufacturer(): Locator {
    return this.row.locator('td.mat-column-manufacturer');
  }

  model(): Locator {
    return this.row.locator('td.mat-column-model');
  }

  type(): Locator {
    return this.row.locator('td.mat-column-type');
  }
}
