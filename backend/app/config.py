from dataclasses import dataclass
from pathlib import Path
import os
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")


@dataclass(frozen=True)
class Settings:
    llm_base_url: str = os.getenv("LLM_BASE_URL", "http://localhost:8000/v1")
    llm_api_key: str = os.getenv("LLM_API_KEY", "local")
    llm_model: str = os.getenv("LLM_MODEL", "")
    tick_seconds: float = float(os.getenv("SIMULATION_TICK_SECONDS", "8"))
    active_agents_per_tick: int = int(os.getenv("SIMULATION_ACTIVE_AGENTS_PER_TICK", "3"))
    agents_path: Path = ROOT / "data" / "agents.json"
    presentation_path: Path = ROOT / "data" / "presentation.json"
    database_path: Path = ROOT / "backend" / "oasis_simulation.db"


settings = Settings()
