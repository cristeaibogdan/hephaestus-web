import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  SearchWashingMachineRequest,
  SearchWashingMachineResponse
} from './models/endpoints/search-washing-machine.endpoint';
import {GetWashingMachineReportResponse} from "./models/endpoints/get-washing-machine-report.endpoint";
import {Recommendation} from './enums/recommendation.enum';
import {Observable} from 'rxjs';
import {GetWashingMachineFullResponse} from './models/endpoints/get-washing-machine-full.endpoint';
import {environment} from 'src/environments/environment';
import {Page} from 'src/app/shared/models/page.model';
import {CreateWashingMachineRequest} from "./models/endpoints/create-washing-machine.endpoint";
import {ImageFile} from "./models/image-file.model";
import {WASHING_MACHINE_ENDPOINTS} from "../../../environments/endpoints";

@Injectable({providedIn: 'root'})
export class WashingMachineApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

//**************************************
//*** STEP 3 = OVERVIEW
//**************************************

  getRecommendation(serialNumber:string): Observable<Recommendation> {
    return this.http.get<Recommendation>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.getRecommendation(serialNumber)
    );
  }

  create(createWashingMachineRequest: CreateWashingMachineRequest, files: ImageFile[]): Observable<void> {
    const formData = new FormData();
    formData.append(
      'createWashingMachineRequest',
      new Blob(
        [JSON.stringify(createWashingMachineRequest)],
        { type: 'application/json' }
      )
    );
    for (const file of files) {
      formData.append('imageFiles', file.file);
    }

    return this.http.post<void>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.create(),
      formData
    );
  }

//**************************************
//*** STEP 4 = RECOMMENDED DECISION
//**************************************

  getReport(serialNumber:string): Observable<GetWashingMachineReportResponse> {
    return this.http.get<GetWashingMachineReportResponse>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.getReport(serialNumber)
    );
  }

//**************************************
//*** HISTORY
//**************************************

  search(searchWashingMachineRequest: SearchWashingMachineRequest): Observable<Page<SearchWashingMachineResponse>> {
    return this.http.post<Page<SearchWashingMachineResponse>>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.search(),
      searchWashingMachineRequest
    );
  }

  /**
  * @deprecated This method is deprecated, use `loadMany` instead.
  */
  load(serialNumber:string): Observable<GetWashingMachineFullResponse> {
    return this.http.get<GetWashingMachineFullResponse>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.load(serialNumber)
    );
  }

  loadMany(serialNumbers:string[]): Observable<Record<string, GetWashingMachineFullResponse>> {
    return this.http.post<Record<string, GetWashingMachineFullResponse>>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.loadMany(),
      serialNumbers
    );
  }

  delete(serialNumber:string): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.delete(serialNumber)
    );
  }
}

