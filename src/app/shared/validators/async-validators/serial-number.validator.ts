import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SerialNumberValidator implements AsyncValidator {

  constructor(private httpClient: HttpClient) { }

  apiURL = environment.apiBaseUrl;

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(control.value)
      .concat("/validate");
    
    // Header so interceptor ignores it
    const asyncHeader = new HttpHeaders().set('AsyncValidator', 'true');
    
    return this.httpClient.get<boolean>(url, {headers:asyncHeader}).pipe(
      map(response => 
        response
        ? {invalid: true}
        : null
      ),

      // In case server can not be reached
      catchError((error: HttpErrorResponse): Observable<ValidationErrors | null> => {
        return of<ValidationErrors | null>({ backendError: true });
      })
    );  
  }
}