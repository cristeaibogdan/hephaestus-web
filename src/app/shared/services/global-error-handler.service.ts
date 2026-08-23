import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

interface ProblemDetail {
  status: number;
  detail: string;
  title?: string;
  errors?: ValidationError[]; // only present on validation failures
}

interface ValidationError {
  detail: string;
  jsonPointer: string;
}

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
        if (this.isProblemDetail(error)) {
          const body = error.error as ProblemDetail;
          const message = body.errors?.length
            ? body.errors.map(e => e.detail).join('\n') // VALIDATION ERRORS FROM BACKEND
            : body.detail; // SINGLE DETAIL MESSAGE FROM BACKEND
          this._notifService.showError(
            message ?? this._translocoService.translate('I18N.GENERAL_ERROR.DEFAULT'), // FALLBACK FOR OBJECT WITH NO ERRORS NOR DETAIL POPULATED
            0
          );
          return;
        }

        switch (error.status) {
          case 0:
            this._notifService.showError(this._translocoService.translate('I18N.GENERAL_ERROR.0'));
            break;
          case 404:
            this._notifService.showError(this._translocoService.translate('I18N.GENERAL_ERROR.404'));
            break;
          default:
            this._notifService.showError(this._translocoService.translate('I18N.GENERAL_ERROR.DEFAULT'));
            break;
        }
      }

      if (error instanceof TimeoutError) {
        this._notifService.showError(this._translocoService.translate("I18N.CUSTOM_ERROR.TIMEOUT"));
      }
    });
  }

  isProblemDetail(error: HttpErrorResponse): boolean {
    return error.headers.get('Content-Type')?.includes('application/problem+json') ?? false;
  }
}
