import {SearchSolarPanelUseCase, SolarPanel} from "./search-solar-panel-use-case";
import {Page} from "@playwright/test";
import {WashingMachineHistoryPom} from "../../tests/washing-machine/pages/washing-machine-history.pom";

export class SearchSolarPanelPlaywrightAdapter implements SearchSolarPanelUseCase { // interface because we want to think of a contract.

  private readonly historyPom: WashingMachineHistoryPom;

  constructor(page: Page) {
    this.historyPom = new WashingMachineHistoryPom(page);
  }

  async searchBySerialNumber(serialNumber: string): Promise<SolarPanel> {
    await this.historyPom.goto()
    await this.historyPom.filterBy({serialNumber: serialNumber});
    return {
      model: "",
      name: "",
      serialNumber: "",
      type: ""
    }
  }
}




