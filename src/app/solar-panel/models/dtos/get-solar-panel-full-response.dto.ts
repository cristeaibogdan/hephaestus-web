import { SolarPanelDamage } from "../solar-panel-damage.model";
import { GetSolarPanelSimpleResponse } from "./get-solar-panel-simple-response.dto";

export interface GetSolarPanelFullResponse extends GetSolarPanelSimpleResponse { 
  solarPanelDamage: SolarPanelDamage;
}