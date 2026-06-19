import {SearchWashingMachinePort} from "../src/structure-discovery/search-washing-machine.port";
import {expect, test} from '@playwright/test';
import {SearchWashingMachinePlaywrightAdapter} from "../src/structure-discovery/search-washing-machine.playwright-adapter";
import {DeleteWashingMachinePort} from "../src/structure-discovery/delete-washing-machine.port";
import {DeleteWashingMachineInMemoryAdapter} from "../src/structure-discovery/delete-washing-machine.in-memory-adapter";
import {
  DeleteWashingMachinePlaywrightAdapter
} from "../src/structure-discovery/delete-washing-machine.playwright-adapter";

test('SHOULD delete washing machine WHEN given serialNumber', async ({ page }) => {
  // GIVEN
  const searchWashingMachinePort: SearchWashingMachinePort = new SearchWashingMachinePlaywrightAdapter(page);
  const underTest: DeleteWashingMachinePort = new DeleteWashingMachinePlaywrightAdapter(page);

  // WHEN
  await underTest.deleteBySerialNumber("abc")
  const actual = await searchWashingMachinePort.searchBySerialNumber("abc");

  // THEN
  expect(actual).toBeNull();
});

test('SHOULD delete washing machine WHEN given serialNumber [HYBRID]', async ({ page }) => {
  // GIVEN
  const searchWashingMachinePort: SearchWashingMachinePort = new SearchWashingMachinePlaywrightAdapter(page);
  const underTest: DeleteWashingMachinePort = new DeleteWashingMachineInMemoryAdapter();

  // WHEN
  await underTest.deleteBySerialNumber("abc")
  const actual = await searchWashingMachinePort.searchBySerialNumber("abc");

  // THEN
  expect(actual).toBeNull();
});
