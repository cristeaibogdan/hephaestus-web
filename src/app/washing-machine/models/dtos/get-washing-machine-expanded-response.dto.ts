import { GetWashingMachineDetailResponse } from './get-washing-machine-detail-response.dto';
import { WashingMachineImageDTO } from './washing-machine-image.dto';

export interface GetWashingMachineExpandedResponse {
  getWashingMachineDetailResponse: GetWashingMachineDetailResponse;
  washingMachineImages: WashingMachineImageDTO[];
}