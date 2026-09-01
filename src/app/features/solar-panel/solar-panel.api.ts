import { Injectable, inject } from '@angular/core';
import { CreateSolarPanelRequest } from "./models/endpoints/create-solar-panel.endpoint";
import { SearchSolarPanelRequest, SearchSolarPanelResponse } from "./models/endpoints/search-solar-panel.endpoint";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommendation } from './recommendation.enum';
import { GetSolarPanelFullResponse } from "./models/endpoints/get-solar-panel-full.endpoint";
import {Page} from "../../shared/models/page.model";
import {environment} from "../../../environments/environment";
import {SOLAR_PANEL_ENDPOINTS} from "../../../environments/endpoints";

@Injectable({providedIn: 'root'})
export class SolarPanelApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  create(createSolarPanelRequest: CreateSolarPanelRequest): Observable<void> {
    return this.http.post<void>(
      this.baseUrl + SOLAR_PANEL_ENDPOINTS.create(),
      createSolarPanelRequest
    );
  }

  getRecommendation(serialNumber:string): Observable<Recommendation> {
    return this.http.get<Recommendation>(
      this.baseUrl + SOLAR_PANEL_ENDPOINTS.getRecommendation(serialNumber)
    );
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
    return this.http.post<Page<SearchSolarPanelResponse>>(
      this.baseUrl + SOLAR_PANEL_ENDPOINTS.search(),
      searchSolarPanelRequest
    );
  }

  loadMany(serialNumbers: string[]): Observable<Record<string, GetSolarPanelFullResponse>> {
    return this.http.post<Record<string, GetSolarPanelFullResponse>>(
      this.baseUrl + SOLAR_PANEL_ENDPOINTS.loadMany(),
      serialNumbers
    );
  }

  delete(serialNumber:string): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl + SOLAR_PANEL_ENDPOINTS.delete(serialNumber)
    );
  }

}
