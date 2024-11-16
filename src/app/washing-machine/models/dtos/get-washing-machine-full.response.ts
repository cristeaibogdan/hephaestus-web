import { DamageType } from '../../enums/damage-type.enum';
import { IdentificationMode } from '../../enums/identification-mode.enum';
import { Recommendation } from '../../enums/recommendation.enum';
import { ReturnType } from '../../enums/return-type.enum';
import { GetWashingMachineDetailResponse } from './get-washing-machine-detail.response';
import { GetWashingMachineImageResponse } from './get-washing-machine-image.response';

export interface GetWashingMachineFullResponse {
  category: string,
  identificationMode: IdentificationMode,
  manufacturer: string,

  model: string,
  type: string,
  serialNumber: string,

  returnType: ReturnType,
  damageType: DamageType,

  recommendation: Recommendation,
  createdAt: Date,

  washingMachineDetail: GetWashingMachineDetailResponse,
  washingMachineImages: GetWashingMachineImageResponse[]
}