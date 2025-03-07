import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { ReturnType } from '../../enums/return-type.enum';
import { SaveWashingMachineDetailRequest } from './create-washing-machine-detail.request';

export interface SaveWashingMachineRequest {
  category: string;
  identificationMode: IdentificationMode;
  manufacturer: string;

  model: string;
  type: string;
  serialNumber: string;

  returnType: ReturnType;
  damageType: DamageType;

  saveWashingMachineDetailRequest: SaveWashingMachineDetailRequest;
}