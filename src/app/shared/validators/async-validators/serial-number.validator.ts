import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SKIP_INTERCEPTOR } from './skip-interceptor.token';
import {environment} from "../../../../environments/environment";
import {WASHING_MACHINE_ENDPOINTS} from "../../../../environments/endpoints";

@Injectable({ providedIn: 'root' })
export class SerialNumberValidator implements AsyncValidator {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  // TODO: Return `of(null)` when `control.value` is null or an empty string
  // to avoid unnecessary HTTP requests.
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    // Context so interceptor ignores it
    const context = new HttpContext().set(SKIP_INTERCEPTOR, true);

    return this.httpClient.get<boolean>(
      this.baseUrl + WASHING_MACHINE_ENDPOINTS.validate(control.value),
      {context}
    ).pipe(
      map(response =>
        response
          ? {invalid: true}
          : null
      ),

      // In case server can not be reached
      catchError((error: HttpErrorResponse): Observable<ValidationErrors | null> => {
        return of ({ backendError: true });
      })
    );
  }
}
