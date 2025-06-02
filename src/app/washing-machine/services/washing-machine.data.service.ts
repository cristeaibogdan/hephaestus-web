import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Page } from '../../shared/models/page.model';
import { SearchWashingMachineRequest } from '../models/dtos/search-washing-machine.request';
import { GetWashingMachineReportResponse } from '../models/dtos/get-washing-machine-report.response';
import { Recommendation } from '../enums/recommendation.enum';
import { SearchWashingMachineResponse } from '../models/dtos/search-washing-machine.response';
import { GetModelAndTypeResponse } from 'src/app/shared/models/get-model-and-type.response';
import { Observable } from 'rxjs';
import { GetWashingMachineFullResponse } from '../models/dtos/get-washing-machine-full.response';
import { GetProductIdentificationResponse } from 'src/app/shared/models/get-product-identification.response';

@Injectable({providedIn: 'root'})
export class WashingMachineDataService {
  apiURL = environment.apiBaseUrl;
  private http = inject(HttpClient);

//**************************************
//*** STEP 1 = PRODUCT IDENTIFICATION
//**************************************

  // TODO: Move these methods to a separate service?
  getManufacturers(productCategory: string): Observable<string[]> {
    let url = this.apiURL.concat("/api/v1/products/")
      .concat(productCategory)
      .concat("/manufacturers");
    
    return this.http.get<string[]>(url);
  }
  
  getModelsAndTypes(productManufacturer: string): Observable<GetModelAndTypeResponse[]> {
    const url = this.apiURL.concat("/api/v1/products/")
      .concat(productManufacturer)
      .concat("/models-and-types");

    return this.http.get<GetModelAndTypeResponse[]>(url);
  }

  getProductIdentification(qrCode: string): Observable<GetProductIdentificationResponse> {
    const url = this.apiURL.concat("/api/v1/products/")
    .concat(qrCode);

    return this.http.get<GetProductIdentificationResponse>(url);
  }

//**************************************
//*** STEP 3 = OVERVIEW
//**************************************
  
  getRecommendation(serialNumber:string): Observable<Recommendation> {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
    .concat(serialNumber)
    .concat("/recommendation");
    return this.http.get<Recommendation>(url);
  }

  create(washingMachine:FormData): Observable<void> {
    const url = this.apiURL.concat("/api/v1/washing-machines/create");
    return this.http.post<void>(url, washingMachine);
  }

//**************************************
//*** STEP 4 = RECOMMENDED DECISION
//**************************************

  getReport(serialNumber:string): Observable<GetWashingMachineReportResponse> {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(serialNumber)
      .concat("/report");

    return this.http.get<GetWashingMachineReportResponse>(url);
  }

//**************************************
//*** HISTORY
//**************************************

  search(searchWashingMachineRequest: SearchWashingMachineRequest): Observable<Page<SearchWashingMachineResponse>> {
    const url = this.apiURL.concat("/api/v1/washing-machines");
    const payload = searchWashingMachineRequest;
    return this.http.post<Page<SearchWashingMachineResponse>>(url, payload);
  }

  /**
  * @deprecated This method is deprecated, use `loadMany` instead.
  */
  load(serialNumber:string): Observable<GetWashingMachineFullResponse> {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(serialNumber);

    return this.http.get<GetWashingMachineFullResponse>(url);
  }

  loadMany(serialNumbers:string[]): Observable<Record<string, GetWashingMachineFullResponse>> {
    const url = this.apiURL.concat("/api/v1/washing-machines/many");

    return this.http.post<Record<string, GetWashingMachineFullResponse>>(url, serialNumbers);
  }
}

