import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetModelAndTypeResponse } from 'src/app/shared/models/get-model-and-type.response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetProductIdentificationResponse } from '../shared/models/get-product-identification.response';

@Injectable({providedIn: 'root'})
export class ProductDataService {
  private apiURL = environment.apiBaseUrl;
  private http = inject(HttpClient);

  getManufacturers(productCategory: string): Observable<string[]> {
    let url = this.apiURL.concat("/v1/products/")
      .concat(productCategory)
      .concat("/manufacturers");
    
    return this.http.get<string[]>(url);
  }
  
  getModelsAndTypes(productManufacturer: string): Observable<GetModelAndTypeResponse[]> {
    const url = this.apiURL.concat("/v1/products/")
      .concat(productManufacturer)
      .concat("/models-and-types");

    return this.http.get<GetModelAndTypeResponse[]>(url);
  }

  getProductIdentification(qrCode: string): Observable<GetProductIdentificationResponse> {
    const url = this.apiURL.concat("/v1/products/")
    .concat(qrCode);

    return this.http.get<GetProductIdentificationResponse>(url);
  }

}
