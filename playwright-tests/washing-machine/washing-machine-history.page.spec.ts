import { expect } from '@playwright/test';
import { customTest } from '../base';
import { WashingMachineHistoryPom } from './pages/washing-machine-history.pom';
import {
  CreateWashingMachineRequest
} from "../../src/app/features/washing-machine/models/endpoints/create-washing-machine.endpoint";
import {DamageType} from "../../src/app/features/washing-machine/enums/damage-type.enum";
import {ReturnType} from "../../src/app/features/washing-machine/enums/return-type.enum";
import {IdentificationMode} from "../../src/app/features/washing-machine/enums/identification-mode.enum";

/**
 * Given a serial number, find a washing machine with that serialNumber.
 * Other properties are implementation details.
 *
 *
 * Idea: Using resources in backend to point to a temporary database, that will be deleted at the end of the
 * test suite. Can use a file implementationinstead of the database, or a collection.
 */
customTest('should find washing machine when filtering by serialNumber', async ({ washingMachineHistoryPom, washingMachineApi }) => {
  await washingMachineApi.create(
    createWashingMachine({ serialNumber: "test-123" })
  );

  await washingMachineHistoryPom.goto(); // Can be extracted in a beforeEach
  await washingMachineHistoryPom.filterBy({serialNumber: "test-123"});

  const row = washingMachineHistoryPom.findRowBySerialNumber('test-123');
  await expect(row.serialNumber()).toHaveText("test-123");
});

customTest('Finds specific row and aserts data', async ({ washingMachineHistoryPom }) => {
  await washingMachineHistoryPom.goto();

  const row = washingMachineHistoryPom.findRowBySerialNumber('sda');
  console.log(row);

  await expect(row.manufacturer()).toHaveText('Gorenje');
  await expect(row.model()).toHaveText('WA946');
  await expect(row.type()).toHaveText('N/A');
});

function createWashingMachine(overrides: Partial<CreateWashingMachineRequest> = {}): CreateWashingMachineRequest {
  return {
    category: "WASHING_MACHINE",
    manufacturer: "Bosch",
    damageType: DamageType.IN_USE,
    returnType: ReturnType.SERVICE,
    identificationMode: IdentificationMode.DATA_MATRIX,
    serialNumber: "test-default",
    model: "ABC123",
    type: "Front Loader",
    damage: {
      packageDamaged: false,
      packageDirty: false,
      packageMaterialAvailable: true,
      visibleSurfacesScratchesLength: 1,
      visibleSurfacesDentsDepth: 1,
      visibleSurfacesMinorDamage: "visibleSurfacesMinorDamage",
      visibleSurfacesMajorDamage: "visibleSurfacesMajorDamage",
      hiddenSurfacesScratchesLength: 1,
      hiddenSurfacesDentsDepth: 1,
      hiddenSurfacesMinorDamage: "hiddenSurfacesMinorDamage",
      hiddenSurfacesMajorDamage: "hiddenSurfacesMajorDamage",
      price: 100,
      repairPrice: 0
    },
    ...overrides
  };
}
