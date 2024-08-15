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
import { WashingMachineDataService } from '../washing-machine/services/washing-machine.data.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private translate: TranslateService,
    private _languageService: LanguageService,
    private _washingMachineDataService: WashingMachineDataService,
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
            this._washingMachineDataService.openSnackBar_Error(this.translate.instant("I18N.GENERAL_ERROR.0"), 0);
            break;

          case 404:
            this._washingMachineDataService.openSnackBar_Error(this.translate.instant("I18N.GENERAL_ERROR.404"), 0);
            break;

          default: 
            (typeof err.error === "string") 
              ? this._washingMachineDataService.openSnackBar_Error(err.error, 0) // CUSTOM ERRORS FROM BACKEND
              : this._washingMachineDataService.openSnackBar_Error(this.translate.instant("I18N.GENERAL_ERROR.DEFAULT"), 0); // GENERAL ERRORS FROM BACKEND            
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
