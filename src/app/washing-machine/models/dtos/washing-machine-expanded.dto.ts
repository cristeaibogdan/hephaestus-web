import { WashingMachineDetailDTO } from "./washing-machine-detail.dto";
import { WashingMachineImageDTO } from "./washing-machine-image.dto";

export interface WashingMachineExpandedDTO {
  washingMachineDetail:WashingMachineDetailDTO,
  washingMachineImages:WashingMachineImageDTO[]
}