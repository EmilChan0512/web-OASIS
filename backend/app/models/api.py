from typing import Any, Literal
from pydantic import BaseModel, Field


class AgentViewState(BaseModel):
    id: int
    name: str
    handle: str
    description: str


class GraphEdge(BaseModel):
    source: int
    target: int


class SimulationEvent(BaseModel):
    id: str
    step: int
    timestamp: str
    actorId: int
    actorName: str
    actionType: str
    targetAgentId: int | None = None
    targetAgentName: str | None = None
    content: str | None = None
    sourcePostId: str | None = None
    raw: Any = None


class SimulationState(BaseModel):
    step: int = 0
    running: bool = False
    oasisStatus: Literal["uninitialized", "connected", "error"] = "uninitialized"
    llmStatus: Literal["unknown", "connected", "disconnected"] = "unknown"
    llmModel: str | None = None
    lastTickDurationMs: int | None = None
    activeAgentIds: list[int] = Field(default_factory=list)
    totalEvents: int = 0
    llmRequestCount: int = 0
    errorCount: int = 0
    error: str | None = None
