import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private _translate: TranslateService,
    private _languageService: LanguageService,
    private _notifService: NotificationService,
    private dialog: MatDialog
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Ignore async validators
    if (request.headers.has('AsyncValidator')) {
      // console.log(request);
      return next.handle(request);
    }
   
    const dialogSpinner = this.dialog.open(SpinnerComponent, {
      disableClose: true,
      panelClass: "borderless-dialog"
    });

    // Clone request to add header
    const modifiedRequest = request.clone({
      setHeaders: {
        "Accept-Language": this._languageService.getSelectedLanguage().value
      }
    });

    return next.handle(modifiedRequest).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
        // console.log('Error returned by the server/backend', err);

        switch (err.status) {
          case 0:
            this._notifService.showError(this._translate.instant("I18N.GENERAL_ERROR.0"), 0);
            break;

          case 404:
            this._notifService.showError(this._translate.instant("I18N.GENERAL_ERROR.404"), 0);
            break;

          default: 
            (typeof err.error === "string") 
              ? this._notifService.showError(err.error, 0) // CUSTOM ERRORS FROM BACKEND
              : this._notifService.showError(this._translate.instant("I18N.GENERAL_ERROR.DEFAULT"), 0); // GENERAL ERRORS FROM BACKEND            
            break;   
        }
      }
      }),

      finalize(() => {
        dialogSpinner.close();
      })
    );
  }
}
