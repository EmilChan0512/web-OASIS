from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.simulation.oasis_factory import OasisUnavailable
from app.simulation.runtime import SimulationRuntime

clients: set[WebSocket] = set()


async def publish(message: dict):
    stale = []
    for client in clients:
        try: await client.send_json(message)
        except Exception: stale.append(client)
    for client in stale: clients.discard(client)


runtime = SimulationRuntime(publish)

@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await runtime.pause()

app = FastAPI(title="OASIS Living Social Network", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
async def health(): return runtime.state.model_dump()
@app.get("/api/simulation")
async def simulation(): return runtime.snapshot()
@app.get("/api/agents")
async def agents(): return runtime.agents()
@app.get("/api/events")
async def events(): return runtime.events[-100:]

async def execute(operation):
    try: await operation(); return runtime.snapshot()
    except OasisUnavailable as error: raise HTTPException(503, str(error))

@app.post("/api/simulation/start")
async def start(): return await execute(runtime.start)
@app.post("/api/simulation/pause")
async def pause(): await runtime.pause(); return runtime.snapshot()
@app.post("/api/simulation/resume")
async def resume(): return await execute(runtime.start)
@app.post("/api/simulation/step")
async def step(): return await execute(runtime.step_once)

@app.websocket("/ws")
async def websocket(socket: WebSocket):
    await socket.accept(); clients.add(socket); await socket.send_json({"type": "snapshot", "data": runtime.snapshot()})
    try:
        while True: await socket.receive_text()
    except WebSocketDisconnect: clients.discard(socket)
