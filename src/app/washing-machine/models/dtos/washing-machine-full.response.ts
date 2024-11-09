import { GetWashingMachineExpandedResponse } from './get-washing-machine-expanded.response';
import { GetWashingMachineSimpleResponse } from './get-washing-machine-simple.response';

export interface WashingMachineFullResponse 
extends GetWashingMachineSimpleResponse, GetWashingMachineExpandedResponse { }