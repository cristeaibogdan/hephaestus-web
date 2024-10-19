import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { ReturnType } from '../../enums/return-type.enum';
import { CreateWashingMachineDetailRequest } from './create-washing-machine-detail-request.dto';

export interface CreateWashingMachineRequest {
  category: string;
  identificationMode: IdentificationMode;
  manufacturer: string;

  model: string;
  type: string;
  serialNumber: string;

  returnType: ReturnType;
  damageType: DamageType;

  createWashingMachineDetailRequest: CreateWashingMachineDetailRequest;
}