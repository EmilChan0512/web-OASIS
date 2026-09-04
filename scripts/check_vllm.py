"""Discover the model id; never guess it."""
import json, os, sys
from pathlib import Path
from urllib.request import Request, urlopen

for line in (Path(__file__).resolve().parents[1] / ".env").read_text().splitlines() if (Path(__file__).resolve().parents[1] / ".env").exists() else []:
    if line and not line.lstrip().startswith("#") and "=" in line:
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())
base = os.getenv("LLM_BASE_URL", "http://localhost:8000/v1").rstrip("/")
try:
    request = Request(f"{base}/models", headers={"Authorization": f"Bearer {os.getenv('LLM_API_KEY', 'local')}"})
    with urlopen(request, timeout=5) as response: payload = json.load(response)
except Exception as error:
    print(f"FAILED: cannot reach {base}/models: {error}"); sys.exit(1)
models = [model["id"] for model in payload.get("data", [])]
print("vLLM reachable")
print("models:")
for model in models: print(f"  {model}")
if models: print(f"Set LLM_MODEL={models[0]} in .env (or choose another id above).")
