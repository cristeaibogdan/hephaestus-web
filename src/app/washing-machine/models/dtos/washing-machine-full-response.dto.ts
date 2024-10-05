import { GetWashingMachineSimpleResponseDTO } from './get-washing-machine-simple-response.dto';
import { WashingMachineDetailDTO } from './washing-machine-detail.dto';
import { WashingMachineImageDTO } from './washing-machine-image.dto';

export interface WashingMachineFullResponseDTO extends GetWashingMachineSimpleResponseDTO {
  washingMachineDetailDTO?: WashingMachineDetailDTO;
  washingMachineImages?: WashingMachineImageDTO[];
}