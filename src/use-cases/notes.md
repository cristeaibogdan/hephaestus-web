=== Anthony ===
Feature - search solar panel
Input - serialNumber
Output - Solar Panel with said serialNumber

1. Create interface
export interface SearchSolarPanelUseCase { // interface because we want to think of a contract.
  searchBySerialNumber(serialNumber: string): SearchSolarPanelResponse
}

2. Write a test for the interface: 
  Name of the file => search-solar-panel-use-case.spec.ts (name can be modified later)
  Name of the tests => SHOULD return solar panel (OUTPUT) WHEN given serialNumber (INPUT)

3. We decided to write a PLAYWRIGHT TEST using the interface created previously.

4. We create a PLAYWRIGHT DRIVER ADAPTER (class) for the interface.

Do on your own and see what you end up with.

We are encapsulating playwright implementation details inside an interface.

Homework:
1. Write a simple test for the use case using the adapter we created.
2. Create a second adapter called InMemoryStubAdapter 
 (instead of going through playwright to search for your washing machine, you're going to do the search using this adapter).
