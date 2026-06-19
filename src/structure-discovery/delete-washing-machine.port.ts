export interface DeleteWashingMachinePort {
  deleteBySerialNumber(serialNumber: string): Promise<void>;
}
