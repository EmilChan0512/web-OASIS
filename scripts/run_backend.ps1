$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
if (-not (Test-Path '.venv')) { py -3.11 -m venv .venv }
& .\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8001 --reload
