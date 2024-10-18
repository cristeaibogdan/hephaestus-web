import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelDataService } from './solar-panel-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SolarPanelDamage } from '../models/solar-panel-damage.model';
import { CreateSolarPanelRequest } from '../models/dtos/create-solar-panel-request.dto';
import { SolarPanelRecommendation } from '../enums/solar-panel-recommendation.enum';

@Injectable({providedIn: 'root'})
export class SolarPanelService {

  constructor(
    private _solarPanelDataService: SolarPanelDataService,
    private _notifService: NotificationService,
  ) { }

// **************************************
// *** STEP 1 = IDENTIFICATION
// **************************************

  private solarPanelIdentification$ = new BehaviorSubject<SolarPanelIdentification>({
    category: "",  
    manufacturer: "",
    model: "",
    type: "",
    serialNumber: ""
  });
  
  getSolarPanelIdentification() {
    return this.solarPanelIdentification$.asObservable();
  }

  getSerialNumber() {
    return this.solarPanelIdentification$.value.serialNumber;
  }

  setSolarPanelIdentificationValues(solarPanelIdentification: SolarPanelIdentification) {
    this.solarPanelIdentification$.next(solarPanelIdentification);

    // this.save(); //TODO: Remove after doing Damage Assessment page.
  }

  clearSolarPanelIdentificationValues() {
    this.solarPanelIdentification$.value.category = "";
    this.solarPanelIdentification$.value.manufacturer = "";
    this.solarPanelIdentification$.value.model = "";
    this.solarPanelIdentification$.value.type = "";
    this.solarPanelIdentification$.value.serialNumber = "";
  }

// **************************************
// *** STEP 2 = DAMAGE
// **************************************

  private solarPanelDamage$ = new BehaviorSubject<SolarPanelDamage>({
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  });

  getSolarPanelDamageValues() {
    return this.solarPanelDamage$.asObservable();
  }

  setSolarPanelDamageValues(solarPanelDamage: SolarPanelDamage) {
    this.solarPanelDamage$.next(solarPanelDamage);
  }
  
// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  save() {
    const createSolarPanelRequest: CreateSolarPanelRequest = {
      category: this.solarPanelIdentification$.value.category,
      manufacturer: this.solarPanelIdentification$.value.manufacturer,
      model: this.solarPanelIdentification$.value.model,
      type: this.solarPanelIdentification$.value.type,
      serialNumber: this.solarPanelIdentification$.value.serialNumber,
      createSolarPanelDamage: {
        hotSpots: this.solarPanelDamage$.value.hotSpots,
        microCracks: this.solarPanelDamage$.value.microCracks,
        snailTrails: this.solarPanelDamage$.value.snailTrails,
        brokenGlass: this.solarPanelDamage$.value.brokenGlass,
        additionalDetails: this.solarPanelDamage$.value.additionalDetails
      }
    }

    this._solarPanelDataService.save(createSolarPanelRequest); //TODO: Add switchMap as in WashingMachineService
    this._notifService.showSuccess("Solar Panel saved!", 0);
  }

// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************
  
  private recommendation!: SolarPanelRecommendation;

  getRecommendation() {
    this.recommendation = this.generateRecommendation();
    return this.recommendation;
  }

  generateRecommendation() { //TODO: Replace with backend generation
    const integrity: number = 100 - (
      this.calculateForHotSpots(this.solarPanelDamage$.value.hotSpots) + 
      this.calculateForMicroCracks(this.solarPanelDamage$.value.microCracks) + 
      this.calculateForSnailTrails(this.solarPanelDamage$.value.snailTrails) + 
      this.calculateForBrokenGlass(this.solarPanelDamage$.value.brokenGlass)
    );

    return this.calculateRecommendation(integrity);
  }

  calculateRecommendation(integrity: number): SolarPanelRecommendation {
    switch (integrity) {
      case 100: return SolarPanelRecommendation.REPAIR;
      case 75: return SolarPanelRecommendation.REPAIR;
      case 50: return SolarPanelRecommendation.RECYCLE;
      case 25: return SolarPanelRecommendation.DISPOSE;
      default: throw new Error('Invalid integrity value');
    }
  }

  calculateForHotSpots(hotSpots: boolean): number {
    return hotSpots
      ? 25
      : 0;
  }

  calculateForMicroCracks(microCracks: boolean): number {
    return microCracks
      ? 25
      : 0;
  }

  calculateForSnailTrails(snailTrails: boolean): number {
    return snailTrails
      ? 25
      : 0;
  }

  calculateForBrokenGlass(brokenGlass: boolean): number {
    return brokenGlass
      ? 25
      : 0;
  }

}
