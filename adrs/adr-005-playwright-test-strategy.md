## Playwright Test Strategy

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
Playwright tests had no defined strategy for when to mock backend interactions versus when to execute against a real backend.

## Decision
Two testing strategies are supported. Individual tests choose the strategy that best matches their purpose.

- **Litmus test:** if mocking the response would let the test pass regardless of backend correctness, it belongs in `pageTest`.
If a flow is already fully exercised end-to-end by an `e2eTest`, don't duplicate the same sequence in `pageTest` beyond what's needed for UI-state coverage.

### Strategy 1: Mock endpoints
Use for verifying UI behavior: loading states, empty states, error messages, filtering/sorting, table rendering, validation feedback, etc.
Default for `pageTest`.

#### Positives
- Fast and deterministic tests - No dependency on backend or database state.
- Easy to simulate edge cases (errors, empty results, loading states).

#### Negatives
- Does not verify frontend-backend integration.
- Mocked responses can drift from the real API.
- Requires knowing and maintaining the right mocks per test.

#### Example Implementation
1. Create class to expose mock methods
```typescript
export class WashingMachineApiMock {
  constructor(private readonly page: Page) {}

  async search(washingMachines: SearchWashingMachineResponse[]): Promise<void> {
    await this.page.route("**/v1/washing-machines/search", async route => {
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

  async searchError(status: number, message: string): Promise<void> {
    await this.page.route("**/v1/washing-machines/search", async route => {
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(message)
      });
    });
  }
}
```

2. Create class to serve responses
```typescript
export class TestData {
  static createSearchWashingMachineResponse(overrides: Partial<SearchWashingMachineResponse> = {}): SearchWashingMachineResponse {
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
      createdAt: new Date("2000-01-01T00:00:00Z"),

      ...overrides
    };
  }
}
```
3. Mock the endpoint inside tests
```typescript
pageTest('should find washing machine when filtering by serialNumber', async ({ washingMachineHistoryPom, washingMachineApiMock }) => {
  await washingMachineApiMock.search([
    TestData.createSearchWashingMachineResponse({
      manufacturer: 'Gorenje',
      model: 'WA946',
      type: 'N/A',
      serialNumber: 'sda'
    })
  ]);

  await washingMachineHistoryPom.goto();
  
  const row = washingMachineHistoryPom.findRowBySerialNumber('sda');
  await expect(row.manufacturer()).toHaveText('Gorenje');
  await expect(row.model()).toHaveText('WA946');
  await expect(row.type()).toHaveText('N/A');
});

pageTest('should display backend message when something goes wrong', async ({ washingMachineHistoryPom, washingMachineApiMock }) => {
  await washingMachineApiMock.searchError(500, "Custom Error From The Backend");

  await washingMachineHistoryPom.goto();

  await expect(washingMachineHistoryPom.getCustomMessage("Custom Error From The Backend")).toBeVisible();
});
```

### Strategy 2: Real endpoints
Use to verify real backend behavior that mocking cannot validate — either a single operation
(e.g. does the real search endpoint filter/sort correctly against actual data) or a flow of
sequential steps where the integration between them matters (e.g. create → search, or
search → delete → reconfirm).

- **Rule of thumb:** expect a handful of `e2eTest` flows per feature (e.g. full creation flow, search-and-delete flow), with `pageTest` covering the bulk of individual UI states and error handling.

#### Positives
- True end-to-end testing against a real backend and database.

#### Negatives
- Slower than mocked UI tests.
- Requires a reliable mechanism for creating and cleaning up test data.
- Cleanup can leave entities in the DB and cause tests to fail.
- Complex to implement and hard to maintain.

#### Example Implementation
1. Create TestData to generate serialNumbers for tests:
```typescript
import crypto from "node:crypto";

export class TestData {
  static generateSerialNumber(): string {
    return `test-${crypto.randomUUID().slice(0, 8)}`;
  }
  // other methods to generate request / response objects.
}
```

2. Create class that will call the endpoints and handle the cleanup:
```typescript
export class WashingMachineApi {
  private readonly apiURL = environment.apiBaseUrl;
  private createdSerialNumbers: string[] = [];

  constructor(private readonly request: APIRequestContext) {}

  /**
   * Reserves a valid test serial for cleanup immediately.
   * The single entry point for obtaining a serial, whether it's later used
   * with create() or with manual/UI creation — delete() tolerates 404, so
   * marking before the entity exists is always safe.
   */
  reserveSerialNumber(): string {
    const serialNumber = TestData.generateSerialNumber();
    this.createdSerialNumbers.push(serialNumber);
    return serialNumber;
  }
  
  async create(request: CreateWashingMachineRequest): Promise<void> {
    this.validateSerialNumber(request.serialNumber);

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
  }

  private validateSerialNumber(serialNumber: string): void {
    if (!/^test-[0-9a-f]{8}$/.test(serialNumber)) {
      throw new Error(`serialNumber must match "test-<8 hex chars>", received: "${serialNumber}"`);
    }
  }

  async delete(serialNumber: string): Promise<void> {
    const response = await this.request.delete(
      this.apiURL.concat(`/v1/washing-machines/${serialNumber}`)
    );

    // 404 tolerated: entity may already be gone if the test itself deleted it via the UI.
    if (!response.ok() && response.status() !== 404) {
      throw new Error(`Failed to delete washing machine ${serialNumber}.`);
    }
  }

  // Every delete is attempted regardless of earlier failures; failures are
  // collected and thrown as one aggregated error at the end.
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
3. Once registered as a fixture (see "Modifications to base.ts" below), use it in tests where creation is done via the `washingMachineApi`:
```typescript
e2eTest('should find washing machine when filtering by serialNumber', async ({washingMachineHistoryPom, washingMachineApi}) => {
  const serialNumber: string = washingMachineApi.reserveSerialNumber();
  await washingMachineApi.create(
    TestData.createCreateWashingMachineRequest({serialNumber: serialNumber})
  ) // No manual deletion is needed as this is handled automatically

  await washingMachineHistoryPom.goto();
  
  await washingMachineHistoryPom.filterBySerialNumber(serialNumber);
  const row = washingMachineHistoryPom.findRowBySerialNumber(serialNumber);
  
  await expect(row.serialNumber()).toHaveText(serialNumber);
});
```

4. Use in tests where the creation of a washingMachine is done via UI (manual):
```typescript
e2eTest('create and view washing machine', async ({ washingMachineCreatePom, washingMachineHistoryPom, washingMachineApi }) => {
  await washingMachineCreatePom.goto();
  const serialNumber = washingMachineApi.reserveSerialNumber();

  // Manual creation via UI — serialNumber must be passed in here,
  // e.g. identificationStep.fillSerialNumber(serialNumber)
  
  await washingMachineHistoryPom.goto();
  const row = washingMachineHistoryPom.findRowBySerialNumber(serialNumber);
  
  await expect(row.manufacturer()).toHaveText('Bosch');
  await expect(row.model()).toHaveText('WGB256A1GB');
  await expect(row.type()).toHaveText('BOS001');
  await expect(row.serialNumber()).toHaveText(serialNumber);
});
```

#### Known Limitations
- **Serial number collisions.** Each test must call `washingMachineApi.reserveSerialNumber()`
  rather than hardcode a value. This is convention, not enforced — `validateSerialNumber()`
  only checks the `test-<8 hex chars>` format, not whether a serial was already used.
  Skipping the generator (e.g. reusing `"test-a3f9c21b"` across two tests) risks a collision
  between tests or parallel workers.

- **No recovery from a hard process kill.** `cleanup()` only runs via the fixture's
  `finally`, which requires the process to still be alive. A crash, `kill -9`, or closed
  terminal skips it — orphaned data, no retry.
  Proposed fix (not built): a `deleteAllTestSerialNumbers` backend endpoint, called from
  `global-setup.ts` at the **start** of the next run (not the end — an end-of-suite hook
  has the same hard-kill exposure it's meant to protect against). Shelved until this is a
  recurring problem, not a hypothetical one.

### Modifications to base.ts
In order to accommodate both types of tests, `base.ts` is modified:

```typescript
interface PomFixtures {
  homePom: HomePom,
  washingMachineCreatePom: WashingMachineCreatePom,
  washingMachineHistoryPom: WashingMachineHistoryPom
}

interface PageTestFixtures extends PomFixtures {
  washingMachineApiMock: WashingMachineApiMock
}

interface E2ETestFixtures extends PomFixtures {
  washingMachineApi: WashingMachineApi
}

const sharedTest = base.extend<PomFixtures>({
  page: async ({ page }, use) => {
    await page.addLocatorHandler(
      // shared logic used by all tests
    );
    await use(page);
  },
  
  homePom: async({ page }, use) => {
    await use(new HomePom(page))
  },

  washingMachineCreatePom: async({ page }, use) => {
    await use(new WashingMachineCreatePom(page))
  },

  washingMachineHistoryPom: async({ page }, use) => {
    await use(new WashingMachineHistoryPom(page))
  },
});

export const e2eTest = sharedTest.extend<E2ETestFixtures>({
  washingMachineApi: async ({ request }, use) => {
    const api = new WashingMachineApi(request);
    try {
      await use(api);
    } finally {
      await api.cleanup();
    }
  },
})

export const pageTest = sharedTest.extend<PageTestFixtures>({
  washingMachineApiMock: async ({ page }, use) => {
    await use(new WashingMachineApiMock(page));
  }
})
```
