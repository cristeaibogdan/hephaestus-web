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

  private solarPanelDamage$ = new BehaviorSubject<SolarPanelDamage>({
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  });

  getSolarPanelDamage() {
    return this.solarPanelDamage$.asObservable();
  }

  setSolarPanelDamage(solarPanelDamage: SolarPanelDamage) {
    this.solarPanelDamage$.next(solarPanelDamage);
  }

  resetSolarPanelDamage() {
    const initialSolarPanelDamage: SolarPanelDamage = {
      hotSpots: false,
      microCracks: false,
      snailTrails: false,
      brokenGlass: false,
      additionalDetails: ''
    }
    this.solarPanelDamage$.next(initialSolarPanelDamage);
  }
  
// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  save(): Promise<boolean> {
    if (this.solarPanelIdentification$() == null || this.solarPanelDamage$.value == null) {
      return Promise.reject();
    }

    const saveSolarPanelRequest: SaveSolarPanelRequest = {
      category: this.solarPanelIdentification$().category,
      manufacturer: this.solarPanelIdentification$().manufacturer,
      model: this.solarPanelIdentification$().model,
      type: this.solarPanelIdentification$().type,
      serialNumber: this.solarPanelIdentification$().serialNumber,
      saveSolarPanelDamageRequest: {
        hotSpots: this.solarPanelDamage$.value.hotSpots,
        microCracks: this.solarPanelDamage$.value.microCracks,
        snailTrails: this.solarPanelDamage$.value.snailTrails,
        brokenGlass: this.solarPanelDamage$.value.brokenGlass,
        additionalDetails: this.solarPanelDamage$.value.additionalDetails
      }
    }

    console.log("Saving = ", saveSolarPanelRequest)
    
    return firstValueFrom(this._solarPanelDataService.save(saveSolarPanelRequest).pipe(
      switchMap(() => {
        if (!this.solarPanelIdentification$()) {
          return EMPTY; // Prevent the next call if identification is missing
        }
        return this._solarPanelDataService.getRecommendation(this.solarPanelIdentification$().serialNumber);
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
