import {SearchWashingMachinePort, WashingMachine} from "./search-washing-machine.port";
import {SearchWashingMachineInMemoryAdapter} from "./search-washing-machine.in-memory-adapter";

/**
 * Tests in this class are run through this command:
 * npx vitest run src/structure-discovery/search-washing-machine.in-memory-adapter.spec.ts
 */

test('SHOULD return washing machine (OUTPUT) WHEN given serialNumber (INPUT) - in memory', async ()=> {
  // GIVEN
  const underTest: SearchWashingMachinePort = new SearchWashingMachineInMemoryAdapter();

  // WHEN
  const actual = await underTest.searchBySerialNumber("1234567890");

  // THEN
  const expected: WashingMachine = {
    name: "",
    model: "",
    type: "",
    serialNumber: "1234567890"
  };

  expect(actual).toEqual(expected);
});

