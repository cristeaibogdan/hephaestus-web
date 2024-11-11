import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {

  const dialog = inject(MatDialog);

  if (request.context.has(SKIP_INTERCEPTOR)) {
    return next(request);
  }
  
  const loadingSpinner = dialog.open(SpinnerComponent, {
    disableClose: true,
    panelClass: "borderless-dialog"
  });

  return next(request).pipe(
    finalize(() => {
      loadingSpinner.close();
    })
  );
}