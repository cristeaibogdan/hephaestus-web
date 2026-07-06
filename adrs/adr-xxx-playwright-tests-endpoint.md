## Playwright Endpoint Tests

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
We needed a strategy for Playwright tests in an Angular application.

Pain points:
- No way to test flows that interact with endpoints.

## Decision
Two approaches were considered.

### Option 1: Mock API responses
Run Playwright against the mocked endpoints.

#### Postives
- Fast and deterministic tests.
- Easy to simulate edge cases (errors, empty results, loading states).
- No dependency on backend or database state.

#### Negatives
- Does not verify frontend-backend integration.
- Mocked responses can drift from the real API.
- Requires maintaining mock data.

#### Example Implementation
> Endpoint mocking can be done in a more centralized way, but for this ADR it is out of scope.

1. Identify endpoint
```typescript
search(searchWashingMachineRequest: SearchWashingMachineRequest): Observable<Page<SearchWashingMachineResponse>> {
  const url = this.apiURL.concat("/v1/washing-machines/search");
  const payload = searchWashingMachineRequest;
  return this.http.post<Page<SearchWashingMachineResponse>>(url, payload);
}
```

2. Create method to mock endpoint
```typescript
async function mockSearchResponse(
  page: Page,
  washingMachines: SearchWashingMachineResponse[]
) {
  await page.route("**/v1/washing-machines/search", async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        content: washingMachines,
        totalElements: washingMachines.length,
        totalPages: 1,
        number: 0,
        size: washingMachines.length
      })
    });
  });
}
```

3. Create method to create responses:
```typescript
function createSearchWashingMachineResponse(overrides: Partial<SearchWashingMachineResponse> = {}): SearchWashingMachineResponse {
  return {
    category: "Washing Machine",
    identificationMode: IdentificationMode.DATA_MATRIX,
    manufacturer: "Bosch",
    model: "Series 4",
    type: "Front Loader",
    serialNumber: "123456",
    returnType: ReturnType.COMMERCIAL,
    damageType: DamageType.IN_USE,
    recommendation: Recommendation.RESALE,
    createdAt: new Date(),

    ...overrides
  };
}
```

4. Mock the endpoint inside a test
```typescript
customTest('should find washing machine when filtering by serialNumber', async ({ page, washingMachineHistoryPom }) => {
  await mockSearchResponse(page, [
    createSearchWashingMachineResponse({serialNumber: "fasda"})
  ]);

  await washingMachineHistoryPom.goto(); // Can be extracted in a beforeEach

  await washingMachineHistoryPom.filterBySerialNumber('fasda');

  const row = washingMachineHistoryPom.findRowBySerialNumber('fasda');
  await expect(row.serialNumber()).toHaveText("fasda");
});
```
### Option 2: Real endpoints
Run Playwright against the real backend and use endpoints for seeding and deleting test data.

Each stateful Playwright test:

- Creates its own test data via a test endpoint.
- Serial numbers used in tests must be **unique** and prefixed with `test-`
- Executes the UI interactions.
- Verifies the expected behavior.
- Cleans up the created data in a `finally` block.

#### Example Implementation
1. Create class that will call the endpoints and handle the cleanup:
```typescript
export class WashingMachineApi {
  private readonly apiURL = environment.apiBaseUrl;
  private createdSerialNumbers: string[] = [];

  constructor(private readonly request: APIRequestContext) {}

  async create(request: CreateWashingMachineRequest): Promise<void> {
    const formData = new FormData();
    formData.append("createWashingMachineRequest", new Blob([JSON.stringify(request)]));
    formData.append("imageFiles", new File([fs.readFileSync(TEST_FILES.images.jpg.landscape)], "landscape.jpg"));

    const response = await this.request.post(
      this.apiURL.concat("/v1/washing-machines/create"),
      { multipart: formData }
    );

    if (!response.ok()) {
      throw new Error(`Failed to create ${request.serialNumber}: ${response.status()} ${await response.text()}`);
    }

    this.createdSerialNumbers.push(request.serialNumber);
  }

  async delete(serialNumber: string): Promise<void> {
    const response = await this.request.delete(
      this.apiURL.concat(`/v1/washing-machines/${serialNumber}`)
    );

    if (!response.ok() && response.status() !== 404) {
      throw new Error(`Failed to delete washing machine ${serialNumber}.`);
    }
  }

  async cleanup(): Promise<void> {
    const serials = [...this.createdSerialNumbers];
    this.createdSerialNumbers = [];

    const errors: string[] = [];
    for (const serialNumber of serials) {
      try {
        await this.delete(serialNumber);
      } catch (err) {
        errors.push(`${serialNumber}: ${err}`);
      }
    }

    if (errors.length) {
      throw new Error(`Cleanup failed for ${errors.length}: ${errors.join("; ")}`);
    }
  }
}
```

2. Register it as a fixture in `base.ts`:
```typescript
washingMachineApi: async ({request}, use) => {
  const api = new WashingMachineApi(request);
  try {
    await use(api);
  } finally {
    await api.cleanup();
  }
}
```

3. Use in test:
```typescript
customTest('should find washing machine when filtering by serialNumber', async ({ washingMachineHistoryPom, washingMachineApi }) => {
  await washingMachineApi.create(
    createWashingMachine({serialNumber: "test-123"})
  )

  await washingMachineHistoryPom.goto(); // Can be extracted in a beforeEach

  await washingMachineHistoryPom.filterBySerialNumber('test-123');

  const row = washingMachineHistoryPom.findRowBySerialNumber('test-123');
  await expect(row.serialNumber()).toHaveText("test-123");
});
```

#### Rationale
- Exercises the complete frontend-backend integration.
- Avoids maintaining mocked API responses.
- Simple solution that requires minimal testing infrastructure.

#### Positives
- True end-to-end testing.
- Real backend and database.
- Explicit, isolated test data.
- Self-contained tests with no hidden setup or teardown.
- Easy to understand and maintain.

#### Negatives
- Slower than mocked UI tests.
- Requires delete / create endpoints (which may not exist).
- Cleanup can leave entities in the DB and cause tests to fail.
- Complex to implement and hard to maintain


## Questions & Answers
- Q: What happens if the `create` endpoint fails?
  A: It throws before pushing to `createdSerialNumbers`, so a failed serialNumber is never tracked for cleanup.
- Q: What happens if the `delete` endpoint fails?
  A: `delete()` throws for anything but `ok()/404`.
  - If it fails inside `cleanup()`: caught by the try/catch, added to the aggregated error.
  - If a test calls `delete()` directly: normal test failure. The serialNumber stays in
    `createdSerialNumbers` (only `cleanup()` clears it), so the fixture's `finally` retries
    the delete at teardown.
- Q: What happens if the test throws an exception?
  A: Fixture's `try-finally` runs `cleanup()` regardless.
- Q: What happens if the cleanup throws an exception?
  A: Every delete is attempted (for-loop + try/catch), failures are collected and thrown as one aggregated error at the end.
- Q: What happens if the user interrupts the test before completion (Ctrl+C, stop button)?\
  A: Depends on interrupt type. 
  - A graceful stop (SIGINT/SIGTERM) — Playwright generally still runs fixture teardown for the in-flight test, so cleanup() fires. 
  - A hard kill (process crash, kill -9, closing the terminal) skips teardown entirely — created data is orphaned with no retry.
    TODO: Create an endpoint in the backend called deleteAllTestSerialNumbers
