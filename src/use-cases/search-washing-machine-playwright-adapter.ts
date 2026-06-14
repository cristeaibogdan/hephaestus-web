import {SearchWashingMachineUseCase, WashingMachine} from "./search-washing-machine-use-case";
import {Page} from "@playwright/test";
import {WashingMachineHistoryPom} from "../../playwright-tests/washing-machine/pages/washing-machine-history.pom";

export class SearchWashingMachinePlaywrightAdapter implements SearchWashingMachineUseCase { // interface because we want to think of a contract.

  private readonly historyPom: WashingMachineHistoryPom;

  constructor(page: Page) {
    this.historyPom = new WashingMachineHistoryPom(page);
  }

  async searchBySerialNumber(serialNumber: string): Promise<WashingMachine> {
    await this.historyPom.goto()
    await this.historyPom.filterBy({serialNumber: serialNumber});
    return {
      model: "",
      name: "",
      serialNumber: serialNumber,
      type: ""
    }
  }
}




