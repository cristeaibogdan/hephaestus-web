export interface SearchSolarPanelUseCase { // interface because we want to think of a contract.
  searchBySerialNumber(serialNumber: string): Promise<SolarPanel>
}

export interface SolarPanel {
  name: string,
  model: string,
  type: string,
  serialNumber: string
}
