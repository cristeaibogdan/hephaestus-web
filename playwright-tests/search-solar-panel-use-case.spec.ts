import {SearchSolarPanelUseCase, SolarPanel} from "../src/use-cases/search-solar-panel-use-case";
import { expect, test } from '@playwright/test';
import {SearchSolarPanelPlaywrightAdapter} from "../src/use-cases/search-solar-panel-playwright-adapter";

test('SHOULD return solar panel (OUTPUT) WHEN given serialNumber (INPUT)', async ({ page }) => {
  // GIVEN
  // or straight into async if using customTest with base.ts. But this causes reliance on playwright. You'll need to write another test.
  const searchSolarPanelPlaywrightAdapter: SearchSolarPanelUseCase = new SearchSolarPanelPlaywrightAdapter(page)
  const serialNumber = "1234567890";

  // WHEN
  const actual: SolarPanel = await searchSolarPanelPlaywrightAdapter.searchBySerialNumber(serialNumber);

  // THEN
  const expected: SolarPanel = {
    name: "",
    model: "",
    type: "",
    serialNumber: ""
  }

  expect(actual).toEqual(expected)
});

