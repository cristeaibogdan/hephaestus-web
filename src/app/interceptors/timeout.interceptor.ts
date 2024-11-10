import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly DEFAULT_TIMEOUT = 20_000; // 20 seconds
  
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      timeout(this.DEFAULT_TIMEOUT)
    );
  }
}
