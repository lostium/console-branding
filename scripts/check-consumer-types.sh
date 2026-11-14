#!/usr/bin/env bash
#
# Comprueba que los tipos publicados se pueden usar desde un proyecto con
# versiones anteriores de TypeScript y Angular a las de este repo.
#
# Empaqueta la librería, la instala en un proyecto temporal junto con las
# versiones indicadas y compila test/consumer-types/main.ts con ese tsc.
#
# Uso: ./scripts/check-consumer-types.sh <typescript> <angular>
#      ./scripts/check-consumer-types.sh 5.5 19

set -euo pipefail

TS_VERSION="${1:?Falta la versión de TypeScript (p. ej. 5.5)}"
NG_VERSION="${2:?Falta la versión de Angular (p. ej. 19)}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
pnpm build >/dev/null
pnpm pack --pack-destination "$WORK" >/dev/null
TARBALL="$(ls "$WORK"/*.tgz)"

cp test/consumer-types/main.ts test/consumer-types/tsconfig.json "$WORK"/
cd "$WORK"
echo '{ "name": "consumer-types", "private": true, "type": "module" }' >package.json
pnpm add --silent "$TARBALL" "@angular/core@^$NG_VERSION" rxjs "typescript@~$TS_VERSION"

echo "▸ $(pnpm exec tsc -v) + Angular $(node -p "require('@angular/core/package.json').version")"
pnpm exec tsc -p tsconfig.json
echo "✓ Los tipos se compilan sin errores"
