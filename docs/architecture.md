# Architecture

`OASIS SocialAgent + AgentGraph + Reddit platform → OasisSimulationAdapter/runtime → FastAPI/WebSocket → React/SVG observer`.

`data/agents.json` configures the 20 actual OASIS profiles and follow graph. `data/presentation.json` is imported only by the browser. The backend reads OASIS's SQLite `trace` table after each `env.step()` and converts those records to normalized WebSocket events.

## Frontend mock boundary

When `VITE_MOCK_MODE=true`, the browser uses `frontend/src/api/mock.ts` instead of the HTTP/WebSocket client. It is a deterministic visual-development fixture using `data/agents.json`, not a SocialAgent implementation or OASIS substitute. The UI labels this mode `MOCK DATA`, reports `MOCK` for WebSocket state, and sends no external request. Production and integration runs must leave the variable unset.

## Internationalization

`frontend/src/i18n/index.tsx` supplies a dependency-free `zh-CN`/`en-US` dictionary and locale context. Chinese is the default. The toggle persists its choice in local storage; translations stay in the presentation layer and never reach the OASIS runtime. Raw OASIS post/comment content remains unchanged so observers can inspect the original simulated data.
