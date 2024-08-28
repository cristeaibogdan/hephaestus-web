import { DamageType } from '../enums/damage-type.enum';
import { ReturnType } from '../enums/return-type.enum';

export interface WashingMachineIdentification {
  identificationMode: string;
  category: string;
  manufacturer: string;

  model: string;
  type: string;

  serialNumber: string;
  returnType: ReturnType;
  damageType: DamageType;
}
