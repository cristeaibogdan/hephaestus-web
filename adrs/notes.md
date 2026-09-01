# Rumblings

## Playwright Selector Strategy

Based on the element, use the preferred selector:

| Element                           | Preferred selector                     |
| --------------------------------- | -------------------------------------- |
| Button                            | `getByRole('button', { name: '...' })` |
| Input                             | `getByLabel('...')`                    |
| Static Text / inline validation   | `getByText('...')`                     |
| Radio / checkbox                  | `getByRole('radio', { name: '...' })`  |
| Select option                     | `getByRole('option', { name: '...' })` |
| Link                              | `getByRole('link', { name: '...' })`   |
| Image                             | `getByRole('img', { name: '...' })`    |
| Dialog / modal                    | `getByRole('dialog', { name: '...' })` |
| Toast / banner error              | `getByRole('alert')`                   |
| Tab                               | `getByRole('tab', { name: '...' })`    |
| Toggle / switch                   | `getByRole('switch', { name: '...' })` |
| Textarea                          | `getByLabel('...')`                    |
| Complex component (upload, cards) | `getByTestId('...')`                   |
| No stable semantic selector       | `getByTestId('...')`                   |

Note: For complex components, you might allocate a role for it, like button / link and avoid data-testid.

## Inputs (select)

type-input

### Input options

The first approach is to slugify the display value and use it as the `data-testid` suffix via a `SlugifyPipe`:

```typescript
@Pipe({ name: "slugify", standalone: true })
export class SlugifyPipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/\s+/g, "-");
  }
}
```

```html
<mat-option [value]="manufacturer" [attr.data-testid]="'manufacturer-input-option-' + (manufacturer | slugify)"> {{manufacturer}} </mat-option>
```

But this is fragile — if the backend values change or the options are translated, the `data-testid` breaks.
Therefore, the next solution is to use a stable `identifier` from the backend:

```typescript
interface Manufacturer {
  identifier: string; // 'bosch' — stable, backend-controlled, used for data-testid
  label: string; // 'I18N.MANUFACTURER.BOSCH' — translation key, resolved on frontend
}
```

```sql
CREATE TABLE manufacturer (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  identifier VARCHAR(50) UNIQUE NOT NULL,   -- 'bosch', used for data-testid and form value
  label      VARCHAR(100) NOT NULL          -- 'I18N.MANUFACTURER.BOSCH', resolved on the frontend
);
```

```html
<mat-option [value]="manufacturer.identifier" [attr.data-testid]="'manufacturer-input-option-' + manufacturer.identifier">
  {{ manufacturer.label | transloco }}
</mat-option>
```

But this requires changes across the frontend, backend and DB.
It is the preferred solution if the system already supports it.
Therefore the most pragmatic choice for our system is to skip `data-testid` on options entirely and use:

```typescript
await page.getByRole("option", { name: "Bosch" }).click();
```

All tests run on the English version, so translation fragility is not a concern in practice.
However, tests will break if backend values change which for our backend is fine.


# Page encapsulation
Pages should be encapsulated and expose only behaviour outside.
- Create methods that encapsulate how you get locators
- Avoid putting expect inside methods (exception is async validator)
- Perfectly fine to have methods that fill in the first step to help you test the second step

# Others
- Multiple assertions per test is fine when a single action produces multiple observable outcomes
- Use semantic selectors first (`getByRole()`, `getByLabel()`, `getByText()`, `getByPlaceholder()`, etc.).
  Add data-testid only when semantic selectors are unstable or not possible.
- Okay to use a method inside tha pagemodel to skip to step 2.
- To see the report for tests run:
  `npx playwright test --reporter=html`
  `npx playwright show-report`
- To see if they run in parallel, you'll just have to trust the config (bummer)
- For rows, it makes sense to get the whole data from the row using a custom object - ...Row

# TODOs
1. Finish ADR 004 usage of locators
2. Properties or methods for POMs and how to decide?
3. Add translation ADR - https://www.locize.com/blog/guide-to-i18n-key-naming
4. Review all ADRs and look for opportunities to merge. I feel like ADR are not completelty standalone.
5. Start with a prepopulated memory in a DB for playwright tests.
