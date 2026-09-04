from datetime import datetime, timezone
import json
from uuid import uuid4
from app.models.api import SimulationEvent


def normalize_event(step: int, actor: dict, action_type: str, action_args: dict | None = None) -> SimulationEvent:
    args = action_args or {}
    target_id = args.get("target_agent_id", args.get("user_id"))
    return SimulationEvent(
        id=str(uuid4()), step=step, timestamp=datetime.now(timezone.utc).isoformat(),
        actorId=actor["id"], actorName=actor["name"], actionType=action_type.upper(),
        targetAgentId=target_id if isinstance(target_id, int) else None,
        content=args.get("content"), sourcePostId=str(args["post_id"]) if args.get("post_id") else None,
        raw={"oasis_action": {"action_type": action_type, "action_args": args}},
    )


def normalize_trace(step: int, trace: dict, profiles_by_id: dict[int, dict]) -> SimulationEvent:
    args = json.loads(trace["info"]) if isinstance(trace["info"], str) else trace["info"]
    actor = profiles_by_id[trace["user_id"]]
    target_id = args.get("followee_id", args.get("user_id"))
    target = profiles_by_id.get(target_id)
    return SimulationEvent(
        id=str(uuid4()), step=step, timestamp=str(trace["created_at"]), actorId=actor["id"], actorName=actor["name"],
        actionType=str(trace["action"]).upper(), targetAgentId=target_id if target else None,
        targetAgentName=target["name"] if target else None, content=args.get("content"),
        sourcePostId=str(args["post_id"]) if args.get("post_id") is not None else None,
        raw={"oasis_trace": trace, "action_args": args},
    )
