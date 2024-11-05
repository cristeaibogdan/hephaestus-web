import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, TimeoutError, tap, timeout } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly DEFAULT_TIMEOUT = 20_000; // 20 seconds
  
  constructor(
    private _translate: TranslateService,
    private _notifService: NotificationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      tap({
        error: (err: TimeoutError) => {
          if (err instanceof TimeoutError) {
            this._notifService.showError(this._translate.instant("I18N.CUSTOM_ERROR.TIMEOUT"), 0);
          }
        }
      })
    );
  }
}
