import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelDataService } from './solar-panel-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SolarPanelDamage } from '../models/solar-panel-damage.model';

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

  private solarPanelDamage: SolarPanelDamage = {
    hotSpots: false,
    microCracks: false,
    snailTrails: false,
    brokenGlass: false,
    additionalDetails: ''
  }

  getSolarPanelDamageValues() {
    return this.solarPanelDamage;
  }

  setSolarPanelDamageValues(solarPanelDamage: SolarPanelDamage) {
    this.solarPanelDamage = solarPanelDamage;
    console.log(solarPanelDamage);
  }
  
// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************

  save() {
    this._solarPanelDataService.save(this.solarPanelIdentification$.value);
    this._notifService.showSuccess("Solar Panel saved!", 0);
  }
}
