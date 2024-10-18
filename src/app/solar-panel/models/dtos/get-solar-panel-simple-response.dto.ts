import { SolarPanelRecommendation } from "../../enums/solar-panel-recommendation.enum";

export interface GetSolarPanelSimpleResponse {
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  createdAt: Date,
  recommendation: SolarPanelRecommendation
}