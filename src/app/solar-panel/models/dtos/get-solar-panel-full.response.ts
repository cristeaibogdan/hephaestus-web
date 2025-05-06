import { SearchSolarPanelResponse } from "./search-solar-panel.response";

export interface GetSolarPanelFullResponse extends SearchSolarPanelResponse { 
  damage?: DamageResponse;
}

export interface DamageResponse {
  hotSpots: boolean;
  microCracks: boolean;
  snailTrails: boolean;
  brokenGlass: boolean;
  additionalDetails: string;
}