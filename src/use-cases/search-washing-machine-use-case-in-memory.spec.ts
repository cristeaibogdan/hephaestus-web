import {SearchWashingMachineUseCase, WashingMachine} from "./search-washing-machine-use-case";
import {SearchWashingMachineInMemoryStubAdapter} from "./search-washing-machine-in-memory-stub-adapter";

//Can be run through this command:
// npx vitest run src/use-cases/search-solar-panel-use-case-in-memory.spec.ts

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


