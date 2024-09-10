import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { Recommendation } from '../../enums/recommendation.enum';
import { ReturnType } from '../../enums/return-type.enum';
import { WashingMachineDetailDTO } from './washing-machine-detail.dto';
import { WashingMachineImageDTO } from './washing-machine-image.dto';

export interface WashingMachineDTO {
  category: string;
  identificationMode: IdentificationMode | null;
  manufacturer: string;

  model: string;
  type: string;
  serialNumber: string;

  returnType: ReturnType | null;
  damageType: DamageType | null;

  recommendation?: Recommendation | null;
  createdAt?: Date;

  washingMachineDetailDTO?: WashingMachineDetailDTO;
  washingMachineImages?: WashingMachineImageDTO[];
}
