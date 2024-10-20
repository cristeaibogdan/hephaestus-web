import { GetWashingMachineDetailResponse } from './get-washing-machine-detail-response.dto';
import { GetWashingMachineImageResponse } from './get-washing-machine-image-response.dto';

export interface GetWashingMachineExpandedResponse {
  getWashingMachineDetailResponse: GetWashingMachineDetailResponse;
  washingMachineImages: GetWashingMachineImageResponse[];
}