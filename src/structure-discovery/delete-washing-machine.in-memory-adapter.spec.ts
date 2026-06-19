import {SearchWashingMachinePort} from "./search-washing-machine.port";
import {SearchWashingMachineInMemoryAdapter} from "./search-washing-machine.in-memory-adapter";
import {DeleteWashingMachinePort} from "./delete-washing-machine.port";
import {DeleteWashingMachineInMemoryAdapter} from "./delete-washing-machine.in-memory-adapter";

/**
 * Tests in this class are run through this command:
 * npx vitest run src/structure-discovery/delete-washing-machine.in-memory-adapter.spec.ts
 */

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
