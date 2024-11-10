import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Ignore async validators
    if (request.headers.has('AsyncValidator')) {
      return next.handle(request);
    }
   
    const dialogSpinner = this.dialog.open(SpinnerComponent, {
      disableClose: true,
      panelClass: "borderless-dialog"
    });

    return next.handle(request).pipe(
      
      finalize(() => {
        dialogSpinner.close();
      })
    );
    
  }
}
