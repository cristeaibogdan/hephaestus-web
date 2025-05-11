import { SearchSolarPanelResponse } from "./search-solar-panel.response";

export interface GetSolarPanelFullResponse extends SearchSolarPanelResponse { 
  damage?: Damage;
}

export interface Damage {
  hotSpots: boolean;
  microCracks: boolean;
  snailTrails: boolean;
  brokenGlass: boolean;
  additionalDetails: string;
}