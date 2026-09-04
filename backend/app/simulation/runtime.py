import asyncio
import sqlite3
import time
from collections.abc import Awaitable, Callable
from app.config import settings
from app.models.api import AgentViewState, GraphEdge, SimulationEvent, SimulationState
from app.simulation.event_adapter import normalize_trace
from app.simulation.oasis_factory import OasisUnavailable, build_oasis_environment, load_profiles
from app.simulation.scheduler import RoundRobinScheduler

Publisher = Callable[[dict], Awaitable[None]]


class SimulationRuntime:
    def __init__(self, publish: Publisher):
        self._publish = publish
        self.profiles = load_profiles(settings.agents_path)
        self.state = SimulationState()
        self.events: list[SimulationEvent] = []
        self.environment = None
        self._task: asyncio.Task | None = None
        self._trace_offset = 0
        self._scheduler = RoundRobinScheduler([profile["id"] for profile in self.profiles], settings.active_agents_per_tick)

    def agents(self):
        return [AgentViewState(id=p["id"], name=p["name"], handle=p["handle"], description=p["description"]) for p in self.profiles]

    def graph(self):
        if self.environment:
            return [GraphEdge(source=source, target=target) for source, target in self.environment.agent_graph.get_edges()]
        return [GraphEdge(source=profile["id"], target=target) for profile in self.profiles for target in profile["follows"]]

    async def initialize(self):
        if self.environment:
            return
        try:
            self.environment = build_oasis_environment(self.profiles, settings)
            await self.environment.reset()
            from oasis import ActionType, ManualAction
            alice = self.environment.agent_graph.get_agent(0)
            await self.environment.step({alice: [ManualAction(ActionType.CREATE_POST, {"content": "I heard the community garden may close next month. Does anyone know what happened?"})]})
            await self._collect_trace_events()
            self.state.oasisStatus = "connected"
            self.state.llmStatus = "connected"
            self.state.llmModel = settings.llm_model
        except OasisUnavailable as error:
            self.state.oasisStatus = "error"
            self.state.llmStatus = "disconnected"
            self.state.error = str(error)
            raise

    async def start(self):
        await self.initialize()
        if self._task and not self._task.done():
            return
        self.state.running = True
        self._task = asyncio.create_task(self._run())
        await self.broadcast()

    async def pause(self):
        self.state.running = False
        if self._task:
            self._task.cancel()
        await self.broadcast()

    async def step_once(self):
        await self.initialize()
        await self._step()

    async def _run(self):
        try:
            while self.state.running:
                await self._step()
                await asyncio.sleep(settings.tick_seconds)
        except asyncio.CancelledError:
            pass

    async def _step(self):
        from oasis import LLMAction
        started = time.perf_counter()
        active_ids = self._scheduler.select()
        self.state.activeAgentIds = active_ids
        self.state.step += 1
        self.state.llmRequestCount += len(active_ids)
        actions = {self.environment.agent_graph.get_agent(agent_id): LLMAction() for agent_id in active_ids}
        try:
            await self.environment.step(actions)
            await self._collect_trace_events()
        except Exception as error:
            self.state.errorCount += 1
            self.state.error = f"step {self.state.step}: {error}"
        self.state.lastTickDurationMs = round((time.perf_counter() - started) * 1000)
        self.state.totalEvents = len(self.events)
        await self.broadcast()

    async def _collect_trace_events(self):
        if not settings.database_path.exists():
            return
        connection = sqlite3.connect(settings.database_path)
        connection.row_factory = sqlite3.Row
        try:
            rows = connection.execute("SELECT user_id, created_at, action, info FROM trace ORDER BY rowid").fetchall()
        finally:
            connection.close()
        profiles_by_id = {profile["id"]: profile for profile in self.profiles}
        for row in rows[self._trace_offset:]:
            event = normalize_trace(self.state.step, dict(row), profiles_by_id)
            self.events.append(event)
            await self._publish({"type": "event", "data": event.model_dump()})
        self._trace_offset = len(rows)

    async def broadcast(self):
        await self._publish({"type": "snapshot", "data": self.snapshot()})

    def snapshot(self):
        return {"state": self.state.model_dump(), "agents": [a.model_dump() for a in self.agents()], "graph": [e.model_dump() for e in self.graph()], "events": [event.model_dump() for event in self.events[-100:] ]}
