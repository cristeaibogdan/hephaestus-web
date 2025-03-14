import { SaveSolarPanelDamageRequest } from "./save-solar-panel-damage.request";

export interface SaveSolarPanelRequest {
  category: string;
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  saveSolarPanelDamageRequest: SaveSolarPanelDamageRequest
}