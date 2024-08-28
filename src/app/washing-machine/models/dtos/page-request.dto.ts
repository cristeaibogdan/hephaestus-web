import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { ReturnType } from '../../enums/return-type.enum';

export interface PageRequestDTO {
  pageIndex: number;
  pageSize: number;
  
  identificationMode: IdentificationMode;
  manufacturer: string;
  
  model: string;
  type: string;
  serialNumber: string;
  
  returnType: ReturnType;
  damageType: DamageType;
  
  damageLevel: number;
  recommendation: string;  
  
  createdAt: string;
}
