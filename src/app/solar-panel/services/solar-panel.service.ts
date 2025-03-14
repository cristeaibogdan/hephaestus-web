import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, switchMap, withLatestFrom } from 'rxjs';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelDataService } from './solar-panel-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SolarPanelDamage } from '../models/solar-panel-damage.model';
import { SaveSolarPanelRequest } from '../models/dtos/save-solar-panel.request';
import { SolarPanelRecommendation } from '../enums/solar-panel-recommendation.enum';

@Injectable({providedIn: 'root'})
export class SolarPanelService {
  private _solarPanelDataService = inject(SolarPanelDataService);
  private _notifService = inject(NotificationService);

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

  setSolarPanelIdentification(solarPanelIdentification: SolarPanelIdentification) {
    this.solarPanelIdentification$.next(solarPanelIdentification);

    // this.save(); //TODO: Remove after doing Damage Assessment page.
  }

  resetSolarPanelIdentification() {
    const initialSolarPanelIdentification: SolarPanelIdentification = {
      category: "",  
      manufacturer: "",
      model: "",
      type: "",
      serialNumber: ""
    }
    this.solarPanelIdentification$.next(initialSolarPanelIdentification);
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
    if (this.solarPanelIdentification$.value == null || this.solarPanelDamage$.value == null) {
      return Promise.reject();
    }

    const saveSolarPanelRequest: SaveSolarPanelRequest = {
      category: this.solarPanelIdentification$.value.category,
      manufacturer: this.solarPanelIdentification$.value.manufacturer,
      model: this.solarPanelIdentification$.value.model,
      type: this.solarPanelIdentification$.value.type,
      serialNumber: this.solarPanelIdentification$.value.serialNumber,
      saveSolarPanelDamageRequest: {
        hotSpots: this.solarPanelDamage$.value.hotSpots,
        microCracks: this.solarPanelDamage$.value.microCracks,
        snailTrails: this.solarPanelDamage$.value.snailTrails,
        brokenGlass: this.solarPanelDamage$.value.brokenGlass,
        additionalDetails: this.solarPanelDamage$.value.additionalDetails
      }
    }

    console.log("Saving = ", saveSolarPanelRequest)

    return new Promise((resolve) => {
      this._solarPanelDataService.save(saveSolarPanelRequest).pipe(
        withLatestFrom(this.getSolarPanelIdentification()),
        switchMap(([_, identification]) => {
          if(!identification) {
            return EMPTY;
          }
          return this._solarPanelDataService.getRecommendation(identification.serialNumber);
        })
      ).subscribe({
        next: (response) => {
          this.recommendation = response;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          throw error; // re-throw to be handled by GlobalErrorHandler
        },
      })
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
