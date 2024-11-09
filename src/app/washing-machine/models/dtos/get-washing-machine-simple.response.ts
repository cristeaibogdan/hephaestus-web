import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { Recommendation } from '../../enums/recommendation.enum';
import { ReturnType } from '../../enums/return-type.enum';

export interface GetWashingMachineSimpleResponse {
  category: string;
  identificationMode: IdentificationMode;
  manufacturer: string;

  model: string;
  type: string;
  serialNumber: string;

  returnType: ReturnType;
  damageType: DamageType;

  recommendation: Recommendation;
  createdAt: Date;
}