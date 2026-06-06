import { DamageType } from '../enums/damage-type.enum';
import { IdentificationMode } from '../enums/identification-mode.enum';
import { ReturnType } from '../enums/return-type.enum';

export interface Identification {
  identificationMode: IdentificationMode;
  category: string;
  manufacturer: string;

  model: string;
  type: string;

  serialNumber: string;
  returnType: ReturnType;
  damageType: DamageType;
}
