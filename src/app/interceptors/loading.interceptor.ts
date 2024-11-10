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
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.context.has(SKIP_INTERCEPTOR)) {
      return next.handle(request);
    }
   
    const loadingSpinner = this.dialog.open(SpinnerComponent, {
      disableClose: true,
      panelClass: "borderless-dialog"
    });

    return next.handle(request).pipe(      
      finalize(() => {
        loadingSpinner.close();
      })
    );    
  }
}
