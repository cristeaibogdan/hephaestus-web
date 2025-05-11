export interface CreateSolarPanelRequest {
  category: string;
  manufacturer: string;
  model: string;
  type: string;
  serialNumber: string;

  damage: Damage
}

export interface Damage {
  hotSpots: boolean;
  microCracks: boolean;
  snailTrails: boolean;
  brokenGlass: boolean;
  additionalDetails: string;
}
