import {SearchSolarPanelUseCase, SolarPanel} from "./search-solar-panel-use-case";
import {SearchSolarPanelInMemoryStubAdapter} from "./search-solar-panel-in-memory-stub-adapter";

describe('SearchSolarPanelUseCase', () => {
  it('SHOULD return solar panel (OUTPUT) WHEN given serialNumber (INPUT) - in memory', async ()=> {
    // GIVEN
    // or straight into async if using customTest with base.ts. But this causes reliance on playwright. You'll need to write another test.
    const searchSolarPanelInMemoryStubAdapter: SearchSolarPanelUseCase = new SearchSolarPanelInMemoryStubAdapter()
    const serialNumber = "1234567890";

    // WHEN
    const actual: SolarPanel = await searchSolarPanelInMemoryStubAdapter.searchBySerialNumber(serialNumber);

    // THEN
    const expected: SolarPanel = {
      name: "",
      model: "",
      type: "",
      serialNumber: ""
    }

    expect(actual).toEqual(expected)
  });
});


