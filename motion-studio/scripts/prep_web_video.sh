#!/usr/bin/env bash
# bash scripts/prep_web_video.sh [/pfad/zu/hero-factory.mp4]
# Zerlegt das Hero-Video von voss-partner.de in JPG-Einzelbilder (30 fps) für die Film-Vorlagen.
# Die Bilder landen in assets/web/hero/ (nicht versioniert). Quelle: Website-Repository Benyesman/Voss.
set -euo pipefail
SRC="${1:-/home/user/voss/assets/video/hero-factory.mp4}"
OUT=assets/web/hero
mkdir -p "$OUT"
ffmpeg -y -loglevel error -i "$SRC" -vf "fps=30" -q:v 3 "$OUT/%04d.jpg"
ls "$OUT" | wc -l | xargs echo "frames:"
