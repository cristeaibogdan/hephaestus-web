import { CreateSolarPanelDamageRequest } from "./create-solar-panel-damage-request.dto";

export interface CreateSolarPanelRequest {
  category: string;
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  createSolarPanelDamage: CreateSolarPanelDamageRequest
}