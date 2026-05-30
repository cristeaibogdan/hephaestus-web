=== Anthony ===
Feature - search solar panel

Input - serialNumber
Output - Solar Panel with said serialNumber

export interface SearchSolarPanelUseCase { // interface because we want to think of a contract.
  searchBySerialNumber(serialNumber: string): SearchSolarPanelResponse
}

We want to write a UI level implementation of the above interface.

Write a test for the interface: 
  Name of the file => search-solar-panel-use-case-test.spec.ts (name can be modified later)
  Name of the tests => SHOULD return solar panel (OUTPUT) WHEN given serialNumber (INPUT)

We decided to write a PLAYWRIGHT TEST using the interface.

We create a PLAYWRIGHT DRIVER ADAPTER for the interface.

Will continue next meeting.
Create separate branch.