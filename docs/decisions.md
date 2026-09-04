# Architecture decisions

- **ADR-001:** OpenGame is scaffold inspiration only; it is not an LLM provider.
- **ADR-002:** OASIS owns social simulation semantics and platform actions.
- **ADR-003:** The backend owns all runtime and platform state.
- **ADR-004:** Frontend coordinates are presentation-only metadata in `data/presentation.json`.
- **ADR-005:** Simulation code must never read presentation coordinates.
- **ADR-006:** The round-robin scheduler selects only a configured subset each tick.
- **ADR-007:** Follow graph, feed, recommendation and trace data drive information flow—not spatial relationships.
- **ADR-008:** Experiment 001 intentionally has no physical simulation.
