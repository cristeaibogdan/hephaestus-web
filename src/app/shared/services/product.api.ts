import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetProductIdentificationResponse } from '../models/get-product-identification.response';
import {environment} from "../../../environments/environment";
import {GetModelAndTypeResponse} from "../models/get-model-and-type.response";

@Injectable({providedIn: 'root'})
export class ProductApi {
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
