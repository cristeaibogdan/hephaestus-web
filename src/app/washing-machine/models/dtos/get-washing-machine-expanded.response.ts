import { GetWashingMachineDetailResponse } from './get-washing-machine-detail.response';
import { GetWashingMachineImageResponse } from './get-washing-machine-image.response';

export interface GetWashingMachineExpandedResponse {
  washingMachineDetail: GetWashingMachineDetailResponse;
  washingMachineImages: GetWashingMachineImageResponse[];
}