## Adopt Architectural Decision Records

## Status
Accepted: Decision approved and in effect. Please don't hesitate to challenge it.

## Context
We are creating projects from scratch and need a way to:
- Document significant architectural decisions
- Understand why and how decisions were made
- Provide context for future maintainers
- Track the evolution of our architecture over time
- Make decision-making transparent and reviewable

Without structured documentation, architectural knowledge remains in people's heads
or scattered across various communication channels. When someone asks "Why did we
choose X over Y?" or "Why is the code structured this way?", we often can't provide
a clear answer, leading to repeated debates and potential rework.

We need a lightweight way to capture the "why" behind our choices without creating heavyweight documentation overhead.

## Decision
We will use Architectural Decision Records (ADRs) to document architectural decisions,
patterns, conventions, and third-party library choices.

ADRs embody three key principles:
1. **Pragmatic** - Keep documentation lightweight and actionable
2. **Evolutionary** - Decisions can be challenged and superseded, never deleted
3. **Contextual** - Capture not just what, but why and what alternatives were considered

### ADR Structure
Each ADR will be stored in `/adrs` at the repository root and follow the naming
pattern `adr-XXX-descriptive-name.md` where XXX is a zero-padded number. 

Examples:
- `adr-001-use-typescript.md`
- `adr-015-state-management-choice.md`
- `adr-020-endpoint-naming-convention.md`

### Required sections
1. **Title**: Brief, descriptive name
2. **Status**: Current state of the decision
3. **Context**: What problem are we solving? 
4. **Decision**: What did we choose and why? Were there alternatives we considered and rejected?
5. **Consequences**: What are the positive and negative outcomes?
6. **Compliance**: How do we enforce this ADR?
7. **References**: Information used to create the ADR

### Status values
- **Draft (in review)**: Under consideration, open for discussion
- **Accepted**: Decision approved and in effect. Please don't hesitate to challenge it.
- **Superseded**: Replaced by a newer ADR (must link to the replacement)

**Important**: ADRs are never deleted, only superseded. This preserves historical context.

### When to create an ADR
Create an ADR when making decisions about:
- Architectural patterns or styles
- Technology or library choices
- Coding conventions or standards
- API design and contracts
- Data flow and state management
- Development workflow changes

**Rule of thumb**: If the decision will affect multiple developers or future
understanding of the codebase, write an ADR. When in doubt, write it - better to
have the context than to lose it.

## Consequences
**Positives:**
- Architectural decisions are documented and searchable
- New team members can understand past decisions
- Decisions can be reviewed and challenged transparently
- Knowledge is preserved even when team members leave
- Reduces repeated debates about settled decisions
- Creates accountability for architectural choices
- Enables us to learn from past decisions (both good and bad)

**Negatives:**
- Requires discipline to create and maintain ADRs
- Additional overhead when making decisions
- Whole team must buy-in and enforce the practice
- Risk of ADRs becoming stale if not maintained
- Lack of awareness if written in isolation without team discussion
- Risk of being seen as unchangeable rules rather than living documents
- May slow down initial decision-making (but speeds up future understanding)

## Compliance
- Enforcing is done via Code Review.
- ADRs must be reviewed as part of the PR process
- Team members are expected to read new ADRs and provide feedback during review
- Periodically review ADRs to ensure they're still relevant and accurate

## References
- [Joel Parker Henderson's ADR repository](https://github.com/joelparkerhenderson/architecture-decision-record)

