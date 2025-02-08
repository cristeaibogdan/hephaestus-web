import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);
  private ngZone = inject(NgZone);

  override handleError(error: any): void {
    /*
      Common issue with Angular's error handling and Material snackbars.
      The problem occurs because the GlobalErrorHandler runs outside of Angular's zone, 
      which affects the snackbar's positioning animation. To fix we need to use ngZone.
    **/
    this.ngZone.run(() => {
      super.handleError(error); // Call the default error handler to log the error.

      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 0:
            this._notifService.showError(this._translocoService.translate("I18N.GENERAL_ERROR.0"), 0);
            break;

          case 404:
            this._notifService.showError(this._translocoService.translate("I18N.GENERAL_ERROR.404"), 0);
            break;

          case 400:
            (Array.isArray(error.error)) 
              ? this._notifService.showError(error.error.join("\n"), 0) // CUSTOM VALIDATION ERRORS FROM BACKEND
              : this._notifService.showError(this._translocoService.translate("I18N.GENERAL_ERROR.404_DEFAULT"), 0); // GENERAL ERRORS FROM BACKEND            
            break;

          default: 
            (typeof error.error === "string") 
              ? this._notifService.showError(error.error, 0) // CUSTOM ERRORS FROM BACKEND
              : this._notifService.showError(this._translocoService.translate("I18N.GENERAL_ERROR.DEFAULT"), 0); // GENERAL ERRORS FROM BACKEND
            break;   
        }
      }

      if (error instanceof TimeoutError) {
        this._notifService.showError(this._translocoService.translate("I18N.CUSTOM_ERROR.TIMEOUT"), 0);
      }
    });
  }
}
