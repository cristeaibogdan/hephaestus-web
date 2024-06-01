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
import { DataService } from '../services/data.service';
import { ErrorResponse } from '../components/models/error-response.model';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../components/shared/spinner/spinner.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private translate: TranslateService,
    private _dataService:DataService,
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

    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
        // console.log('Error returned by the server/backend', err);

          if (err.status === 418) { 
            // 418 (I AM A TEAPOT) = CUSTOM ERROR FROM BACKEND                   
            const errorResponse: ErrorResponse = err.error;

            const errorCode = errorResponse.errorCode;
            const errorMessage = `I18N.CUSTOM_ERROR.${errorCode}`;
            
            const translatedErrorMessage = this.translate.instant(errorMessage);
    
            // Check if translation exists, if not, provide a fallback message
            if(errorMessage == translatedErrorMessage) {
              return this._dataService.openSnackBar_Error("Error not translated, yet...", 0);
            }

            this._dataService.openSnackBar_Error(translatedErrorMessage, 0);

          } else { // GENERAL ERRORS FROM BACKEND

            switch (err.status) {
              case 0:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.GENERAL_ERROR.0"), 0);
                break;

              case 400:
                let exceptionMessage: string[] = [];

                for (let index = 0; index < err.error.errors.length; index++) {
                  const message: string = err.error.errors[index].defaultMessage;
                  exceptionMessage.push(message);
                }

                console.log(err);
                console.log(err.error.errors);

                this._dataService.openSnackBar_Error(exceptionMessage.join('\n'), 0);
                break;

              case 404:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.GENERAL_ERROR.404"), 0);
                break;
    
              default:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.GENERAL_ERROR.DEFAULT"), 0);
                console.log(err);
                break;
            }
          }        
      }
      }),

      finalize(() => {
        dialogSpinner.close();
      })
    );
  }
}
