import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, switchMap } from 'rxjs';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelDataService } from './solar-panel-data.service';
import { DamageResponse } from "../models/dtos/get-solar-panel-full.response";
import { SaveSolarPanelRequest } from '../models/dtos/save-solar-panel.request';
import { SolarPanelRecommendation } from '../enums/solar-panel-recommendation.enum';

@Injectable({providedIn: 'root'})
export class SolarPanelService {
  private _solarPanelDataService = inject(SolarPanelDataService);

// **************************************
// *** STEP 1 = IDENTIFICATION
// **************************************

  private readonly solarPanelIdentificationDefault: SolarPanelIdentification = {
    category: '',
    manufacturer: '',
    model: '',
    type: '',
    serialNumber: ''
  }

  private solarPanelIdentification$ = signal<SolarPanelIdentification>(this.solarPanelIdentificationDefault);
  
  getSolarPanelIdentification() {
    return this.solarPanelIdentification$;
  }

  setSolarPanelIdentification(solarPanelIdentification: SolarPanelIdentification) {
    this.solarPanelIdentification$.set(solarPanelIdentification);
  }

  resetSolarPanelIdentification() {    
    this.solarPanelIdentification$.set(this.solarPanelIdentificationDefault);
  }

// **************************************
// *** STEP 2 = DAMAGE
// **************************************

  private readonly solarPanelDamageDefault: DamageResponse = {
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  }

  private solarPanelDamage$ = signal<DamageResponse>(this.solarPanelDamageDefault);

  getSolarPanelDamage() {
    return this.solarPanelDamage$;
  }

  setSolarPanelDamage(solarPanelDamage: DamageResponse) {
    this.solarPanelDamage$.set(solarPanelDamage);
  }

  resetSolarPanelDamage() {
    this.solarPanelDamage$.set(this.solarPanelDamageDefault);
  }
  
// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  save(): Promise<boolean> {

    const solarPanelIdentification = this.solarPanelIdentification$();
    const solarPanelDamage = this.solarPanelDamage$();

    const saveSolarPanelRequest: SaveSolarPanelRequest = {
      category: solarPanelIdentification.category,
      manufacturer: solarPanelIdentification.manufacturer,
      model: solarPanelIdentification.model,
      type: solarPanelIdentification.type,
      serialNumber: solarPanelIdentification.serialNumber,
      damage: {
        hotSpots: solarPanelDamage.hotSpots,
        microCracks: solarPanelDamage.microCracks,
        snailTrails: solarPanelDamage.snailTrails,
        brokenGlass: solarPanelDamage.brokenGlass,
        additionalDetails: solarPanelDamage.additionalDetails
      }
    }

    console.log("Saving = ", saveSolarPanelRequest)
    
    return firstValueFrom(this._solarPanelDataService.save(saveSolarPanelRequest).pipe(
      switchMap(() => {        
        return this._solarPanelDataService.getRecommendation(solarPanelIdentification.serialNumber);
      })
    )).then((response) => {
      this.recommendation = response;
      return true;
    });
  }

// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************
  
  private recommendation!: SolarPanelRecommendation;

  getRecommendation(): SolarPanelRecommendation {
    return this.recommendation;
  }  

}
