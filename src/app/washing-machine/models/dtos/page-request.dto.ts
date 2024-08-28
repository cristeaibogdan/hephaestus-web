import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { ReturnType } from '../../enums/return-type.enum';

export interface PageRequestDTO {
  pageIndex: number;
  pageSize: number;

  category: string;
  manufacturer: string;

  damageType: DamageType;
  returnType: ReturnType;
  identificationMode: IdentificationMode;

  serialNumber: string;
  model: string;
  type: string;

  damageLevel: number;
  recommendation: string;

  createdAt: string;
}
