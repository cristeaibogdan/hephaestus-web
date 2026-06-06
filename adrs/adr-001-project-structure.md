## Angular Project Structure

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

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

### A. Features Layer - `app/features/`
Organized by business domain. Each domain contains pages, and each page can have multiple components.
Domain-level folders are strictly for reuse across multiple pages.

- **Single-page domain** — page files sit directly in the domain folder. No page subfolder is needed.

- **Multi-page domain** — each page gets its own subfolder. Page folders and files are prefixed with the domain name (e.g. washing-machine-create/)
  to avoid class name collisions in `app.routes.ts`, which imports pages from all domains simultaneously.
  Pages with inherently unique names (e.g. login, register) are exempt from prefixing.

> Only page folders and their files are prefixed with the domain name. All other domain-level files rely on their folder path for context.

```
├── features/
    ├── <single-page-domain>/ (e.g. `home`)
    │   ├── home.page.ts
    │   └── ...
    │
    └── <multi-page-domain>/ (e.g. `washing-machine`)
        ├── <domain-page-name>/ (e.g. `washing-machine-create`)
        │   ├── <component-1>/ (e.g. `damage`)
        │   └── ...
        │
        ├── <domain-page-name>/ (e.g. `washing-machine-history`)
        │   ├── <component-1>/ (e.g. `view`)
        │   └── ...
        │
        │ # Exactly 1 file of a given type → keep flat
        ├── domain.enum.ts
        ├── domain.model.ts
        │
        │ # 2+ files of a given type → create subfolder       
        ├── models/
        ├── services/
```

The following extraction rules determine where files within a domain should be placed:
1. Used by one page → keep inside the page
   (For single-page domains, the domain folder itself serves as the page folder)
2. Used by multiple pages in same domain → move to domain-level folder
3. Used across domains → move to `shared/`
   Note: Some services belong in shared/services/ by nature (auth, error handling, analytics), even if currently used by only one domain.

### B. Layout Layer - `app/layout/`
Structural shell components that wrap the routed content and are rendered once at the app level. 
Contains no business logic.

```
├── layout/
│   ├── header/
│   └── footer/
```

### C. Shared Layer - `app/shared/`
Reusable code with no single domain owner.

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
│   ├── authentication/ # multi-page domain — login/register are exempt (unique names)
│   │   ├── login/
│   │   │   ├── login.page.ts
│   │   │   └── login.page.html
│   │   │
│   │   └── register/
│   │       ├── register.page.ts
│   │       └── register.page.html
│   │
│   ├── home/ # single-page domain
│   │   ├── home.page.ts
│   │   └── home.page.html
│   │
│   └── washing-machine/
│       ├── washing-machine-create/    # page — prefixed (collision rule)
│       │   ├── damage/
│       │   │   ├── damage.component.ts
│       │   │   └── damage.component.html
│       │   ├── identification/
│       │   ├── overview/
│       │   ├── recommendation/
│       │   ├── washing-machine-create.page.ts
│       │   ├── washing-machine-create.page.html
│       │   └── ...
│       │
│       ├── washing-machine-history/    # page — prefixed (collision rule)
│       │   ├── view/
│       │   │   ├── view.modal.ts
│       │   │   └── view.modal.html
│       │   │
│       │   ├── edit/
│       │   │   ├── edit.modal.ts
│       │   │   └── edit.modal.html
│       │   │
│       │   ├── washing-machine-history.page.ts
│       │   ├── washing-machine-history.page.html
│       │   └── ...
│       │
│       ├── washing-machine.api.ts     # flat — exactly 1 service
│       ├── recommendation.enum.ts     # flat — exactly 1 enum
│       ├── models/                    # 2+ models → subfolder created
│       │     ├── damage.model.ts
│       │     └── repair.model.ts
│       └── ...
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

## References
- https://angular.dev/style-guide#organize-your-project-by-feature-areas
