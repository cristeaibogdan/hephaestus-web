import { SolarPanelRecommendation } from "../../enums/solar-panel-recommendation.enum";

export interface SearchSolarPanelResponse {
  category: string;
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  createdAt: Date,
  recommendation: SolarPanelRecommendation
}