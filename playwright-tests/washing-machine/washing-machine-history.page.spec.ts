import { expect } from '@playwright/test';
import { pageTest} from '../base';
import { TestData } from "../test-data";

pageTest('should find washing machine when filtering by serialNumber', async ({ washingMachineHistoryPom, washingMachineApiMock }) => {
  await washingMachineApiMock.search([
    TestData.createSearchWashingMachineResponse({
      manufacturer: 'Gorenje',
      model: 'WA946',
      type: 'N/A',
      serialNumber: 'sda'
    })
  ]);

  await washingMachineHistoryPom.goto();

  const row = washingMachineHistoryPom.findRowBySerialNumber('sda');
  await expect(row.manufacturer()).toHaveText('Gorenje');
  await expect(row.model()).toHaveText('WA946');
  await expect(row.type()).toHaveText('N/A');
});

pageTest('should display message when no data is available in table', async ({ washingMachineHistoryPom, washingMachineApiMock, notificationPom }) => {
  await washingMachineApiMock.search([]);

  await washingMachineHistoryPom.goto();

  await expect(notificationPom.getMessage('No products match the selected filter criteria')).toBeVisible();
});

pageTest('should display backend message when something goes wrong', async ({ washingMachineHistoryPom, washingMachineApiMock, notificationPom }) => {
  await washingMachineApiMock.searchError(500, "Custom Error From The Backend");

  await washingMachineHistoryPom.goto();

  await expect(notificationPom.getMessage('Custom Error From The Backend')).toBeVisible();
});


