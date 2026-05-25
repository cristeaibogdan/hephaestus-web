import { expect } from '@playwright/test';
import { customTest } from '../base';
import { WashingMachineHistoryPagePom } from './pages/washing-machine-history.page.pom';

/**
 * Given a serial number, find a washing machine with that serialNumber.
 * Other properties are implementation details.
 * 
 * 
 * Idea: Using resources in backend to point to a temporary database, that will be deleted at the end of the
 * test suite. Can use a file implementationinstead of the database, or a collection. 
 */
customTest('filters and finds a single serialNumber', async ({ washingMachineHistoryPagePom }) => {
  await washingMachineHistoryPagePom.goto(); // Can be extracted in a beforeEach

  await filterBySerialNumber(washingMachineHistoryPagePom, 'fasda');

  await washingMachineHistoryPagePom.applyFilter();

  expect(washingMachineHistoryPagePom.findRowBySerialNumber('fasda')).toBeTruthy();
});

customTest('Finds specific row and aserts data', async ({ washingMachineHistoryPagePom }) => {
  await washingMachineHistoryPagePom.goto();

  const row = washingMachineHistoryPagePom.findRowBySerialNumber('sda');
  console.log(row);

  await expect(row.manufacturer()).toHaveText('Gorenje');
  await expect(row.model()).toHaveText('WA946');
  await expect(row.type()).toHaveText('N/A');
});




async function filterBySerialNumber(washingMachineHistoryPage: WashingMachineHistoryPagePom, serialNumber: string) {
  await washingMachineHistoryPage.filterByCreatedDate('2026-03-06');
  await washingMachineHistoryPage.filterByIdentificationMode('Data Matrix');
  await washingMachineHistoryPage.filterByManufacturer('Bosch');
  await washingMachineHistoryPage.filterByModel('WGB256A1GB');
  await washingMachineHistoryPage.filterByType('N/A');

  await washingMachineHistoryPage.filterBySerialNumber(serialNumber);

  await washingMachineHistoryPage.filterByReturnType('Service');
  await washingMachineHistoryPage.filterByDamageType('In Use');
  await washingMachineHistoryPage.filterByRecommendation('REPACKAGE');
}

