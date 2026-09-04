# Bootstrap delivery report — 2026-09-04

| Item | Result |
| --- | --- |
| Environment detected | Node `24.14.1`, npm `11.11.0`, pnpm `7.33.7`, Python `3.9.6`. |
| OpenGame version / use | Not detected; intentionally scaffold/reference only. |
| OASIS version / commit | Target is `camel-oasis 0.2.5`, commit `0004f5bfd61194324cb40623fa9b2578daf9aec9`. Not installed locally. |
| vLLM endpoint | `http://localhost:8000/v1`; `/models` returned HTTP `502`. |
| Actual Qwen model ID | **FAILED** — unavailable because `/v1/models` did not succeed. |
| Architecture | FastAPI + real OASIS factory + SQLite trace adapter + WebSocket + React/SVG observer. |
| Real SocialAgents | Configured for 20; **not runtime-verified** on this host. |
| Initial graph | Four interwoven social clusters with three directed follows per agent and no isolates. |
| Tests | `5 passed` architecture tests; frontend production build passed. |
| Actual simulation / events / requests | **FAILED** — no compatible Python/OASIS installation or reachable vLLM endpoint. |
| Definition of Done | **FAILED** pending a Windows Python 3.10/3.11 run with reachable Qwen vLLM. |

The failure is intentional and visible: startup returns an explicit dependency/configuration error and never substitutes fake agents, random actions, precomputed histories, a cloud model, or a physical-world simulation.
