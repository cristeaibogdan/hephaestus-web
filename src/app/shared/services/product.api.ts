import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetProductIdentificationResponse } from '../models/get-product-identification.response';
import {GetModelAndTypeResponse} from "../models/get-model-and-type.response";
import {environment} from "../../../environments/environment";
import {PRODUCT_ENDPOINTS} from "../../../environments/endpoints";

@Injectable({providedIn: 'root'})
export class ProductApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getManufacturers(productCategory: string): Observable<string[]> {
    return this.http.get<string[]>(
      this.baseUrl + PRODUCT_ENDPOINTS.getManufacturers(productCategory)
    );
  }

  getModelsAndTypes(productManufacturer: string): Observable<GetModelAndTypeResponse[]> {
    return this.http.get<GetModelAndTypeResponse[]>(
      this.baseUrl + PRODUCT_ENDPOINTS.getModelsAndTypes(productManufacturer)
    );
  }

  getProductIdentification(qrCode: string): Observable<GetProductIdentificationResponse> {
    return this.http.get<GetProductIdentificationResponse>(
      this.baseUrl + PRODUCT_ENDPOINTS.getProductIdentification(qrCode)
    );
  }

}
