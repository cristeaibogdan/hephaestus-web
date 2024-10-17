import { GetWashingMachineExpandedResponse } from './get-washing-machine-expanded-response.dto';
import { GetWashingMachineSimpleResponse } from './get-washing-machine-simple-response.dto';

export interface WashingMachineFullResponse 
extends GetWashingMachineSimpleResponse, GetWashingMachineExpandedResponse { }