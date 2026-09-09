#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../frontend"
VITE_MOCK_MODE=true pnpm install --frozen-lockfile
VITE_MOCK_MODE=true pnpm dev --host 127.0.0.1
