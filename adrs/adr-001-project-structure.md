## Angular Project Structure

## Status
Pending Implementation

## Context
As new Angular projects are started, there is no agreed-upon folder structure to
follow. Each project risks evolving differently, making it harder to onboard,
navigate, and maintain codebases over time.

Pain points:
- No standard structure to reference when starting a new Angular project
- Unclear what belongs where — services, guards, and interceptors end up
  scattered without a clear home
- Inconsistent naming and grouping across features makes the codebase
  harder to navigate

## Decision
Adopt a layered folder structure as the standard for all new Angular projects.

**A. Features Layer** - `app/features/`
Organized by business domain. Each domain contains pages, and each page can have multiple components.
Domain-level folders are strictly for reuse across multiple pages.

> Start with a page-focused structure when no broader domain is evident.
> Introduce or rename to a domain folder once multiple related pages or shared business concepts emerge.

```
├── features/
│   └── <domain-1>/ (eg. `washing-machine`)
│       ├── <page-name-1>/ (eg. `create`)
│       │   ├── <component-1>/ (eg. `change-email`)
│       │   ├── <component-2>/ (eg. `upload-file`)
│       │   └── ...
│       ├── <page-name-2>/ (eg. `history`)
│       │   ├── <component-1>/ (eg. `view`)
│       │   ├── <component-2>/ (eg. `edit`)
│       │   └── ...
│       ├── components/
│       ├── models/
│       ├── services/
│       ├── stores/
│       └── ...
│   └── <domain-2>/
│       └── ...
```

**Extraction rules:**
1. Used by one page → keep inside the page
2. Used by multiple pages in same domain → move to domain-level folder
3. Used across domains → move to `shared/`

> App-wide services (auth, error handling, analytics) live in shared/services/. Feature-specific services live in their domain.

**B. Layout Layer** - `app/layout/`
Shell components rendered once at the app level.

```
├── layout/
│   ├── header/
│   └── footer/
```

**C. Shared Layer** - `app/shared/`
Stateless, reusable building blocks. No business logic.

```
└── shared/
    ├── components/ (reusable UI components)
    ├── directives/
    ├── models/
    ├── pipes/
    ├── services/
    ├── validators/
    ├── guards/
    ├── interceptors/
    └── ...
```

## Example
```
app/
├── features/
│   ├── authentication/
│   │   ├── login/
│   │   │   ├── login.page.ts
│   │   │   ├── login.page.html
│   │   │   ├── login.page.scss
│   │   │   └── login.page.spec.ts
│   │   └── register/
│   │       ├── register.page.ts
│   │       ├── register.page.html
│   │       ├── register.page.scss
│   │       └── register.page.spec.ts
│   │
│   ├── home/
│   │   ├── home.page.ts
│   │   ├── home.page.html
│   │   ├── home.page.scss
│   │   └── home.page.spec.ts
│   │
│   └── washing-machine/
│       ├── create/
│       │   ├── damage/
│       │   │   ├── damage.component.ts
│       │   │   ├── damage.component.html
│       │   │   ├── damage.component.scss
│       │   │   └── damage.component.spec.ts
│       │   ├── identification/
│       │   ├── overview/
│       │   ├── recommendation/
│       │   ├── create.page.ts
│       │   ├── create.page.html
│       │   ├── create.page.scss
│       │   └── create.page.spec.ts
│       │
│       └── history/
│           ├── view/
│           │   ├── view.modal.ts
│           │   ├── view.modal.html
│           │   ├── view.modal.scss
│           │   └── view.modal.spec.ts
│           │
│           ├── edit/
│           │   ├── edit.modal.ts
│           │   ├── edit.modal.html
│           │   ├── edit.modal.scss
│           │   └── edit.modal.spec.ts
│           │
│           ├── history.page.ts
│           ├── history.page.html
│           ├── history.page.scss
│           └── history.page.spec.ts
│
├── layout/
│   ├── header/
│   └── footer/
│
└── shared/
    ├── components/
    ├── directives/
    ├── models/
    ├── pipes/
    ├── services/
    ├── validators/
    ├── guards/
    ├── interceptors/
    └── ...
```

## Consequences

**Positives:**
- Clear rules eliminate ambiguity about where new files should go
- Faster onboarding — structure communicates intent without reading the code

**Negatives:**
- Deeper import paths compared to a flat structure (minor)
- Domain boundaries can be hard to define upfront — a page that starts in one domain may need to move as requirements evolve

## Compliance
Enforcement is performed during code review
