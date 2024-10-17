import { WashingMachineDetailDTO } from './washing-machine-detail.dto';
import { WashingMachineImageDTO } from './washing-machine-image.dto';

export interface GetWashingMachineExpandedResponse {
  washingMachineDetail: WashingMachineDetailDTO;
  washingMachineImages: WashingMachineImageDTO[];
}