import test from "node:test";
import {SearchSolarPanelUseCase, SolarPanel} from "./search-solar-panel-use-case";
import assert from "node:assert";
import {SearchSolarPanelPlaywrightAdapter} from "./playwright/search-solar-panel-playwright-adapter";

test('SHOULD return solar panel (OUTPUT) WHEN given serialNumber (INPUT)', () => {
  // GIVEN
  const serialNumber = "1234567890";
  var searchSolarPanelUseCase: SearchSolarPanelUseCase = new SearchSolarPanelPlaywrightAdapter();

  // WHEN
  const actual: SolarPanel = searchSolarPanelUseCase.searchBySerialNumber(serialNumber);

  // THEN
  const expected: SolarPanel = {
    name: "something",
    model: "",
    type: "",
    serialNumber: ""
  }

  assert.deepEqual(actual, expected);
});
