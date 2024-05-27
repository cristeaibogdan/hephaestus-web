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
            // this._dataService.openSnackBar_Error(errorResponse.errorMessage, 0);

            switch(errorResponse.errorCode) {
              case 1001:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1001"), 0);
                break;
              case 1002:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1002"), 0);
                break;
              case 1003:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1003"), 0);
                break;
              case 1004:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1004"), 0);
                break;
              case 1005:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1005"), 0);
                break;
              case 1006:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1006"), 0);
                break;
              case 1007:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1007"), 0);
                break;
              case 1008:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1008"), 0);
                break;
              case 1009:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1009"), 0);
                break;
              case 1010:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1010"), 0);
                break;
              case 1011:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.1011"), 0);
                break;

            //*************************************************
            //**** CUSTOM ERRORS FROM COMMON BACKEND => 2xxx
            //*************************************************

              case 2000:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.2000"), 0);
                break;
              case 2001:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.2001"), 0);
                break;
              case 2002:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.2002"), 0);
                break;
              // case 2003:
              //   this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.2003"), 0);
              //   break;

            //*************************************************
            //**** CUSTOM ERRORS FROM SCANNER BACKEND => 3xxx
            //*************************************************

              case 3001:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.3001"), 0);
                break;
              case 3002:
                this._dataService.openSnackBar_Error(this.translate.instant("I18N.CUSTOM_ERROR.3002"), 0);
                break;
                
              default:
                this._dataService.openSnackBar_Error(errorResponse.errorMessage+" => No translation, yet ...", 0);
                break;
              }

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
