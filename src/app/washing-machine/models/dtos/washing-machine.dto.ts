import { WashingMachineDetailsDTO } from "./washing-machine-details.dto";
import { WashingMachineImageDTO } from "./washing-machine-image.dto";

export interface WashingMachineDTO {
  category: string,
  manufacturer: string,

  damageType: string,
  returnType: string,
  identificationMode: string,
    
  serialNumber: string,
  model: string,
  type: string,

  damageLevel?:number,
  recommendation?:string,
  createdAt?:Date
  
  washingMachineDetailsDTO?:WashingMachineDetailsDTO,      
  washingMachineImages?:WashingMachineImageDTO[]
}