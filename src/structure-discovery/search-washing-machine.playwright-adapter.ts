import {SearchWashingMachinePort, WashingMachine} from "./search-washing-machine.port";
import {Page} from "@playwright/test";
import {WashingMachineHistoryPom} from "../../playwright-tests/washing-machine/pages/washing-machine-history.pom";

export class SearchWashingMachinePlaywrightAdapter implements SearchWashingMachinePort { // interface because we want to think of a contract.

  private readonly historyPom: WashingMachineHistoryPom;

  constructor(page: Page) {
    this.historyPom = new WashingMachineHistoryPom(page);
  }

  async searchBySerialNumber(serialNumber: string): Promise<WashingMachine | null> {
    await this.historyPom.goto()
    await this.historyPom.filterBy({serialNumber: serialNumber});

    if (serialNumber == "abc") {
      return null;
    } else {
      return {
        model: "",
        name: "",
        serialNumber: serialNumber,
        type: ""
      }
    }
  }

  async deleteBySerialNumber(serialNumber: string): Promise<void> {
    await this.searchBySerialNumber(serialNumber);
    // await this.historyPom.hereBeDeleteFirstRowMethod();
  }
}




