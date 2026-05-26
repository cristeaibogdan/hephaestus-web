import { SolarPanelRecommendation } from "../../enums/solar-panel-recommendation.enum";

/**
 * Complete solar panel information including damage.
 * 
 * This is an extended version of {@link SearchSolarPanelResponse} that includes
 * damage. To be kept in sync with {@link SearchSolarPanelResponse}.
 */
export interface GetSolarPanelFullResponse {
  category: string;
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  createdAt: Date;
  recommendation: SolarPanelRecommendation;

  damage?: Damage;
}

interface Damage {
  hotSpots: boolean;
  microCracks: boolean;
  snailTrails: boolean;
  brokenGlass: boolean;
  additionalDetails: string;
}
