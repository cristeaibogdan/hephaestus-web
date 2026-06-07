import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, switchMap } from 'rxjs';
import { Identification } from '../models/identification.model';
import { SolarPanelApi } from "../solar-panel.api";
import { CreateSolarPanelRequest } from "../models/endpoints/create-solar-panel.endpoint";
import { Recommendation } from '../recommendation.enum';
import { Damage } from '../models/damage.model';

/**
 * TODO:
 *  1. Have 1 internal signal with _ and one public as readonly
 *  2. Use directly service.publicSignal in HTML rather than store it in another variable in the component
 *  3. Consider migrating to a signals-based store
 */
@Injectable({providedIn: 'root'})
export class SolarPanelCreateService {
  private _solarPanelApi = inject(SolarPanelApi);

// **************************************
// *** STEP 1 = IDENTIFICATION
// **************************************

  private readonly solarPanelIdentificationDefault: Identification = {
    category: '',
    manufacturer: '',
    model: '',
    type: '',
    serialNumber: ''
  }

  private solarPanelIdentification = signal<Identification>(this.solarPanelIdentificationDefault);

  getSolarPanelIdentification() {
    return this.solarPanelIdentification.asReadonly();
  }

  setSolarPanelIdentification(solarPanelIdentification: Identification) {
    this.solarPanelIdentification.set(solarPanelIdentification);
  }

  resetSolarPanelIdentification() {
    this.solarPanelIdentification.set(this.solarPanelIdentificationDefault);
  }

// **************************************
// *** STEP 2 = DAMAGE
// **************************************

  private readonly solarPanelDamageDefault: Damage = {
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  }

  private solarPanelDamage = signal<Damage>(this.solarPanelDamageDefault);

  getSolarPanelDamage() {
    return this.solarPanelDamage.asReadonly();
  }

  setSolarPanelDamage(solarPanelDamage: Damage) {
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

    return firstValueFrom(this._solarPanelApi.create(saveSolarPanelRequest).pipe(
      switchMap(() => {
        return this._solarPanelApi.getRecommendation(solarPanelIdentification.serialNumber);
      })
    )).then((response) => {
      this.recommendation = response;
      return true;
    });
  }

// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************

  private recommendation!: Recommendation;

  getRecommendation(): Recommendation {
    return this.recommendation;
  }

}
