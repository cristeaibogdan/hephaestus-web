import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, EMPTY, firstValueFrom, switchMap, withLatestFrom } from 'rxjs';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelDataService } from './solar-panel-data.service';
import { SolarPanelDamage } from '../models/solar-panel-damage.model';
import { SaveSolarPanelRequest } from '../models/dtos/save-solar-panel.request';
import { SolarPanelRecommendation } from '../enums/solar-panel-recommendation.enum';

@Injectable({providedIn: 'root'})
export class SolarPanelService {
  private _solarPanelDataService = inject(SolarPanelDataService);

// **************************************
// *** STEP 1 = IDENTIFICATION
// **************************************

  private solarPanelIdentification$ = signal<SolarPanelIdentification>({
    category: "",  
    manufacturer: "",
    model: "",
    type: "",
    serialNumber: ""
  });
  
  getSolarPanelIdentification() {
    return this.solarPanelIdentification$;
  }

  setSolarPanelIdentification(solarPanelIdentification: SolarPanelIdentification) {
    this.solarPanelIdentification$.set(solarPanelIdentification);
  }

  resetSolarPanelIdentification() {
    const initialSolarPanelIdentification: SolarPanelIdentification = {
      category: "",  
      manufacturer: "",
      model: "",
      type: "",
      serialNumber: ""
    }
    this.solarPanelIdentification$.set(initialSolarPanelIdentification);
  }

// **************************************
// *** STEP 2 = DAMAGE
// **************************************

  private solarPanelDamage$ = signal<SolarPanelDamage>({
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  });

  getSolarPanelDamage() {
    return this.solarPanelDamage$;
  }

  setSolarPanelDamage(solarPanelDamage: SolarPanelDamage) {
    this.solarPanelDamage$.set(solarPanelDamage);
  }

  resetSolarPanelDamage() {
    const initialSolarPanelDamage: SolarPanelDamage = {
      hotSpots: false,
      microCracks: false,
      snailTrails: false,
      brokenGlass: false,
      additionalDetails: ''
    }
    this.solarPanelDamage$.set(initialSolarPanelDamage);
  }
  
// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  save(): Promise<boolean> {
    if (this.solarPanelIdentification$() == null || this.solarPanelDamage$() == null) {
      return Promise.reject();
    }

    const solarPanelIdentification = this.solarPanelIdentification$();
    const solarPanelDamage = this.solarPanelDamage$();

    const saveSolarPanelRequest: SaveSolarPanelRequest = {
      category: solarPanelIdentification.category,
      manufacturer: solarPanelIdentification.manufacturer,
      model: solarPanelIdentification.model,
      type: solarPanelIdentification.type,
      serialNumber: solarPanelIdentification.serialNumber,
      saveSolarPanelDamageRequest: {
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
        if (!solarPanelIdentification) {
          return EMPTY; // Prevent the next call if identification is missing
        }
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
