import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Page } from '../../shared/models/page.model';
import { PageRequestDTO } from '../models/dtos/page-request.dto';
import { ProductModelTypeDTO } from '../models/dtos/product-model-type.dto';
import { WashingMachineDetailsDTO } from '../models/dtos/washing-machine-details.dto';
import { WashingMachineEvaluationDTO } from '../models/dtos/washing-machine-evaluation.dto';
import { WashingMachineExpandedDTO } from '../models/dtos/washing-machine-expanded.dto';
import { WashingMachineReportDTO } from '../models/dtos/washing-machine-report.dto';
import { WashingMachineDTO } from '../models/dtos/washing-machine.dto';

@Injectable({providedIn: 'root'})
export class WashingMachineDataService {
  apiURL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

//**************************************
//*** STEP 1 = PRODUCT IDENTIFICATION
//**************************************

  getManufacturers(productCategory: string) {
    let url = this.apiURL.concat("/api/v1/products/")
      .concat(productCategory)
      .concat("/manufacturers");
    
    return this.http.get<string[]>(url);
  }
  
  getModelsAndTypes(productManufacturer: string) {
    const url = this.apiURL.concat("/api/v1/products/")
      .concat(productManufacturer)
      .concat("/models-and-types");

    return this.http.get<ProductModelTypeDTO[]>(url);
  }

//**************************************
//*** STEP 3 = OVERVIEW
//**************************************
  
  getDamageEvaluation(washingMachineDetails:WashingMachineDetailsDTO) {
    const url = this.apiURL.concat("/api/v1/washing-machines/evaluate");
    return this.http.post<WashingMachineEvaluationDTO>(url, washingMachineDetails);
  }

//**************************************
//*** STEP 4 = RECOMMENDED DECISION
//**************************************

  save(washingMachine:FormData) {
    const url = this.apiURL.concat("/api/v1/washing-machines/save");
    return this.http.post(url, washingMachine);
  }

  getReport(serialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(serialNumber)
      .concat("/report");

    return this.http.get<WashingMachineReportDTO>(url);
  }

//**************************************
//*** HISTORY
//**************************************

  loadPaginatedAndFiltered(pageRequestDTO:PageRequestDTO) {
    const url = this.apiURL.concat("/api/v1/washing-machines");
    const payload = pageRequestDTO;
    return this.http.post<Page<WashingMachineDTO>>(url, payload);
  }

  loadExpanded(productSerialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(productSerialNumber)
      .concat("/expanded");

    return this.http.get<WashingMachineExpandedDTO>(url);
  }
}

