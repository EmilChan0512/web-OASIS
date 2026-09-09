# Phase 1 UI — Observation and control plan

## Purpose

Phase 1 UI makes the autonomous OASIS social network easier to inspect and control while preserving the experiment's central invariant: presentation must never influence simulation behavior. The observer may select, filter, highlight, pause, resume, and inspect. It must not create a player role, spatial meaning, nearby interactions, or synthetic simulation actions.

## Interaction principles

1. **Observe before act.** The primary task is understanding social flow, not playing a game.
2. **Backend authority.** All simulation changes remain explicit backend commands; browser state is disposable observer state.
3. **Presentation isolation.** Node selection, drag position, filtering, highlighting, and panel state never enter OASIS, scheduler, feed, or graph logic.
4. **Transparent modes.** Mock data, disconnected state, and runtime errors remain conspicuous.
5. **Keyboard and motion safety.** Common controls have keyboard shortcuts, focus treatment, ARIA labels, and reduced-motion support.

## Phase 1 UI backlog

### Delivered in this iteration

| Capability | User outcome | Simulation impact |
| --- | --- | --- |
| Agent selection and inspector | Click a node or event actor to inspect the agent’s profile, follows, and event history. | None; local UI state only. |
| Event filtering and search | Focus on one action type, an agent, or matching content without losing the complete stream. | None; client-side projection only. |
| Event-to-graph focus | Selecting an event highlights its actor node in the graph while preserving all persistent follow edges. | None; local selection state only. |
| Contextual controls | Start/pause/resume/step buttons reflect busy/error state and announce results. | Existing explicit API commands only. |
| Keyboard shortcuts | `Space` starts/pauses, `S` steps once, `/` focuses search, `Esc` clears selection. | Existing explicit API commands only. |
| Accessibility and comfort | Semantic buttons, live event announcements, focus styles, and reduced-motion behavior. | None. |
| URL-restorable observer state | Version 1 restores and shares the selected agent through an `agent` URL query parameter. | None. |

### Deferred beyond Phase 1 UI

- Editing profiles, follows, or posts in the browser.
- Client-generated social actions or “what if” actions.
- A physical map, proximity filters, movement, or spatial interaction.
- Long-term memory, relationship score, or explanation visualizations that OASIS does not expose.
- Multi-user collaboration, accounts, and persisted observer preferences beyond local browser state.

## Interaction model

```text
Click node ────────┐
Click event actor ├─→ local selectedAgentId → inspector + graph highlight
Click event ───────┘

Search/filter ─────→ local event projection → event stream only

Start/Pause/Step ──→ existing FastAPI command → OASIS runtime
```

The only arrows that reach the backend are the existing explicit simulation controls. All other interactions terminate in the frontend presentation state.

## Acceptance criteria

1. Selecting or rearranging nodes does not issue any HTTP simulation request.
2. Selected-agent inspector shows profile data and only events involving that agent.
3. A search/filter changes the displayed event list but never deletes retained events.
4. Selecting a different event or clearing the selected agent changes the local graph focus without altering persistent follow edges.
5. Keyboard shortcuts do not fire while typing in a search input.
6. Mock mode supports every observer interaction but remains labelled as mock data.
7. Version 1 and Version 2 retain their distinct visual designs while sharing node selection, inspection, event focus, search, and filtering semantics.
8. Existing architecture tests and all three frontend builds continue to pass.
