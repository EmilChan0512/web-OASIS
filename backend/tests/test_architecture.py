import json
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.simulation.oasis_factory import load_profiles
from app.simulation.scheduler import RoundRobinScheduler

ROOT = Path(__file__).resolve().parents[2]

def test_twenty_unique_profiles_and_complete_presentation():
    profiles = load_profiles(ROOT / "data" / "agents.json")
    presentation = json.loads((ROOT / "data" / "presentation.json").read_text())
    assert len(profiles) == 20
    assert {profile["id"] for profile in profiles} == {node["id"] for node in presentation}

def test_social_graph_has_no_isolated_agents():
    profiles = load_profiles(ROOT / "data" / "agents.json")
    incoming = {target for profile in profiles for target in profile["follows"]}
    assert all(profile["follows"] or profile["id"] in incoming for profile in profiles)

def test_scheduler_never_exceeds_configured_maximum():
    scheduler = RoundRobinScheduler(list(range(20)), 3)
    assert all(len(scheduler.select()) <= 3 for _ in range(20))

def test_event_adapter_defines_required_event_fields():
    adapter = (ROOT / "backend" / "app" / "simulation" / "event_adapter.py").read_text()
    for field in ("actorId", "actorName", "actionType", "sourcePostId", "raw"):
        assert field in adapter

def test_simulation_modules_never_read_presentation_coordinates():
    simulation = ROOT / "backend" / "app" / "simulation"
    source = "\n".join(path.read_text() for path in simulation.glob("*.py"))
    assert "presentation.json" not in source
    assert '"x"' not in source and '"y"' not in source
