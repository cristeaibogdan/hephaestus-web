import { CreateSolarPanelDamageRequest } from "./create-solar-panel-damage.request";

export interface CreateSolarPanelRequest {
  category: string;
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  createSolarPanelDamageRequest: CreateSolarPanelDamageRequest
}