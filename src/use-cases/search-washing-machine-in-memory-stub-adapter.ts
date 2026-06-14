import {SearchWashingMachineUseCase, WashingMachine} from "./search-washing-machine-use-case";

export class SearchWashingMachineInMemoryStubAdapter implements SearchWashingMachineUseCase {

  async searchBySerialNumber(serialNumber: string): Promise<WashingMachine> {
    return {
      model: "",
      name: "",
      serialNumber: serialNumber,
      type: ""
    }
  }
}
