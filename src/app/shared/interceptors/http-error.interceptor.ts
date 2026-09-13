import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {NotificationService} from "../services/notification.service";
import {TranslocoService} from "@jsverse/transloco";
import {catchError} from "rxjs/operators";
import {throwError, TimeoutError} from "rxjs";
import {SKIP_INTERCEPTOR} from "../validators/async-validators/skip-interceptor.token";

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

const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);
  const translocoService = inject(TranslocoService);

  if (request.context.has(SKIP_INTERCEPTOR)) {
    return next(request);
  }

  return next(request).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse) {
        const problemDetail = parseProblemDetail(error);

        if (problemDetail) {
          const message = problemDetail.errors?.length
            ? problemDetail.errors.map(e => e.detail).join('\n') // VALIDATION ERRORS FROM BACKEND
            : problemDetail.detail; // SINGLE DETAIL MESSAGE FROM BACKEND

          notificationService.showError(
            message || translocoService.translate('I18N.GENERAL_ERROR.DEFAULT'), // FALLBACK FOR OBJECT WITH NO ERRORS NOR DETAIL POPULATED
            0
          );
        } else {
          switch (error.status) {
            case 0:
              notificationService.showError(translocoService.translate('I18N.GENERAL_ERROR.0'));
              break;

            case 404:
              notificationService.showError(translocoService.translate('I18N.GENERAL_ERROR.404'));
              break;

            default:
              notificationService.showError(translocoService.translate('I18N.GENERAL_ERROR.DEFAULT'));
              break;
          }
        }
      }

      if (error instanceof TimeoutError) {
        notificationService.showError(translocoService.translate("I18N.CUSTOM_ERROR.TIMEOUT"));
      }

      return throwError(() => error);
    })
  );
}
export default httpErrorInterceptor

function parseProblemDetail(error: HttpErrorResponse): ProblemDetail | null {
  const isProblemDetail = error.headers.get('Content-Type')?.includes('application/problem+json') ?? false;
  return isProblemDetail
    ? (error.error as ProblemDetail)
    : null;
}
