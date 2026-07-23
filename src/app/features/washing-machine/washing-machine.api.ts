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

@Injectable({providedIn: 'root'})
export class WashingMachineApi {
  private readonly apiURL = environment.apiBaseUrl;
  private readonly http = inject(HttpClient);

  // TODO: Extract strings so they can be reused in playwright tests
//**************************************
//*** STEP 3 = OVERVIEW
//**************************************

  getRecommendation(serialNumber:string): Observable<Recommendation> {
    const url = this.apiURL.concat("/v1/washing-machines/")
    .concat(serialNumber)
    .concat("/recommendation");
    return this.http.get<Recommendation>(url);
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
      this.apiURL.concat("/v1/washing-machines/create"),
      formData
    );
  }

//**************************************
//*** STEP 4 = RECOMMENDED DECISION
//**************************************

  getReport(serialNumber:string): Observable<GetWashingMachineReportResponse> {
    const url = this.apiURL.concat("/v1/washing-machines/")
      .concat(serialNumber)
      .concat("/report");

    return this.http.get<GetWashingMachineReportResponse>(url);
  }

//**************************************
//*** HISTORY
//**************************************

  search(searchWashingMachineRequest: SearchWashingMachineRequest): Observable<Page<SearchWashingMachineResponse>> {
    const url = this.apiURL.concat("/v1/washing-machines/search");
    return this.http.post<Page<SearchWashingMachineResponse>>(url, searchWashingMachineRequest);
  }

  /**
  * @deprecated This method is deprecated, use `loadMany` instead.
  */
  load(serialNumber:string): Observable<GetWashingMachineFullResponse> {
    const url = this.apiURL.concat("/v1/washing-machines/")
      .concat(serialNumber);

    return this.http.get<GetWashingMachineFullResponse>(url);
  }

  loadMany(serialNumbers:string[]): Observable<Record<string, GetWashingMachineFullResponse>> {
    const url = this.apiURL.concat("/v1/washing-machines/many");

    return this.http.post<Record<string, GetWashingMachineFullResponse>>(url, serialNumbers);
  }

  delete(serialNumber:string): Observable<void> {
    const url = this.apiURL.concat("/v1/washing-machines/")
      .concat(serialNumber);

    return this.http.delete<void>(url);
  }
}

