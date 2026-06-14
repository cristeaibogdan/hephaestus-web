=== Anthony ===
Feature - search washing machine
Input - serialNumber
Output - washing machine with said serialNumber

1. Create interface and output model
 ```typescript
export interface SearchWashingMachineUseCase { // interface because we want to think of a contract.
  searchBySerialNumber(serialNumber: string): Promise<WashingMachine>
}

export interface WashingMachine {
  name: string,
  model: string,
  type: string,
  serialNumber: string
}
```

2. Write a test() for the interface: 
  Name of the file => search-washing-machine-use-case-playwright.spec.ts (name can be modified later)
  Name of the tests => SHOULD return washing machine (OUTPUT) WHEN given serialNumber (INPUT)

3. Create the SearchWashingMachinePlaywrightAdapter (in `playwright-tests`) that takes in a `page`, and instantiates `historyPom`.
 ```typescript
export class SearchWashingMachinePlaywrightAdapter implements SearchWashingMachineUseCase {
  private readonly historyPom: WashingMachineHistoryPom;

  constructor(page: Page) {
    this.historyPom = new WashingMachineHistoryPom(page);
  }

  async searchBySerialNumber(serialNumber: string): Promise<WashingMachine> {
    await this.historyPom.goto()
    await this.historyPom.filterBy({serialNumber: serialNumber});
    return {
      model: "",
      name: "",
      serialNumber: serialNumber,
      type: ""
    }
  }
}
```  

4. Write a `test` in `search-washing-machine-use-case-playwright.spec.ts` and instantiate the `SearchWashingMachinePlaywrightAdapter`
```typescript
// Needs playwright ui and frontend+backend up to run
test('SHOULD return washing machine (OUTPUT) WHEN given serialNumber (INPUT)', async ({ page }) => {
  // GIVEN
  // instead of manual instantiation we can inject via base.ts. But this means usage of customTest and reliance on playwright.
  const searchWashingMachineUseCase: SearchWashingMachineUseCase = new SearchWashingMachinePlaywrightAdapter(page);

  // WHEN
  const actual: WashingMachine = await searchWashingMachineUseCase.searchBySerialNumber("1234567890");

  // THEN
  const expected: WashingMachine = {
    name: "",
    model: "",
    type: "",
    serialNumber: "1234567890"
  };

  expect(actual).toEqual(expected);
});
```

5. As playwright is async, await has to be used on its methods, the following changes need to happen:
   a. The method from the interface needs to return a Promise: `searchBySerialNumber(serialNumber: string): Promise<WashingMachine>`
   b. All methods in `SearchWashingMachinePlaywrightAdapter` become `async` and methods used from the POM have `await` added to them.
   c. In the customTest await the method `await searchWashingMachineUseCase.searchBySerialNumber(serialNumber);`

6. Create another adapter called `SearchWashingMachineInMemoryStubAdapter`
```typescript
export class SearchWashingMachineInMemoryStubAdapter implements SearchWashingMachineUseCase { // interface because we want to think of a contract.

  async searchBySerialNumber(serialNumber: string): Promise<WashingMachine> {
    return {
      model: "",
      name: "",
      serialNumber: serialNumber,
      type: ""
    }
  }
}
```

7. Write a `test` in `search-washing-machine-use-case-in-memory.spec.ts` and instantiate the `SearchWashingMachineInMemoryStubAdapter`
```typescript
test('SHOULD return washing machine (OUTPUT) WHEN given serialNumber (INPUT) - in memory', async ()=> {
  // GIVEN
  const searchWashingMachineUseCase: SearchWashingMachineUseCase = new SearchWashingMachineInMemoryStubAdapter();

  // WHEN
  const actual: WashingMachine = await searchWashingMachineUseCase.searchBySerialNumber("1234567890");

  // THEN
  const expected: WashingMachine = {
    name: "",
    model: "",
    type: "",
    serialNumber: "1234567890"
  };

  expect(actual).toEqual(expected);
});
```

Issues I have with this adapter up to this point:
- Everything becomes async because playwright is `async`
- Tests need to be in a certain location to make them work: 
  - playwright in `playwright-tests`
  - unit-tests in `src/`
- Tests can't be simplified modified to work with both adapters, changes require moving them to different packages ...

Homework:
1. Write a simple test for the use case using the adapter we created.
2. Create a second adapter called SearchWashingMachineInMemoryStubAdapter 
 (instead of going through playwright to search for your washing machine, you're going to do the search using this adapter).
