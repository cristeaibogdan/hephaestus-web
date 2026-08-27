import crypto from "node:crypto";
import {CreateWashingMachineRequest} from "../src/app/features/washing-machine/models/endpoints/create-washing-machine.endpoint";
import {DamageType} from "../src/app/features/washing-machine/enums/damage-type.enum";
import {ReturnType} from "../src/app/features/washing-machine/enums/return-type.enum";
import {IdentificationMode} from "../src/app/features/washing-machine/enums/identification-mode.enum";
import {SearchWashingMachineResponse} from "../src/app/features/washing-machine/models/endpoints/search-washing-machine.endpoint";
import {Recommendation} from "../src/app/features/washing-machine/enums/recommendation.enum";
import {
  GetWashingMachineFullResponse
} from "../src/app/features/washing-machine/models/endpoints/get-washing-machine-full.endpoint";

export class TestData {
  static generateSerialNumber(): string {
    return `test-${crypto.randomUUID().slice(0, 8)}`;
  }

  static createCreateWashingMachineRequest(overrides: Partial<CreateWashingMachineRequest> = {}): CreateWashingMachineRequest {
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

  static createSearchWashingMachineResponse(overrides: Partial<SearchWashingMachineResponse> = {}): SearchWashingMachineResponse {
    return {
      category: "Washing Machine",
      identificationMode: IdentificationMode.DATA_MATRIX,
      manufacturer: "Bosch",
      model: "Series 4",
      type: "Front Loader",
      serialNumber: "123456",
      returnType: ReturnType.COMMERCIAL,
      damageType: DamageType.IN_USE,
      recommendation: Recommendation.RESALE,
      createdAt: new Date("2000-01-01T00:00:00Z"),

      ...overrides
    };
  }

  static createGetWashingMachineFullResponse(overrides: Partial<GetWashingMachineFullResponse> = {}): GetWashingMachineFullResponse {
    return {
      category: "Washing Machine",
      identificationMode: IdentificationMode.DATA_MATRIX,
      manufacturer: "Bosch",
      model: "Series 4",
      type: "Front Loader",
      serialNumber: "123456",
      returnType: ReturnType.COMMERCIAL,
      damageType: DamageType.IN_USE,
      recommendation: Recommendation.RESALE,
      createdAt: new Date(),

      ...overrides
    };
  }
}


