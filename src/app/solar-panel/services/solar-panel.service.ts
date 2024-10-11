import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreateSolarPanelRequestDTO } from '../models/dtos/create-solar-panel-request.dto';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';
import { SolarPanelDataService } from './solar-panel-data.service';
import { NotificationService } from 'src/app/services/notification.service';

@Injectable({providedIn: 'root'})
export class SolarPanelService {

  constructor(
    private _solarPanelDataService: SolarPanelDataService,
    private _notifService: NotificationService,
  ) { }

// **************************************
// *** STEP 1 = IDENTIFICATION
// **************************************

  private createSolarPanelRequestDTO = new BehaviorSubject<CreateSolarPanelRequestDTO>({
    category: "",  
    manufacturer: "",
    model: "",
    type: "",
    serialNumber: ""
  });

  setSolarPanelIdentificationValues(solarPanelIdentification :SolarPanelIdentification) {
    this.createSolarPanelRequestDTO.value.category = solarPanelIdentification.category;
    this.createSolarPanelRequestDTO.value.manufacturer = solarPanelIdentification.manufacturer;
    this.createSolarPanelRequestDTO.value.model = solarPanelIdentification.model;
    this.createSolarPanelRequestDTO.value.type = solarPanelIdentification.type;
    this.createSolarPanelRequestDTO.value.serialNumber = solarPanelIdentification.serialNumber;

    this.save(); //TODO: Remove after doing Damage Assessment page.
  }

  clearSolarPanelIdentificationValues() {
    this.createSolarPanelRequestDTO.value.category = "";
    this.createSolarPanelRequestDTO.value.manufacturer = "";
    this.createSolarPanelRequestDTO.value.model = "";
    this.createSolarPanelRequestDTO.value.type = "";
    this.createSolarPanelRequestDTO.value.serialNumber = "";
  }

// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************

  save() {
    this._solarPanelDataService.save(this.createSolarPanelRequestDTO.value);
    this._notifService.showSuccess("Solar Panel saved!", 0);
  }
}
