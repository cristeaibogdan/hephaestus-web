import {SearchSolarPanelUseCase, SolarPanel} from "./search-solar-panel-use-case";

export class SearchSolarPanelInMemoryStubAdapter implements SearchSolarPanelUseCase { // interface because we want to think of a contract.

  async searchBySerialNumber(serialNumber: string): Promise<SolarPanel> {
    return {
      model: "",
      name: "",
      serialNumber: "",
      type: ""
    }
  }
}
