## Playwright Locators Usage

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
Our Playwright test suite uses a Page Object Model (POM) structure. 
Without a shared standard, inconsistent locator strategies lead to
flaky tests, unnecessary coupling to DOM structure, and maintenance overhead when UI changes.

Pain points:
- Tests break when CSS classes or DOM structure change, despite behavior remaining the same
- Inconsistent use of `locator()` with raw CSS vs semantic locators
- No clear guidance on when to add `data-testid` attributes vs use semantic locators
- Ambiguous locators resolved with `.first()` or `.nth()` without justification

## Decision
Use the following **priority order** when selecting locators. Start from the top and move
down only when higher-priority options are not viable:

1. **`getByRole()`** — default choice for elements with ARIA roles (buttons, links, checkboxes, headings). Mirrors accessibility semantics; resilient to markup refactors.
```ts
page.getByRole('button', { name: 'Submit' })
page.getByRole('checkbox', { name: 'Accept terms' })
```

> Use `npx playwright codegen` or the browser Accessibility panel to inspect 
the ARIA role of any element, including UI library components.

2. **`getByLabel()`** — for form fields associated with a visible label.
```ts
page.getByLabel('Email address')
page.getByLabel('Password')
```

3. **`getByText()`** — for asserting presence of visible content, or locating non-interactive
   elements by their text. Use `exact: true` when the text is short or generic enough to match unintended elements.
```ts
page.getByText('Successfully submitted', { exact: true })
page.getByText('No results found', { exact: true })
page.getByText('Draft', { exact: true })
```

4. **`getByTestId()`** — when no semantic locator uniquely identifies the element. Requires
   adding a `data-testid` attribute to the HTML. `data-testid` values follow the `kebab-case` naming convention.
```ts
// Custom component with no semantic role
page.getByTestId('loading-spinner')

// Scoping into one of many identical list items
page.getByTestId('user-card-123').getByRole('button', { name: 'Delete' })
```

> For Angular Material filter rows, consider `aria-label` before `data-testid` — both require
  a template change, but `aria-label` also enables `getByRole()` / `getByLabel()` and improves
  screen reader accessibility.

5. **`getByPlaceholder()` / `getByTitle()` / `getByAltText()`** — narrow fallbacks for inputs
   without labels, titled elements, and images respectively.

```ts
page.getByPlaceholder('Search...')
page.getByAltText('Company logo')
```

6. **`locator()` with CSS** — last resort, and only when scoped to a parent container. Never
   use bare class selectors (`.btn-primary`) or positional DOM paths (`div > ul > li:nth-child(3)`).
```ts
// Acceptable when scoped
page.getByTestId('cycle-panel').locator('mat-slider')
```

**Rules**

- **Locators are defined in POM classes**, not inline in spec files
- **Chain and scope** locators to a parent container when multiple matches exist, rather than
  using positional indexing.

```ts
// ✅ Scope to parent container
page.getByTestId('spin-panel').getByRole('button', { name: 'Start' })

// ❌ Avoid positional indexing
page.getByRole('button', { name: 'Start' }).nth(0)
```

- **Never use `.first()` or `.nth()` without a comment** explaining why the locator is
  legitimately ambiguous and no better option exists.

```ts
// Notification list renders identical dismiss buttons with no distinguishing attributes
page.getByRole('button', { name: 'Dismiss' }).first() // first unread notification
```

## Consequences

**Positives:**
- Tests are resilient to styling and DOM structure changes
- Locators reflect user intent, doubling as accessibility coverage signals
- Consistent POM authoring makes code review easier and faster
- Reduced flakiness from ambiguous or positional locators

**Negatives:**
- Requires dev involvement to add `data-testid` attributes when semantic locators are insufficient
- Teams unfamiliar with ARIA roles have a learning curve around `getByRole()`
- Angular Material filter rows (`mat-table` filter header) lack labels and placeholders by default,
  making semantic locators unavailable without additional template changes.

## Compliance
Enforcement is performed during code review. Reviewers should flag:
- Any use of raw CSS in `locator()` without scoping or justification
- `.nth()` / `.first()` without an explanatory comment
- Locators defined inline in spec files instead of POM classes

## References
- https://playwright.dev/docs/locators
- https://playwright.dev/docs/best-practices
- https://www.reddit.com/r/Playwright/comments/1m91faa/locator_or_getbyrole/
- https://www.reddit.com/r/Playwright/comments/1d05cuk/where_do_you_keep_locators/
- https://www.reddit.com/r/QualityAssurance/comments/1248csz/playwright_framework_best_practicesstructure/
