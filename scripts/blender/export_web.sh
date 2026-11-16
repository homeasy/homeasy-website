#!/usr/bin/env bash
# Copies Blender renders into public/hero for the website, recompressing JPEGs for the web.
# Usage: bash scripts/blender/export_web.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
SRC=assets-source/blender/renders
DST=public/hero
for set in desktop mobile switch; do
  [ -d "$SRC/$set" ] || continue
  mkdir -p "$DST/$set"
  for f in "$SRC/$set"/*; do
    name=$(basename "$f")
    case "$name" in
      *.jpg) sips -s format jpeg -s formatOptions 80 "$f" --out "$DST/$set/$name" >/dev/null ;;
      *) cp "$f" "$DST/$set/$name" ;;
    esac
  done
done
du -sh "$DST"/* 2>/dev/null
