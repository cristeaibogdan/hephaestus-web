## Playwright Test Structure and Naming Convention

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
We use Playwright for e2e and page tests.
The repository has no established structure or naming convention for tests.

Pain points:
- Inconsistent file naming
- Tests scattered across unrelated folders
- No clear rules for naming or placement
- Test cases covering behavior unrelated to the spec file

## Decision
Adopt a folder structure and naming convention that organises tests by domain, making them easy to locate, place, and maintain as the project grows.

## Folder Structure

**A. Top Layer** - `tests/`

| Path          | Purpose                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------|
| `e2e/`        | Holds user flows spanning multiple pages (e.g. `create-and-view-washing-machine.spec.ts`) |
| `<domain>/`   | Groups all page tests and page objects for a domain (e.g. `washing-machine/`)             |
| `assets/`     | Shared files used across tests                                                            |
| `base.ts`     | Declares Playwright fixtures and exports `customTest`                                     |

**B. Domain Layer** - `tests/<domain>/`

| Path                        | Purpose                                          |
| --------------------------- | -------------------------------------------------|
| `pages/<name>.page.pom.ts`  | Holds locators and interactions for a page (POM) |
| `<name>.page.spec.ts`       | Holds tests for a specific page                  |

**C. Assets Layer** - `tests/assets/`

| Path               | Purpose                                                    |
| ------------------ | -----------------------------------------------------------|
| `images/`          | Image files such as `.jpg`, `.jpeg`, `.bmp`                |
| `files/`           | Non-image files such as `.txt`, `.pdf`                     |
| `file.provider.ts` | Centralises file paths to avoid hardcoded strings in tests |

## Naming Convention

### Page Tests
**Use when** verifying UI behavior isolated to a single page (form validation, step navigation, error states).
All success and failure scenarios for a page belong in the same spec file.

| Element          | Rule                         | Example                               |
| ---------------- | -----------------------------| --------------------------------------|
| File             | `<name>.page.spec.ts`        | `washing-machine-create.page.spec.ts` |
| `describe`       | Feature area                 | `'Identification'`, `'File upload'`   |

For naming `customTest` combine using `when` as a separator: outcome + `when` + condition.

| Outcome (THEN)                     | Condition (WHEN)          | Test name                                                    |
| -----------------------------------| --------------------------| -------------------------------------------------------------|
| `navigates to next step`           | `valid input is provided` | `'navigates to next step when valid input is provided'`      |
| `cannot proceed to next step`      | `fields are empty`        | `'cannot proceed to next step when fields are empty'`        |
| `shows error`                      | `file exceeds size limit` | `'shows error when file exceeds size limit'`                 |
| `shows previously selected values` | `Overview is reached`     | `'shows previously selected values when Overview is reached'`|
| `shows success message`            | `form is submitted`       | `'shows success message when form is submitted'`             |

### E2E Tests
**Use when** verifying a user journey that spans multiple pages.
Each file covers one user journey and contains a single test named after the file.

File format: `<verb(s)>-<name>.spec.ts`

```ts
// create-and-view-washing-machine.spec.ts

customTest('create and view washing machine', ...);
```

## Example
```
tests/
├── e2e/
│   ├── create-and-view-washing-machine.spec.ts
│   ├── create-and-view-solar-panel.spec.ts
│   └── ...
│
├── washing-machine/
│   ├── pages/
│   │   ├── washing-machine-create.page.pom.ts
│   │   └── ...
│   ├── washing-machine-create.page.spec.ts
│   ├── washing-machine-history.page.spec.ts
│   └── ...
│
├── home/
│   ├── pages/
│   │   └── home.page.pom.ts
│   └── home.page.spec.ts
│
├── authorization/
│   ├── pages/
│   │   ├── login.page.pom.ts
│   │   └── register.page.pom.ts
│   ├── login.page.spec.ts
│   └── register.page.spec.ts
│
├── assets/
│   ├── images/
│   │   ├── trail.bmp
│   │   ├── mountains.jpeg
│   │   └── ...
│   ├── files/
│   │   ├── empty.txt
│   │   └── ...
│   └── file.provider.ts
│
└── base.ts
```

## Consequences
**Positives:**
- Developers can immediately locate or place tests without guessing
- Naming and placement follow predictable rules, reducing decision fatigue
- Domains can grow independently without affecting unrelated tests

**Negatives:**
- Consistency depends on code review discipline — there is no automated enforcement
- Spec files may grow large as all scenarios for a page are grouped together; `describe` blocks keep them navigable.

## Compliance
- Enforcement is performed during code review. 

## References
- https://software-testing-tutorials-automation.com/2026/04/playwright-project-structure-typescript.html
- https://courses.bigbinaryacademy.com/learn-qa-automation-using-playwright/folder-structure/ 
- https://www.reddit.com/r/Playwright/comments/1hhbu4o/how_do_you_structure_your_test_cases_in_a_folder/
- https://www.reddit.com/r/Playwright/comments/1qt6lql/how_do_you_structure_playwright_tests_when_your/
- https://www.reddit.com/r/Playwright/comments/1d45v1d/whats_your_repo_structure_look_like_for_a/
- https://www.yeou.dev/articles/updating-to-angular-20-real-world-guide
