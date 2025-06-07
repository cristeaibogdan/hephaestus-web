import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Page } from '../../shared/models/page.model';
import { SearchWashingMachineRequest } from '../models/dtos/search-washing-machine.request';
import { GetWashingMachineReportResponse } from '../models/dtos/get-washing-machine-report.response';
import { Recommendation } from '../enums/recommendation.enum';
import { SearchWashingMachineResponse } from '../models/dtos/search-washing-machine.response';
import { Observable } from 'rxjs';
import { GetWashingMachineFullResponse } from '../models/dtos/get-washing-machine-full.response';

@Injectable({providedIn: 'root'})
export class WashingMachineDataService {
  private apiURL = environment.apiBaseUrl;
  private http = inject(HttpClient);

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

