import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { Recommendation } from '../../enums/recommendation.enum';
import { ReturnType } from '../../enums/return-type.enum';
import { WashingMachineDetailDTO } from './washing-machine-detail.dto';

export interface CreateWashingMachineRequestDTO {
  category: string;
  identificationMode: IdentificationMode | null;
  manufacturer: string;

  model: string;
  type: string;
  serialNumber: string;

  returnType: ReturnType | null;
  damageType: DamageType | null;

  recommendation?: Recommendation | null;

  washingMachineDetailDTO?: WashingMachineDetailDTO;
}