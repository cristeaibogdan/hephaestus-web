import { WashingMachineDetailsDTO } from "./washing-machine-details.dto";
import { WashingMachineImageDTO } from "./washing-machine-image.dto";

export interface WashingMachineExpandedDTO {
  washingMachineDetails:WashingMachineDetailsDTO,
  washingMachineImages:WashingMachineImageDTO[]
}