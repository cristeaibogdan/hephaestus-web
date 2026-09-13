## Global HTTP Error Interceptor

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
The Angular frontend consumes a Spring Boot backend that returns RFC 7807 `ProblemDetail`
responses for all handled exceptions (see the backend's global exception handling ADR).

Pain points:
- No centralized way to show HTTP failures to the user — a failed call is either silent or handled ad hoc per component.
- `ProblemDetail` parsing and message selection would otherwise be duplicated across components.
- HTTP error notification should not depend on every component remembering to handle or rethrow an error.

## Decision
Centralize global HTTP error notification in a single Angular `HttpInterceptor`.
The interceptor displays the notification and rethrows the original error so callers can still perform local error handling or recovery.

> All request failures get user feedback by default. Background requests can opt out. 
> The original error is rethrown so feature code can react when necessary.

1. Create interceptor `http-error.interceptor.ts`:
```ts
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

  // Skip global error notification for requests that handle errors themselves.
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

function parseProblemDetail(error: HttpErrorResponse): ProblemDetail | null {
  const isProblemDetail = error.headers.get('Content-Type')?.includes('application/problem+json') ?? false;
  return isProblemDetail
    ? (error.error as ProblemDetail)
    : null;
}
```

2. Register in `app.config.ts`:
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        httpErrorInterceptor
      ])
    ),
  ]
};
```

## Consequences
**Positives:**
- Centralized place to define and update HTTP error notification messages.
- No duplicated `ProblemDetail` parsing in components.
- Frontend and backend HTTP error handling have corresponding centralized mechanisms (`@RestControllerAdvice ↔ HttpInterceptor`).

**Negatives:**
- All `HttpErrorResponse`s and `TimeoutError`s produce a global notification unless the request explicitly opts out with `SKIP_INTERCEPTOR`.
- `ProblemDetail` is trusted based on its `Content-Type`; the response body is not runtime-validated against the TypeScript interface.
