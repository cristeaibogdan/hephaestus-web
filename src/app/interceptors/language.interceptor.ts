import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LanguageService } from '../services/language.service';
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';

export const languageInterceptor: HttpInterceptorFn = (request, next) => {
    
  if (request.context.has(SKIP_INTERCEPTOR)) {
    return next(request);
  }
  
  const _languageService = inject(LanguageService);
  
  const modifiedRequest = request.clone({
    setHeaders: {"Accept-Language": _languageService.getSelectedLanguage().value}
  });

  return next(modifiedRequest);
}