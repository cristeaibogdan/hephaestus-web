import { SolarPanelDamage } from "../solar-panel-damage.model";
import { SearchSolarPanelResponse } from "./search-solar-panel.response";

export interface GetSolarPanelFullResponse extends SearchSolarPanelResponse { 
  solarPanelDamage: SolarPanelDamage;
}