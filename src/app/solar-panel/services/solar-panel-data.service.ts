import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class SolarPanelDataService {
  apiURL = environment.apiBaseUrl;

  constructor() { }

//**************************************
//*** STEP 1 = IDENTIFICATION
//**************************************

  getManufacturers(category: string) {
    return ["Tesla", "Tongwei", "Qcells", "Bloom Energy"];
  }
}
