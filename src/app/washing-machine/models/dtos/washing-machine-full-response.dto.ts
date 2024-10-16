import { GetWashingMachineExpandedResponseDTO } from './get-washing-machine-expanded-response.dto';
import { GetWashingMachineSimpleResponseDTO } from './get-washing-machine-simple-response.dto';

export interface WashingMachineFullResponseDTO 
extends GetWashingMachineSimpleResponseDTO, GetWashingMachineExpandedResponseDTO { }