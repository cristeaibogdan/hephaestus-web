import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { ReturnType } from '../../enums/return-type.enum';
import { WashingMachineDetailsDTO } from './washing-machine-details.dto';
import { WashingMachineImageDTO } from './washing-machine-image.dto';

export interface WashingMachineDTO {
  category: string;
  manufacturer: string;

  damageType: DamageType;
  returnType: ReturnType;
  identificationMode: IdentificationMode;

  serialNumber: string;
  model: string;
  type: string;

  damageLevel?: number;
  recommendation?: string;
  createdAt?: Date;

  washingMachineDetailsDTO?: WashingMachineDetailsDTO;
  washingMachineImages?: WashingMachineImageDTO[];
}
