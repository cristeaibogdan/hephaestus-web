import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateSolarPanelRequest } from '../models/dtos/create-solar-panel.request';
import { SearchSolarPanelRequest } from '../models/dtos/search-solar-panel.request';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolarPanelRecommendation } from '../enums/solar-panel-recommendation.enum';
import { Page } from 'src/app/shared/models/page.model';
import { SearchSolarPanelResponse } from '../models/dtos/search-solar-panel.response';
import { GetSolarPanelFullResponse } from '../models/dtos/get-solar-panel-full.response';

@Injectable({providedIn: 'root'})
export class SolarPanelDataService {
  private apiURL = environment.apiBaseUrl;
  private http = inject(HttpClient);

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  create(createSolarPanelRequest: CreateSolarPanelRequest): Observable<void> {
    const url = this.apiURL.concat("/v1/solar-panels/create");
    return this.http.post<void>(url, createSolarPanelRequest);
  }

  getRecommendation(serialNumber:string): Observable<SolarPanelRecommendation> {
    const url = this.apiURL.concat("/v1/solar-panels/")
    .concat(serialNumber)
    .concat("/recommendation");
    return this.http.get<SolarPanelRecommendation>(url);
  }

// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************

  getReport(serialNumber:string) {
    console.warn("Not implemented, yet...");
  }

//**************************************
//*** HISTORY
//**************************************

  search(searchSolarPanelRequest: SearchSolarPanelRequest): Observable<Page<SearchSolarPanelResponse>> {
    const url = this.apiURL.concat("/v1/solar-panels");
    return this.http.post<Page<SearchSolarPanelResponse>>(url, searchSolarPanelRequest);
  }

  loadMany(serialNumbers: string[]): Observable<Record<string, GetSolarPanelFullResponse>> {
    const url = this.apiURL.concat("/v1/solar-panels/many");
    return this.http.post<Record<string, GetSolarPanelFullResponse>>(url, serialNumbers);
  }

}
