# 📋 GitHub Projects & Issues — Agent Guide

> **Scope**: kanban-demo  
> **Repo**: [github.com/aaronjorgreen/kanban-demo](https://github.com/aaronjorgreen/kanban-demo)  
> **Project Board**: [GitHub Project #6 — kanban-demo](https://github.com/users/aaronjorgreen/projects/6)  
> **Status**: **MANDATORY** — the agent must follow this guide at all times during the build.

---

## 1. Purpose

This document defines the **mandatory workflow** the agent must follow to create, manage, label, and close GitHub Issues — and to keep the GitHub Project roadmap view synchronized — as each phase of the application is built. Every unit of work must be tracked as an issue. No code change should land without a corresponding issue.

---

## 2. Issue Lifecycle

Every issue follows this lifecycle, and the agent must update the issue and project board at each transition:

```
Created → Backlog → To Do → In Progress → Done (Closed)
```

| Stage | Project Column | Issue State | When |
|---|---|---|---|
| **Created** | Backlog | `open` | Issue is written and added to the project board |
| **Planned** | To Do | `open` | Issue is prioritized for the current or next phase |
| **Active** | In Progress | `open` | Agent begins working on the issue |
| **Complete** | Done | `closed` | Work is finished, verified, and committed |

### Mandatory Actions at Each Transition

1. **On creation** → Create the issue with title, body, labels, and assignee. Add the issue to Project #6. Set the status to `Backlog` or `To Do`.
2. **On starting work** → Move the issue to `In Progress` on the project board. Add a comment: `🚧 Work started on this issue.`
3. **On completion** → Close the issue with `state_reason: completed`. Move it to `Done` on the project board. Add a closing comment summarizing what was done.
4. **On abandonment** → If an issue is no longer relevant, close it with `state_reason: not_planned`. Add a comment explaining why.

---

## 3. Issue Creation Standards

### 3.1 Title Format

Use a consistent, scannable title format:

```
[Phase X] Brief imperative description
```

**Examples:**
- `[Phase 1] Initialize Vite + React project`
- `[Phase 2] Create BoardContext with useReducer`
- `[Phase 4] Build TaskCard component with priority badges`
- `[Phase 5] Integrate @dnd-kit drag and drop`
- `[Bug] Fix card not updating status on cross-column drag`

### 3.2 Issue Body Template

Every issue body must follow this structure:

```markdown
## Summary
One or two sentences describing what this issue covers and why it matters.

## Tasks
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

## Acceptance Criteria
- [ ] Criterion 1 (what "done" looks like)
- [ ] Criterion 2

## Phase
Phase X — [Phase Name]

## Related Files
- `src/components/Example/Example.jsx`
- `src/styles/index.css`

## Notes
Any additional context, design decisions, or references.
```

### 3.3 One Issue Per Logical Unit

- Each issue should represent a **single logical unit of work** (one component, one feature, one bug fix).
- Do **not** create monolithic issues covering an entire phase. Break phases into 3–8 focused issues.
- Do **not** create trivially small issues (e.g., "fix a typo") unless the typo is user-facing and impactful.

---

## 4. Label System

### 4.1 Required Labels

The agent must create these labels in the repository (if they don't already exist) before the first issue is created:

| Label | Color | Description |
|---|---|---|
| `phase-1` | `#0e8a16` | Phase 1 — Project Scaffolding & Design Foundation |
| `phase-2` | `#1d76db` | Phase 2 — State Management & Data Layer |
| `phase-3` | `#5319e7` | Phase 3 — Board Layout & Columns |
| `phase-4` | `#d93f0b` | Phase 4 — Task Cards |
| `phase-5` | `#fbca04` | Phase 5 — Drag & Drop Integration |
| `phase-6` | `#0075ca` | Phase 6 — Search, Filter & Polish |
| `phase-7` | `#e4e669` | Phase 7 — Testing & Final QA |
| `feature` | `#a2eeef` | New feature or enhancement |
| `bug` | `#d73a4a` | Something isn't working |
| `design` | `#f9d0c4` | UI/UX design work |
| `infrastructure` | `#d4c5f9` | Tooling, config, project setup |
| `documentation` | `#0075ca` | Documentation updates |
| `priority: high` | `#b60205` | Must be done for the phase to be complete |
| `priority: medium` | `#fbca04` | Important but not blocking |
| `priority: low` | `#0e8a16` | Nice to have |

### 4.2 Labeling Rules

- Every issue **must** have exactly **one phase label** (e.g., `phase-3`).
- Every issue **must** have exactly **one type label** (`feature`, `bug`, `design`, `infrastructure`, or `documentation`).
- Every issue **should** have a **priority label** (`priority: high`, `priority: medium`, or `priority: low`).
- Labels must be applied at issue creation time, not retroactively.

---

## 5. Project Board Management

### 5.1 Adding Issues to the Project

Every issue created must be added to **Project #6 (kanban-demo)** immediately upon creation using the GitHub CLI or API:

```bash
# Add issue to project
gh project item-add 6 --owner aaronjorgreen --url <issue_url>
```

### 5.2 Status Field Updates

When an issue transitions between stages, the agent must update the `Status` field on the project board. Use the GitHub CLI or API to move items between columns:

- **Backlog** → issue is created but not yet scheduled
- **To Do** → issue is planned for the current phase
- **In Progress** → agent is actively working on it
- **Done** → issue is closed and verified

### 5.3 Roadmap View Maintenance

The project's **Roadmap view (View #2)** requires date fields to display items on the timeline. The agent should:

1. Ensure `Start date` and `Target date` fields exist on the project (create them if missing via `gh project field-create`).
2. When moving an issue to **In Progress**, set the `Start date` to the current date.
3. When moving an issue to **Done**, set the `Target date` to the current date (representing completion).
4. Group issues by phase label so the roadmap displays a clear phase-based timeline.

### 5.4 Board Hygiene Checks

The agent must perform these checks at the start and end of each phase:

**At the start of a phase:**
- [ ] All issues for the phase are created and labeled
- [ ] All issues are added to Project #6
- [ ] Issues are set to `To Do` status on the board
- [ ] Priority labels are assigned

**At the end of a phase:**
- [ ] All phase issues are closed with `state_reason: completed`
- [ ] All phase issues are moved to `Done` on the board
- [ ] Closing comments are added to each issue
- [ ] No orphaned issues remain in `In Progress`

---

## 6. Commit & Issue Linking

### 6.1 Referencing Issues in Commits

Every commit message should reference the issue it addresses:

```
feat: build TaskCard component with priority badges (#12)
fix: correct drag overlay z-index stacking (#15)
chore: set up Vite project scaffolding (#1)
```

### 6.2 Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <short description> (#<issue_number>)

[optional body with more detail]
```

**Types:**
| Type | Use For |
|---|---|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `style` | CSS / styling changes (no logic change) |
| `refactor` | Code restructuring (no feature change) |
| `chore` | Tooling, config, dependency updates |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |

### 6.3 Auto-Closing via Keywords

Use GitHub's auto-close keywords in commit messages or PR descriptions to automatically close issues when code is merged:

```
feat: implement search and filter header (closes #18)
```

Valid keywords: `closes`, `fixes`, `resolves`

---

## 7. GitHub Hygiene Best Practices

### 7.1 Issue Hygiene

- **No stale issues**: If an issue has been in `In Progress` for more than one phase cycle without updates, add a comment explaining the delay or reassign it.
- **No duplicate issues**: Before creating an issue, check if a similar one already exists using `gh issue list` or `search_issues`.
- **Close promptly**: Close issues as soon as the work is verified, not in bulk at the end.
- **Use closing comments**: Never close an issue silently. Always add a comment summarizing what was done:
  ```
  ✅ Completed. Built the TaskCard component with:
  - Priority badge (Low/Medium/High with color coding)
  - Assignee avatar display
  - Subtask progress bar
  - Hover-reveal edit/delete action buttons
  
  All acceptance criteria met. Closing.
  ```

### 7.2 Project Board Hygiene

- **Single source of truth**: The project board is the authoritative view of progress. It must always reflect reality.
- **No items without status**: Every item on the board must have a status. No items should sit in an unassigned/default state.
- **Column task counts**: The board's column counts should be meaningful — if 3 items are in "In Progress", the agent is actively working on 3 things.
- **Limit WIP**: The agent should have no more than **3 issues** in `In Progress` at any time. Finish work before starting new work.

### 7.3 Repository Hygiene

- **Branch strategy**: Work on the `main` branch for this project (single developer, no PRs needed). If preferred, the agent can use feature branches named `phase-X/description`.
- **Keep commits atomic**: Each commit should represent one logical change. Avoid mega-commits that touch 15+ files across unrelated features.
- **No dead code**: Don't commit commented-out code, console.logs for debugging, or unused imports.
- **README updates**: Update the repository README.md after major milestones (end of Phase 3, end of Phase 7).

### 7.4 Assignee Management

- Assign all issues to `aaronjorgreen` (the repository owner).
- If the agent is performing the work, note this in the issue body: `> 🤖 This issue is being implemented by the AI agent.`

---

## 8. Phase-to-Issue Mapping Template

When beginning a new phase, the agent must create issues following this pattern. Below is an example for **Phase 3**:

```
Issue 1: [Phase 3] Build common UI components (Button, IconButton, Badge, Input)
  Labels: phase-3, feature, priority: high

Issue 2: [Phase 3] Build Board component with horizontal column layout
  Labels: phase-3, feature, priority: high

Issue 3: [Phase 3] Build Column and ColumnHeader components
  Labels: phase-3, feature, priority: high

Issue 4: [Phase 3] Build ColumnModal for add/edit column
  Labels: phase-3, feature, priority: medium

Issue 5: [Phase 3] Build DeleteConfirmModal component
  Labels: phase-3, feature, priority: medium

Issue 6: [Phase 3] Apply glassmorphism styling to column components
  Labels: phase-3, design, priority: high

Issue 7: [Phase 3] Wire column CRUD actions and verify
  Labels: phase-3, feature, priority: high
```

---

## 9. Agent Workflow Summary

For every unit of work, the agent must follow this exact sequence:

```
1.  CREATE issue (title, body, labels, assignee)
2.  ADD issue to Project #6
3.  SET status → "To Do" (or "In Progress" if starting immediately)
4.  COMMENT on issue: "🚧 Work started"
5.  DO the work (write code, create files)
6.  COMMIT with issue reference: "feat: description (#N)"
7.  COMMENT on issue: summary of what was done
8.  CLOSE issue with state_reason: completed
9.  MOVE issue to "Done" on the project board
10. SET Target date on the project item
```

**No exceptions. No skipping steps. Every piece of work is tracked.**

---

## 10. Quick Reference — CLI Commands

```bash
# Create an issue
gh issue create --repo aaronjorgreen/kanban-demo \
  --title "[Phase X] Description" \
  --body "## Summary\n..." \
  --label "phase-X,feature,priority: high" \
  --assignee aaronjorgreen

# Add issue to project
gh project item-add 6 --owner aaronjorgreen --url <issue_url>

# List project items
gh project item-list 6 --owner aaronjorgreen

# Edit project item field (e.g., Status)
gh project item-edit --project-id PVT_kwHODG6_3M4Bcaod \
  --id <item_id> --field-id <status_field_id> --single-select-option-id <option_id>

# Close an issue
gh issue close <issue_number> --repo aaronjorgreen/kanban-demo \
  --reason completed --comment "✅ Completed. <summary>"

# List issues by label
gh issue list --repo aaronjorgreen/kanban-demo --label "phase-3"

# Search for duplicate issues
gh issue list --repo aaronjorgreen/kanban-demo --search "TaskCard"
```

---

> **This guide is mandatory.** The agent must reference it before beginning any phase and follow the workflow for every issue throughout the kanban-demo build.
