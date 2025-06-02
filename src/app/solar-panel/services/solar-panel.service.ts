import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, switchMap } from 'rxjs';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelDataService } from './solar-panel-data.service';
import { CreateSolarPanelRequest } from '../models/dtos/create-solar-panel.request';
import { SolarPanelRecommendation } from '../enums/solar-panel-recommendation.enum';
import { SolarPanelDamage } from '../models/solar-panel-damage.model';

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

  private solarPanelIdentification = signal<SolarPanelIdentification>(this.solarPanelIdentificationDefault);
  
  getSolarPanelIdentification() {
    return this.solarPanelIdentification.asReadonly();
  }

  setSolarPanelIdentification(solarPanelIdentification: SolarPanelIdentification) {
    this.solarPanelIdentification.set(solarPanelIdentification);
  }

  resetSolarPanelIdentification() {    
    this.solarPanelIdentification.set(this.solarPanelIdentificationDefault);
  }

// **************************************
// *** STEP 2 = DAMAGE
// **************************************

  private readonly solarPanelDamageDefault: SolarPanelDamage = {
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  }

  private solarPanelDamage = signal<SolarPanelDamage>(this.solarPanelDamageDefault);

  getSolarPanelDamage() {
    return this.solarPanelDamage.asReadonly();
  }

  setSolarPanelDamage(solarPanelDamage: SolarPanelDamage) {
    this.solarPanelDamage.set(solarPanelDamage);
  }

  resetSolarPanelDamage() {
    this.solarPanelDamage.set(this.solarPanelDamageDefault);
  }
  
// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  create(): Promise<boolean> {
    // Alternative solution (spreading), simpler but a bit harder to read.
    // const saveSolarPanelRequest: CreateSolarPanelRequest = {
    //   ...this.solarPanelIdentification$(),
    //   damage: {
    //     ...this.solarPanelDamage$()
    //   }
    // }

    // Another alternative solution (destructuring)
    // const {category, manufacturer, model, type, serialNumber}: SolarPanelIdentification = this.solarPanelIdentification$();
    // const {hotSpots, microCracks, snailTrails, brokenGlass, additionalDetails}: SolarPanelDamage = this.solarPanelDamage$();

    // const saveSolarPanelRequest: CreateSolarPanelRequest = {
    //   category: category, 
    //   manufacturer: manufacturer,
    //   model: model,
    //   type: type,
    //   serialNumber: serialNumber,
    //   damage: {
    //     hotSpots: hotSpots,
    //     microCracks: microCracks,
    //     snailTrails: snailTrails,
    //     brokenGlass: brokenGlass,
    //     additionalDetails: additionalDetails
    //   }
    // }

    const solarPanelIdentification = this.solarPanelIdentification();
    const solarPanelDamage = this.solarPanelDamage();

    const saveSolarPanelRequest: CreateSolarPanelRequest = {
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

    //TODO: Rename constants to match type
    //TODO: Add return types to methods
    console.log("Saving = ", saveSolarPanelRequest);
    
    return firstValueFrom(this._solarPanelDataService.create(saveSolarPanelRequest).pipe(
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
