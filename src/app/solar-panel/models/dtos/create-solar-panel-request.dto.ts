import { CreateSolarPanelDamageRequest } from "./create-solar-panel-damage.dto";

export interface CreateSolarPanelRequest {
  category: string;
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  createSolarPanelDamage: CreateSolarPanelDamageRequest
}