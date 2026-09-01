## Phase 1
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

## Issues
- Everything becomes async because playwright is `async`
  (The call will be to an API, so Promise is okay here, but I think it should be an Observable)
- Tests need to be in a certain location to make them work:
  - playwright in `playwright-tests`
  - unit-tests in `src/`
- Tests can't be modified to work with both adapters, changes require moving them to different packages

## Phase 2
1. Rename files:
  - From `search-washing-machine-use-case.ts` to `search-washing-machine.port.ts`

  - From `search-washing-machine-playwright-adapter.ts` to `search-washing-machine.playwright-adapter.ts`
  - From `search-washing-machine.in-memory-adapter.ts` to `search-washing-machine.in-memory-adapter.ts`
   
  - From `search-washing-machine-use-case-playwright.spec.ts` to `search-washing-machine.playwright-adapter.spec.ts`
  - From `search-washing-machine-use-case-in-memory.spec.ts` to `search-washing-machine.in-memory-adapter.spec.ts`

2. Rename package from `use-cases` to `structure-discovery`

3. Create another interface `delete-washing-machine.port.ts`

```typescript
export interface DeleteWashingMachinePort {
  deleteBySerialNumber(serialNumber: string): Promise<void>;
}
```
4. Create playwright and in-memory-adapter

```typescript
// delete-washing-machine.playwright-adapter.ts
async deleteBySerialNumber(serialNumber: string): Promise<void> {
  // await this.historyPom.hereBeDeleteFirstRowMethod();
}

// delete-washing-machine.in-memory-adapter.ts
async deleteBySerialNumber(serialNumber: string): Promise<void> {
  // something happens here
}
```
5. Modify the search method to return null if no washing-machine is found whenever a serialNumber is "abc" so I can test the side effect of the delete method
```typescript
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
```
Also change the return type of the method from Promise<WashingMachine> to Promise<Washing Machine | null>.
=== This is a terrible move that I do here ===

```typescript
export interface WashingMachinePort { // interface because we want to think of a contract.
  searchBySerialNumber(serialNumber: string): Promise<WashingMachine | null>;
}
```

6. Write the tests
```typescript
// delete-washing-machine.playwright-adapter.spec.ts
test('SHOULD delete washing machine WHEN given serialNumber', async ({ page }) => {
  // GIVEN
  const searchWashingMachinePort: SearchWashingMachinePort = new SearchWashingMachinePlaywrightAdapter(page);
  const underTest: DeleteWashingMachinePort = new DeleteWashingMachinePlaywrightAdapter(page);

  // WHEN
  await underTest.deleteBySerialNumber("abc")
  const actual = await searchWashingMachinePort.searchBySerialNumber("abc");

  // THEN
  expect(actual).toBeNull();
});

// delete-washing-machine.in-memory-adapter.spec.ts
test('SHOULD delete washing machine WHEN given serialNumber', async () => {
  // GIVEN
  const searchWashingMachinePort: SearchWashingMachinePort = new SearchWashingMachineInMemoryAdapter();
  const underTest: DeleteWashingMachinePort = new DeleteWashingMachineInMemoryAdapter();

  // WHEN
  await underTest.deleteBySerialNumber("abc")
  const actual = await searchWashingMachinePort.searchBySerialNumber("abc");

  // THEN
  expect(actual).toBeNull();
});

// delete-washing-machine.playwright-adapter.spec.ts <== I put the hybrid here as it requires playwright to run it
test('SHOULD delete washing machine WHEN given serialNumber [HYBRID]', async ({ page }) => {
  // GIVEN
  const searchWashingMachinePort: SearchWashingMachinePort = new SearchWashingMachinePlaywrightAdapter(page);
  const underTest: DeleteWashingMachinePort = new DeleteWashingMachineInMemoryAdapter();

  // WHEN
  await underTest.deleteBySerialNumber("abc")
  const actual = await searchWashingMachinePort.searchBySerialNumber("abc");

  // THEN
  expect(actual).toBeNull();
});
```

## Issues
- Was a bit torn if I should make a port per endpoint or make a port that expresses all endpoints for a given domain.
  - I choose the latter because having 4-5 interfaces implemented in each adapter would cause clutter. Open to discussion here.
- It is not possible to run playwright tests without starting the frontend, backend and the playwright test UI.
- My interfaces return a Promise, it should be an Observable (assuming the interface will be implemented by a service that calls endpoints)
- I feel bad for not using playwright's POM + fixtures to make my tests simpler.
  For the sake of 'adaptability' I throw some good parts from playwright away...

