=== Anthony ===
Feature - search solar panel
Input - serialNumber
Output - Solar Panel with said serialNumber

1. Create interface
 ```typescript
export interface SearchSolarPanelUseCase { // interface because we want to think of a contract.
  searchBySerialNumber(serialNumber: string): SearchSolarPanelResponse
}
```

2. Write a test() for the interface: 
  Name of the file => search-solar-panel-use-case.spec.ts (name can be modified later)
  Name of the tests => SHOULD return solar panel (OUTPUT) WHEN given serialNumber (INPUT)

3. Create a PLAYWRIGHT DRIVER ADAPTER (class) that implements the interface.

4. Inject the adapter in base.ts:
```typescript
type MyFixtures = {
  searchSolarPanelPlaywrightAdapter: SearchSolarPanelPlaywrightAdapter,
}

searchSolarPanelPlaywrightAdapter: async ({ page }, use) => {
  await use(new SearchSolarPanelPlaywrightAdapter(page));
}
```

5. Adapt the SearchSolarPanelPlaywrightAdapter to take in the `page`, and use `historyPom` in some of the methods.
 ```typescript
export class SearchSolarPanelPlaywrightAdapter implements SearchSolarPanelUseCase {
  private historyPom: WashingMachineHistoryPom;

  constructor(page: Page) {
    this.historyPom = new WashingMachineHistoryPom(page);
  }

  private filterBySerialNumber(serialNumber: string ) {
    this.historyPom.filterBy({serialNumber: serialNumber});
    this.clickFilter();
  }
}
```  
6. Adapt the test to use customTest method from playwright
```typescript
customTest('SHOULD return solar panel (OUTPUT) WHEN given serialNumber (INPUT)', async ({ searchSolarPanelPlaywrightAdapter }) => {
  // GIVEN
  const serialNumber = "1234567890";

  // WHEN
  const actual: SolarPanel = searchSolarPanelUseCase.searchBySerialNumber(serialNumber);

  // THEN
  const expected: SolarPanel = {
    name: "",
    model: "",
    type: "",
    serialNumber: ""
  }

  assert.deepEqual(actual, expected);
});
```

7. As playwright is async, await has to be used on its methods, the following changes need to happen:
   a. The method from the interface needs to return a Promise: `searchBySerialNumber(serialNumber: string): Promise<SolarPanel>`
   b. All methods in `SearchSolarPanelPlaywrightAdapter` become `async` and methods used from the POM have `await` added to them.
   c. In the customTest await the method `await searchSolarPanelUseCase.searchBySerialNumber(serialNumber);`

Issues I have with this adapter up to this point:
- over reliance on playwright `base.ts`
- everything becomes async because playwright is `async`
- I can't change the test code as playwright pom injection provides it to customTest, so for another adapter, I'd have to write another test.

Homework:
1. Write a simple test for the use case using the adapter we created.
2. Create a second adapter called SearchSolarPanelInMemoryStubAdapter 
 (instead of going through playwright to search for your washing machine, you're going to do the search using this adapter).
