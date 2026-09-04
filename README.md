# OASIS Living Social Network — Experiment 001

An observer for a small autonomous social network: 20 real OASIS `SocialAgent`s read a social-platform context, take OASIS-native actions, and expose the resulting follow graph and trace stream in a browser.

## It is not a game world

There are no player characters, maps, movement, proximity, collision, rooms, quests, combat, items, inventories, or dialogue trees. SVG node coordinates are presentation-only. Rearranging `data/presentation.json` cannot alter scheduling, graph state, feed exposure, or actions.

## Architecture

The Python backend owns OASIS, `AgentGraph`, the Reddit platform, database, clock, scheduler and event normalization. A WebSocket pushes backend-owned snapshots to React. OASIS is the runtime; OpenGame is intentionally not a runtime dependency or LLM provider.

```text
Qwen2.5-7B via vLLM → CAMEL/OASIS SocialAgent → OASIS platform trace
                                           ↓
                  FastAPI snapshot + WebSocket events → React/SVG observer
```

- `data/agents.json` is the source of truth for the 20 profiles and initial follows.
- `data/presentation.json` is browser-only metadata; changing it cannot change a simulation decision.
- A tick selects at most `SIMULATION_ACTIVE_AGENTS_PER_TICK` agents. All 20 remain in OASIS.
- The one seed post is a real OASIS `ManualAction` after `env.reset()`. All later actions are requested through `LLMAction`.

Read `docs/architecture.md`, `docs/api.md`, and `docs/decisions.md` for the complete contracts.

## Prerequisites (Windows 11)

1. Use Python **3.10 or 3.11** (OASIS 0.2.5 does not support Python 3.9), Node and pnpm.
2. In WSL, start the existing Qwen2.5-7B vLLM server with tool calling enabled. Do not deploy another model. A compatible command is: `vllm serve /path/to/Qwen2.5-7B-Instruct --host 0.0.0.0 --port 8000 --served-model-name qwen-2 --enable-auto-tool-choice --tool-call-parser hermes`.
3. Copy `.env.example` to `.env`; set the reachable `LLM_BASE_URL`. Start with `http://localhost:8000/v1`; do not hard-code a transient WSL IP.
4. Run `python scripts/check_vllm.py`; it reads `.env` and prints the actual `/v1/models` values. Copy the chosen ID into `LLM_MODEL`. This is required—model names are never guessed.

## Start

From PowerShell run `scripts/dev.ps1`, then open `http://localhost:5173`. It opens a backend on `http://localhost:8001` and frontend on port `5173`. Click **Start**; the backend seeds one real OASIS post once after reset, then runs 2–4 configurable LLM actions per tick. Use `Pause`, `Resume`, or `Step once` for observation. `scripts/run_backend.ps1` and `scripts/run_frontend.ps1` are available when the processes need to be run separately.

Environment values: `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, `SIMULATION_TICK_SECONDS` (default 8), and `SIMULATION_ACTIVE_AGENTS_PER_TICK` (default 3).

## Verifying real execution

1. `python scripts/check_vllm.py` exits successfully and prints the selected model ID.
2. `GET http://localhost:8001/api/health` shows `oasisStatus: connected`, `llmStatus: connected`, and that model ID.
3. Press **Step once**. The step and LLM-request counts increase; an OASIS `trace` row is normalized and sent to the event stream.
4. Drag SVG nodes or replace `data/presentation.json`, restart only the frontend, and confirm that no backend state or event semantics change.

The event stream contains rows read from OASIS's SQLite `trace` table; it never has hardcoded or random demo actions. OASIS/vLLM errors fail visibly and never fall back to a cloud model or fake agents.

## Tests and troubleshooting

Run `python -m pytest backend/tests -q` for data, scheduler, event-contract, and presentation-separation checks. Run `pnpm --dir frontend build` for the production frontend build. The OASIS integration check is an operational verification rather than a mocked unit test because it requires the local Qwen/vLLM service.

If `/v1/models` fails, first verify the WSL vLLM server and its Windows-reachable address; use a current address in `.env`, not source code. If startup reports a missing OASIS package, use Python 3.10 or 3.11, then rerun `scripts/run_backend.ps1`. If the UI says WebSocket disconnected, confirm the backend is running on port `8001` and no `VITE_API_URL` overrides it incorrectly.

Known limitation: this checkout was bootstrapped on macOS with Python 3.9.6 and no reachable vLLM/OASIS installation, so a real run is not claimed yet. See `docs/environment.md` and `docs/delivery-report.md`.

Experiment 002 will investigate whether autonomous social-network dynamics can produce an event that a human observer genuinely wants to understand.
