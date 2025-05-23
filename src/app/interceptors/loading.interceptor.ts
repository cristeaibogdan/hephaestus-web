import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize} from 'rxjs/operators';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';
import { MatDialog } from '@angular/material/dialog';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {

  if (request.context.has(SKIP_INTERCEPTOR)) {
    return next(request);
  }

  const dialog = inject(MatDialog);
  
  const loadingSpinner = dialog.open(SpinnerComponent, {
    disableClose: true,
    panelClass: "loading-dialog"
  });

  return next(request).pipe(
    finalize(() => {
      loadingSpinner.close();
    })
  );
}