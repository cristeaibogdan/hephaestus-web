import {SearchWashingMachinePort, WashingMachine} from "./search-washing-machine.port";

export class SearchWashingMachineInMemoryAdapter implements SearchWashingMachinePort {

  async searchBySerialNumber(serialNumber: string): Promise<WashingMachine | null> {
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
