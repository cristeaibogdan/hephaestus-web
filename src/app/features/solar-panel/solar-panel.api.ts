import { Injectable, inject } from '@angular/core';
import { CreateSolarPanelRequest } from "./models/endpoints/create-solar-panel.endpoint";
import { SearchSolarPanelRequest, SearchSolarPanelResponse } from "./models/endpoints/search-solar-panel.endpoint";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommendation } from './recommendation.enum';
import { GetSolarPanelFullResponse } from "./models/endpoints/get-solar-panel-full.endpoint";
import {Page} from "../../shared/models/page.model";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class SolarPanelApi {
  private apiURL = environment.apiBaseUrl;
  private http = inject(HttpClient);

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  create(createSolarPanelRequest: CreateSolarPanelRequest): Observable<void> {
    const url = this.apiURL.concat("/v1/solar-panels/create");
    return this.http.post<void>(url, createSolarPanelRequest);
  }

  getRecommendation(serialNumber:string): Observable<Recommendation> {
    const url = this.apiURL.concat("/v1/solar-panels/")
    .concat(serialNumber)
    .concat("/recommendation");
    return this.http.get<Recommendation>(url);
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
    const url = this.apiURL.concat("/v1/solar-panels/search");
    return this.http.post<Page<SearchSolarPanelResponse>>(url, searchSolarPanelRequest);
  }

  loadMany(serialNumbers: string[]): Observable<Record<string, GetSolarPanelFullResponse>> {
    const url = this.apiURL.concat("/v1/solar-panels/many");
    return this.http.post<Record<string, GetSolarPanelFullResponse>>(url, serialNumbers);
  }

}
