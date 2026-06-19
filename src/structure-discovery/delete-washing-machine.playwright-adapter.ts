import {Page} from "@playwright/test";
import {WashingMachineHistoryPom} from "../../playwright-tests/washing-machine/pages/washing-machine-history.pom";
import {DeleteWashingMachinePort} from "./delete-washing-machine.port";

export class DeleteWashingMachinePlaywrightAdapter implements DeleteWashingMachinePort {

  private readonly historyPom: WashingMachineHistoryPom;

  constructor(page: Page) {
    this.historyPom = new WashingMachineHistoryPom(page);
  }

  async deleteBySerialNumber(serialNumber: string): Promise<void> {
    // await this.historyPom.hereBeDeleteFirstRowMethod();
  }
}




