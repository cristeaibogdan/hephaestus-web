import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from '../services/language.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  constructor(private _languageService: LanguageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Ignore async validators
    if (request.headers.has('AsyncValidator')) {
      return next.handle(request);
    }
    
    const modifiedRequest = request.clone({
      setHeaders: {"Accept-Language": this._languageService.getSelectedLanguage().value}
    });

    return next.handle(modifiedRequest);
  }
}
