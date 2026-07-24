#!/usr/bin/env bash
#
# Único camino soportado para publicar una versión.
#
# Compila, verifica y taggea en un solo paso, de forma que el `dist/` que se
# commitea siempre corresponde al `src/` de esa etiqueta: es lo que garantiza
# que un proyecto que instale `github:lostium/console-branding#vX.Y.Z` reciba
# el código correcto.
#
# Uso: ./scripts/release.sh 1.1.0

set -euo pipefail

VERSION="${1:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

die() {
  echo "✗ $1" >&2
  exit 1
}

[[ -n "$VERSION" ]] || die "Falta la versión. Uso: ./scripts/release.sh 1.1.0"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "Versión inválida: '$VERSION'. Se espera X.Y.Z"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$BRANCH" == "main" ]] || die "Las releases salen de 'main' y estás en '$BRANCH'"

[[ -z "$(git status --porcelain)" ]] || die "Hay cambios sin commitear. Limpia el árbol de trabajo antes de publicar"

git rev-parse -q --verify "refs/tags/v$VERSION" >/dev/null && die "La etiqueta v$VERSION ya existe"

grep -q "## \[$VERSION\]" CHANGELOG.md ||
  die "CHANGELOG.md no documenta la versión $VERSION. Añade su sección '## [$VERSION]' antes de publicar"

echo "▸ Comprobando tipos…"
pnpm typecheck

echo "▸ Ejecutando tests…"
pnpm test

echo "▸ Compilando…"
rm -rf dist
pnpm build

echo "▸ Fijando la versión…"
npm pkg set "version=$VERSION"

git add package.json dist CHANGELOG.md
if git diff --cached --quiet; then
  echo "· El árbol ya está en la versión $VERSION y el dist/ al día: solo se etiqueta."
else
  git commit -m "chore(release): v$VERSION"
fi
git tag -a "v$VERSION" -m "v$VERSION"

echo
echo "✓ v$VERSION lista en local."
read -r -p "¿Publicar en GitHub (git push --follow-tags)? [y/N] " answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
  git push --follow-tags
  echo "✓ v$VERSION publicada."
else
  echo "· Push omitido. Cuando quieras: git push --follow-tags"
fi
