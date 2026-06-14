import {SearchWashingMachineUseCase, WashingMachine} from "../src/use-cases/search-washing-machine-use-case";
import {expect, test} from '@playwright/test';
import {SearchWashingMachinePlaywrightAdapter} from "../src/use-cases/search-washing-machine-playwright-adapter";

// Needs playwright ui and frontend+backend up to run
test('SHOULD return washing machine (OUTPUT) WHEN given serialNumber (INPUT)', async ({ page }) => {
  // GIVEN
  // instead of manual instantiation we can inject via base.ts. But this means usage of customTest and reliance on playwright.
  const searchWashingMachineUseCase: SearchWashingMachineUseCase = new SearchWashingMachinePlaywrightAdapter(page);

  // WHEN
  const actual: WashingMachine = await searchWashingMachineUseCase.searchBySerialNumber("1234567890");

  // THEN
  const expected: WashingMachine = {
    name: "",
    model: "",
    type: "",
    serialNumber: "1234567890"
  };

  expect(actual).toEqual(expected);
});

