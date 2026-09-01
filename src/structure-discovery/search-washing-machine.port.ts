export interface SearchWashingMachinePort { // interface because we want to think of a contract.
  searchBySerialNumber(serialNumber: string): Promise<WashingMachine | null>;
}

export interface WashingMachine {
  name: string,
  model: string,
  type: string,
  serialNumber: string
}
