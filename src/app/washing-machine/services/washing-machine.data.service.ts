import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Page } from '../../shared/models/page.model';
import { SearchWashingMachineRequestDTO } from '../models/dtos/search-washing-machine-request.dto';
import { WashingMachineDetailDTO } from '../models/dtos/washing-machine-detail.dto';
import { GetWashingMachineExpandedResponseDTO } from '../models/dtos/get-washing-machine-expanded-response.dto';
import { GetWashingMachineReportResponse } from '../models/dtos/get-washing-machine-report-response.dto';
import { Recommendation } from '../enums/recommendation.enum';
import { GetWashingMachineSimpleResponseDTO } from '../models/dtos/get-washing-machine-simple-response.dto';
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
  
  getRecommendation(washingMachineDetail:WashingMachineDetailDTO) {
    const url = this.apiURL.concat("/api/v1/washing-machines/recommendation");
    return this.http.post<Recommendation>(url, washingMachineDetail);
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

    return this.http.get<GetWashingMachineReportResponse>(url);
  }

//**************************************
//*** HISTORY
//**************************************

  loadPaginatedAndFiltered(searchWashingMachineRequestDTO: SearchWashingMachineRequestDTO) {
    const url = this.apiURL.concat("/api/v1/washing-machines");
    const payload = searchWashingMachineRequestDTO;
    return this.http.post<Page<GetWashingMachineSimpleResponseDTO>>(url, payload);
  }

  loadExpanded(productSerialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(productSerialNumber)
      .concat("/expanded");

    return this.http.get<GetWashingMachineExpandedResponseDTO>(url);
  }
}

