import {DeleteWashingMachinePort} from "./delete-washing-machine.port";

export class DeleteWashingMachineInMemoryAdapter implements DeleteWashingMachinePort {

  async deleteBySerialNumber(serialNumber: string): Promise<void> {
    // something happens here
  }
}
