import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { ReturnType } from '../../enums/return-type.enum';

export interface CreateWashingMachineRequest {
  category: string;
  identificationMode: IdentificationMode;
  manufacturer: string;

  model: string;
  type: string;
  serialNumber: string;

  returnType: ReturnType;
  damageType: DamageType;

  washingMachineDetail: WashingMachineDetail;
}

export interface WashingMachineDetail {
  // PACKAGE
  packageDamaged: boolean;
  packageDirty: boolean;
  packageMaterialAvailable: boolean;

  // VISIBLE SURFACES
  visibleSurfacesScratchesLength: number;
  visibleSurfacesDentsDepth: number;
  visibleSurfacesMinorDamage: string;
  visibleSurfacesMajorDamage: string;

  // HIDDEN SURFACES
  hiddenSurfacesScratchesLength: number;
  hiddenSurfacesDentsDepth: number;
  hiddenSurfacesMinorDamage: string;
  hiddenSurfacesMajorDamage: string;

  // PRICING
  price: number;
  repairPrice: number;
}
