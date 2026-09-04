# Backend API and stream contract

The frontend observes backend-owned state. It never writes agents, follows, presentation coordinates, or platform data.

## HTTP

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Runtime, OASIS, and vLLM status. |
| `GET` | `/api/simulation` | A complete observer snapshot. |
| `GET` | `/api/agents` | The 20 normalized agent profiles. |
| `GET` | `/api/events` | Up to 100 latest normalized OASIS trace events. |
| `POST` | `/api/simulation/start` | Initialize OASIS and start the tick loop. |
| `POST` | `/api/simulation/pause` | Stop future ticks without resetting OASIS state. |
| `POST` | `/api/simulation/resume` | Resume the tick loop. |
| `POST` | `/api/simulation/step` | Execute one real OASIS step. |

`start`, `resume`, and `step` return `503` when OASIS or its required model configuration is unavailable. They do not synthesize events.

## WebSocket

Connect to `ws://localhost:8001/ws`. The server sends a `snapshot` packet immediately, then sends:

```json
{"type":"snapshot","data":{"state":{},"agents":[],"graph":[],"events":[]}}
{"type":"event","data":{"id":"...","step":1,"actorId":0,"actionType":"CREATE_POST","raw":{}}}
```

`SimulationEvent.raw` retains the OASIS trace and action arguments for debugging. Persisted graph edges come from `AgentGraph.get_edges()` after initialization; temporary interaction visualization must be derived from timestamped events and must not be written into the follow graph.
