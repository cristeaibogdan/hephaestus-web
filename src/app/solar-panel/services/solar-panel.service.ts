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

  private createSolarPanelRequestDTO = new BehaviorSubject<SolarPanelIdentification>({
    category: "",  
    manufacturer: "",
    model: "",
    type: "",
    serialNumber: ""
  });

  setSolarPanelIdentificationValues(solarPanelIdentification :SolarPanelIdentification) {
    this.createSolarPanelRequestDTO.next(solarPanelIdentification);

    // this.save(); //TODO: Remove after doing Damage Assessment page.
  }

  clearSolarPanelIdentificationValues() {
    this.createSolarPanelRequestDTO.value.category = "";
    this.createSolarPanelRequestDTO.value.manufacturer = "";
    this.createSolarPanelRequestDTO.value.model = "";
    this.createSolarPanelRequestDTO.value.type = "";
    this.createSolarPanelRequestDTO.value.serialNumber = "";
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

  setSolarPanelDamageValues(solarPanelDamage: SolarPanelDamage) {
    this.solarPanelDamage = solarPanelDamage;
  }
  
// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************

  save() {
    this._solarPanelDataService.save(this.createSolarPanelRequestDTO.value);
    this._notifService.showSuccess("Solar Panel saved!", 0);
  }
}
