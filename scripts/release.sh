#!/usr/bin/env bash
#
# Único camino soportado para sacar una versión.
#
# Sube la versión del package.json, la commitea, crea la etiqueta vX.Y.Z y
# ofrece hacer push. El push de la etiqueta dispara el workflow
# .github/workflows/publish.yml, que comprueba tipos, pasa los tests, compila
# y publica en npm con provenance. Este script no compila ni publica nada.
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

echo "▸ Fijando la versión…"
pnpm version "$VERSION" --no-git-tag-version --allow-same-version >/dev/null

git add package.json
if git diff --cached --quiet; then
  echo "· El package.json ya está en la versión $VERSION: solo se etiqueta."
else
  git commit -m "chore(release): v$VERSION"
fi
git tag -a "v$VERSION" -m "v$VERSION"

echo
echo "✓ v$VERSION lista en local."
read -r -p "¿Hacer push (git push --follow-tags)? Eso publica en npm desde CI. [y/N] " answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
  git push --follow-tags
  echo "✓ v$VERSION enviada. Sigue la publicación en la pestaña Actions de GitHub."
else
  echo "· Push omitido. Cuando quieras: git push --follow-tags"
fi
