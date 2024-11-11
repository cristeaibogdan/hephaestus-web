import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';

export const timeoutInterceptor : HttpInterceptorFn = (request, next) => {
  
  const DEFAULT_TIMEOUT = 20_000; // 20 seconds

    return next(request).pipe(
      timeout(DEFAULT_TIMEOUT)
    );
  }