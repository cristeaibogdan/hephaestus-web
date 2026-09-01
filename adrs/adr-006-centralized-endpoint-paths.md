## Centralized Endpoint Paths

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
We have an Angular project that communicates with multiple API endpoints. 
The API base URL differs between environments.

Pain points:
- Tests retype the same endpoint path manually
- No single file to hold all API endpoint paths used by the frontend
- A single endpoint path change requires updating every class that references it

> Why keep `endpoints.ts` environment-agnostic?
>
> Consumers don't agree on a base value:
> 
> - **Playwright:** using `environment.apiBaseUrl` into `endpoints.ts` would make `"**"` unrepresentable — the file
    would always return the real host, so mocks would have to match against that host directly instead.
    That still wouldn't be reliable: Playwright doesn't consume Angular's environment replacement
    mechanism, so importing `environment.ts` from Playwright doesn't reliably represent the environment
    the Angular app is actually running in. The resulting host may therefore differ from the application's
    host, causing the mock to stop intercepting the request without an obvious configuration error.
> - **Angular services:** the service already has access to the appropriate environment-specific base URL,
    so it supplies that base when constructing the request URL.
>
> Revisit this if: no consumer besides Angular still needs a different base (e.g. Playwright mocking goes
> away). At that point, bake `apiBaseUrl` into `endpoints.ts` directly and return full URLs.

## Decision
All frontend consumers that reference an API endpoint use the centralized endpoint definitions. 
Consumers are responsible for combining the endpoint path with the appropriate base URL or URL pattern for their context.

1. Create `environment.ts` files in `/environments` - standard per-environment Angular config, unrelated to anything below:
```ts
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:8083"
};
```

2. Create `endpoints.ts` in `/environments` centralizing path-only templates per domain.
```ts
export const WASHING_MACHINE_ENDPOINTS = {
  create: () => `/v1/washing-machines/create`,
  getRecommendation: (serialNumber: string) => `/v1/washing-machines/${serialNumber}/recommendation`,
  getReport: (serialNumber: string) => `/v1/washing-machines/${serialNumber}/report`,
  search: () => `/v1/washing-machines/search`,
  load: (serialNumber: string) => `/v1/washing-machines/${serialNumber}`,
  loadMany: () => `/v1/washing-machines/many`,
  delete: (serialNumber: string) => `/v1/washing-machines/${serialNumber}`,
  validate: (serialNumber: string) => `/v1/washing-machines/${serialNumber}/validate`
}

export const SOLAR_PANEL_ENDPOINTS = {
  // more paths
}
```

3. Usage:
```ts
// For services who make api calls
import {environment} from 'src/environments/environment';

private readonly baseUrl = environment.apiBaseUrl;

search(searchWashingMachineRequest: SearchWashingMachineRequest): Observable<Page<SearchWashingMachineResponse>> {
  return this.http.post<Page<SearchWashingMachineResponse>>(
    this.baseUrl + WASHING_MACHINE_ENDPOINTS.search(),
    searchWashingMachineRequest
  );
}

// For async validators
validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
  return this.httpClient.get<boolean>(
    this.baseUrl + WASHING_MACHINE_ENDPOINTS.validate(control.value)
  ).pipe(
    map(response =>
      response
        ? {invalid: true}
        : null
    ),
    // more code
  );
}

// For playwright mocks
async getRecommendation(recommendation: Recommendation): Promise<void> {
  await this.page.route("**" + WASHING_MACHINE_ENDPOINTS.getRecommendation("*"), async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(recommendation),
    });
  });
}
```

## Consequences
**Positives:**
- Centralized place to view all API endpoint paths used by the frontend.
- Reduced duplication of endpoint paths
- A route change only needs to be updated in the centralized endpoint definition, reducing the risk 
  of drift across consumers (Angular, Playwright, and anything added later).
- Survives a consumer moving out of this repo unchanged — `endpoints.ts` never depended on `environment.ts` 
  to begin with, so it never assumed where or how a consumer resolves its base value.

**Negatives:**
- Consumers are responsible for supplying the appropriate base URL or URL pattern. An incorrect value cannot be 
  detected at compile time and may result in a request being sent to the wrong URL.
- Every endpoint path requires a name.

## Compliance
- Enforcing is done via Code Review.
