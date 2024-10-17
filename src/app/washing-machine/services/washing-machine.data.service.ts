import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Page } from '../../shared/models/page.model';
import { SearchWashingMachineRequest } from '../models/dtos/search-washing-machine-request.dto';
import { WashingMachineDetailDTO } from '../models/dtos/washing-machine-detail.dto';
import { GetWashingMachineExpandedResponse } from '../models/dtos/get-washing-machine-expanded-response.dto';
import { GetWashingMachineReportResponse } from '../models/dtos/get-washing-machine-report-response.dto';
import { Recommendation } from '../enums/recommendation.enum';
import { GetWashingMachineSimpleResponse } from '../models/dtos/get-washing-machine-simple-response.dto';
import { ProductModelTypeDTO } from 'src/app/shared/models/product-model-type.dto';

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
  
  getRecommendation(serialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
    .concat(serialNumber)
    .concat("/recommendation");
    return this.http.get<Recommendation>(url);
  }

  save(washingMachine:FormData) {
    const url = this.apiURL.concat("/api/v1/washing-machines/save");
    return this.http.post(url, washingMachine);
  }

//**************************************
//*** STEP 4 = RECOMMENDED DECISION
//**************************************

  getReport(serialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(serialNumber)
      .concat("/report");

    return this.http.get<GetWashingMachineReportResponse>(url);
  }

//**************************************
//*** HISTORY
//**************************************

  loadPaginatedAndFiltered(searchWashingMachineRequest: SearchWashingMachineRequest) {
    const url = this.apiURL.concat("/api/v1/washing-machines");
    const payload = searchWashingMachineRequest;
    return this.http.post<Page<GetWashingMachineSimpleResponse>>(url, payload);
  }

  loadExpanded(productSerialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(productSerialNumber)
      .concat("/expanded");

    return this.http.get<GetWashingMachineExpandedResponse>(url);
  }
}

