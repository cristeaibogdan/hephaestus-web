import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  constructor(private _languageService: LanguageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.context.has(SKIP_INTERCEPTOR)) {
      return next.handle(request);
    }
    
    const modifiedRequest = request.clone({
      setHeaders: {"Accept-Language": this._languageService.getSelectedLanguage().value}
    });

    return next.handle(modifiedRequest);
  }
}
