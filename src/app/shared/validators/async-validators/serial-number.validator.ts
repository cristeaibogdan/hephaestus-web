import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SKIP_INTERCEPTOR } from './skip-interceptor.token';

@Injectable({ providedIn: 'root' })
export class SerialNumberValidator implements AsyncValidator {

  private httpClient = inject(HttpClient);
  private apiURL = environment.apiBaseUrl;

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const url = this.apiURL.concat("/v1/washing-machines/")
      .concat(control.value)
      .concat("/validate");
    
    // Context so interceptor ignores it
    const context = new HttpContext().set(SKIP_INTERCEPTOR, true);
    
    return this.httpClient.get<boolean>(url, {context}).pipe(
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