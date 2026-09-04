$root = Split-Path -Parent $PSScriptRoot
Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', "`"$root\scripts\run_backend.ps1`""
Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', "`"$root\scripts\run_frontend.ps1`""
Write-Host 'Backend: http://localhost:8001  Frontend: http://localhost:5173'
