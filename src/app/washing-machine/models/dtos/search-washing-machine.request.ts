import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { Recommendation } from '../../enums/recommendation.enum';
import { ReturnType } from '../../enums/return-type.enum';

export interface SearchWashingMachineRequest {
  pageIndex: number;
  pageSize: number;

  sortByField: string | null;
  sortDirection: string;
  
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