# Experiment 001

## Objective

Demonstrate that 20 OASIS SocialAgents form a continuously running social network with observable information flow, social actions, and follow-graph changes while no human takes part in the simulation.

## Definition of done

1. A Windows backend reaches the WSL vLLM OpenAI-compatible endpoint and uses the `/v1/models` discovered Qwen ID.
2. OASIS creates exactly 20 `SocialAgent` instances and a non-isolated directed `AgentGraph`.
3. The runtime repeatedly invokes `env.step()` for only the selected subset of agents per tick.
4. OASIS native actions—not hardcoded frontend events—appear in the normalized event stream.
5. The browser renders 20 fixed nodes, persistent follow edges, state, errors, and WebSocket status.
6. Replacing every presentation coordinate leaves backend simulation state and decisions unchanged.

## Non-goals

Physical distance, movement, map exploration, rooms, navigation, player control, combat, inventory, quests, dialogue trees, and scripted stories are out of scope. `docs/future.md` records deferred work rather than adding any of it to this experiment.
