import {Injectable, inject, signal, computed} from '@angular/core';
import { firstValueFrom, switchMap } from 'rxjs';
import { Identification } from '../models/identification.model';
import { SolarPanelApi } from "../solar-panel.api";
import { CreateSolarPanelRequest } from "../models/endpoints/create-solar-panel.endpoint";
import { Recommendation } from '../recommendation.enum';
import { Damage } from '../models/damage.model';

// TODO: Consider migrating to a signals-based store
@Injectable({providedIn: 'root'})
export class SolarPanelCreateService {
  private _solarPanelApi = inject(SolarPanelApi);

// **************************************
// *** STEP 1 = IDENTIFICATION
// **************************************

  private readonly identificationDefault: Identification = {
    category: '',
    manufacturer: '',
    model: '',
    type: '',
    serialNumber: ''
  }

  private readonly _identification = signal<Identification>(this.identificationDefault);
  readonly identification = computed(() => Object.freeze(this._identification()));

  setIdentification(identification: Identification) {
    this._identification.set(identification);
  }

  resetIdentification() {
    this._identification.set(this.identificationDefault);
  }

// **************************************
// *** STEP 2 = DAMAGE
// **************************************

  private readonly damageDefault: Damage = {
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  }

  private readonly _damage = signal<Damage>(this.damageDefault);
  readonly damage = computed(() => Object.freeze(this._damage()));

  setDamage(damage: Damage) {
    this._damage.set(damage);
  }

  resetDamage() {
    this._damage.set(this.damageDefault);
  }

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  async create(): Promise<boolean> {
    // Alternative solution (spreading), simpler but a bit harder to read.
    // const createSolarPanelRequest: CreateSolarPanelRequest = {
    //   ...this._identification$(),
    //   _damage: {
    //     ...this._damage$()
    //   }
    // }

    // Another alternative solution (destructuring)
    // const {category, manufacturer, model, type, serialNumber}: SolarPanelIdentification = this._identification$();
    // const {hotSpots, microCracks, snailTrails, brokenGlass, additionalDetails}: SolarPanelDamage = this._damage$();

    // const createSolarPanelRequest: CreateSolarPanelRequest = {
    //   category: category,
    //   manufacturer: manufacturer,
    //   model: model,
    //   type: type,
    //   serialNumber: serialNumber,
    //   _damage: {
    //     hotSpots: hotSpots,
    //     microCracks: microCracks,
    //     snailTrails: snailTrails,
    //     brokenGlass: brokenGlass,
    //     additionalDetails: additionalDetails
    //   }
    // }

    const identification = this._identification();
    const damage = this._damage();

    const createSolarPanelRequest: CreateSolarPanelRequest = {
      category: identification.category,
      manufacturer: identification.manufacturer,
      model: identification.model,
      type: identification.type,
      serialNumber: identification.serialNumber,
      damage: {
        hotSpots: damage.hotSpots,
        microCracks: damage.microCracks,
        snailTrails: damage.snailTrails,
        brokenGlass: damage.brokenGlass,
        additionalDetails: damage.additionalDetails
      }
    }

    //TODO: Rename constants to match type
    //TODO: Add return types to methods
    console.log("Saving = ", createSolarPanelRequest);

    return firstValueFrom(this._solarPanelApi.create(createSolarPanelRequest).pipe(
      switchMap(() => {
        return this._solarPanelApi.getRecommendation(identification.serialNumber);
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
