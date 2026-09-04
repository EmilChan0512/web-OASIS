"""The only module allowed to import OASIS runtime classes."""
import json
import os
from pathlib import Path


class OasisUnavailable(RuntimeError):
    pass


def load_profiles(path: Path) -> list[dict]:
    profiles = json.loads(path.read_text())
    if len(profiles) != 20 or len({profile["id"] for profile in profiles}) != 20:
        raise ValueError("data/agents.json must contain exactly 20 unique profiles")
    return profiles


def build_oasis_environment(profiles: list[dict], settings):
    try:
        import oasis
        from camel.models import ModelFactory
        from camel.types import ModelPlatformType
        from oasis import ActionType, AgentGraph, SocialAgent, UserInfo
    except ImportError as error:
        raise OasisUnavailable("OASIS is not installed. Use Python 3.10-3.11 and install backend/requirements.txt.") from error

    if not settings.llm_model:
        raise OasisUnavailable("LLM_MODEL is empty. Run scripts/check_vllm.py and set the discovered /v1/models id.")

    model = ModelFactory.create(
        model_platform=ModelPlatformType.VLLM,
        model_type=settings.llm_model,
        url=settings.llm_base_url,
    )
    graph = AgentGraph()
    actions = [ActionType.CREATE_POST, ActionType.CREATE_COMMENT, ActionType.LIKE_POST, ActionType.REPOST, ActionType.FOLLOW]
    for profile in profiles:
        agent = SocialAgent(
            agent_id=profile["id"],
            user_info=UserInfo(user_name=profile["handle"], name=profile["name"], description=profile["description"], profile=None, recsys_type="reddit"),
            agent_graph=graph, model=model, available_actions=actions,
        )
        graph.add_agent(agent)
    for profile in profiles:
        for followed_id in profile["follows"]:
            graph.add_edge(profile["id"], followed_id)
    os.environ["OASIS_DB_PATH"] = str(settings.database_path)
    environment = oasis.make(agent_graph=graph, platform=oasis.DefaultPlatformType.REDDIT, database_path=str(settings.database_path))
    return environment
