#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${1:-$(pwd)}"

log() { printf "\033[1;34m[FIX]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[WARN]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[ERR ]\033[0m %s\n" "$*" >&2; }

cd "$PROJECT_DIR" || { err "Project dir not found: $PROJECT_DIR"; exit 1; }
[ -f package.json ] || { err "No package.json here. Run from the project root."; exit 1; }

# 1) Ensure src/ exists
mkdir -p src

move_into_src () {
  local d="$1"
  if [ -d "$d" ] && [ ! -d "src/$d" ]; then
    log "Moving $d/ -> src/$d/"
    mkdir -p "src/$d"
    shopt -s dotglob nullglob
    mv "$d"/* "src/$d"/ 2>/dev/null || true
    shopt -u dotglob nullglob
    rmdir "$d" 2>/dev/null || true
  elif [ -d "$d" ] && [ -d "src/$d" ]; then
    log "Merging $d/ -> src/$d/ (existing)"
    shopt -s dotglob nullglob
    mv "$d"/* "src/$d"/ 2>/dev/null || true
    shopt -u dotglob nullglob
    rmdir "$d" 2>/dev/null || true
  else
    log "Skip $d (not present)"
  fi
}

# 2) Move expected folders into src/
move_into_src components
move_into_src lib
move_into_src specs
move_into_src content

# 3) Ensure TS config supports JSON imports and alias @ -> src/*
if [ -f tsconfig.json ]; then
  node <<'NODE'
const fs = require('fs');
const path = 'tsconfig.json';
const ts = JSON.parse(fs.readFileSync(path, 'utf8'));

ts.compilerOptions = ts.compilerOptions || {};
// baseUrl & paths
ts.compilerOptions.baseUrl = ts.compilerOptions.baseUrl || ".";
ts.compilerOptions.paths = ts.compilerOptions.paths || {};
ts.compilerOptions.paths['@/*'] = ["./src/*"];
// helpful for JSON imports
ts.compilerOptions.resolveJsonModule = true;
ts.compilerOptions.esModuleInterop = ts.compilerOptions.esModuleInterop ?? true;

fs.writeFileSync(path, JSON.stringify(ts, null, 2));
console.log('[FIX] Updated tsconfig.json (paths, resolveJsonModule).');
NODE
else
  warn "tsconfig.json not found (unexpected in Next.js TS project)."
fi

# 4) Make sure .nvmrc exists (handy)
if [ ! -f .nvmrc ]; then
  echo "22" > .nvmrc
  log "Wrote .nvmrc (22)"
fi

# 5) Reinstall (fast if nothing changed)
log "Reinstalling deps (just to refresh TS/paths)…"
npm install --silent

log "All set. Try the dev server now:"
echo "  npm run dev"
echo "Then open:"
echo "  http://localhost:3000/en/convert-pressure"
echo "  http://localhost:3000/it/converti-pressione"
