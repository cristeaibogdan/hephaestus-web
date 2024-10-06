import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { Recommendation } from '../../enums/recommendation.enum';
import { ReturnType } from '../../enums/return-type.enum';

export interface SearchWashingMachineRequestDTO {
  pageIndex: number;
  pageSize: number;
  
  identificationMode: IdentificationMode | null;
  manufacturer: string | null;
  
  model: string | null;
  type: string | null;
  serialNumber: string | null;
  
  returnType: ReturnType | null;
  damageType: DamageType | null;
  
  recommendation: Recommendation | null;
  
  createdAt: string | null;
}