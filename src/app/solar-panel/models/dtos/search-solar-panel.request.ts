import { SolarPanelRecommendation } from "../../enums/solar-panel-recommendation.enum";

export interface SearchSolarPanelRequest {
  pageIndex: number;
  pageSize: number;

  sortByField: string | null;
  sortDirection: string;

  manufacturer: string | null;  
  model: string | null;
  type: string | null;
  serialNumber: string | null;

  createdAt: string | null;
  recommendation: SolarPanelRecommendation | null;
}