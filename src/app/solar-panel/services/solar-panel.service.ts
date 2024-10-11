import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreateSolarPanelRequestDTO } from '../models/dtos/create-solar-panel-request.dto';
import { SolarPanelIdentification } from '../models/solar-panel-identification.model';

@Injectable({providedIn: 'root'})
export class SolarPanelService {

  constructor() { }

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
    console.log("BehaviorSubject values = ", this.createSolarPanelRequestDTO.getValue());
  }
}
