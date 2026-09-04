# Architecture

`OASIS SocialAgent + AgentGraph + Reddit platform → OasisSimulationAdapter/runtime → FastAPI/WebSocket → React/SVG observer`.

`data/agents.json` configures the 20 actual OASIS profiles and follow graph. `data/presentation.json` is imported only by the browser. The backend reads OASIS's SQLite `trace` table after each `env.step()` and converts those records to normalized WebSocket events.
