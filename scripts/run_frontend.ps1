$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location "$root\frontend"
pnpm install
pnpm dev --host 127.0.0.1
