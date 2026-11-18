#!/usr/bin/env bash
# bash scripts/jobalarm_trailer.sh — Job-Alarm-Trailer im Stil der GTA-VI-Trailer (templates/jobalarm-trailer), 9:16, 60 fps,
# Musik A: eigene 80er-Rockballade (scripts/music_trailer.mjs --style rock) → out/jobalarm_trailer_1080x1920.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/jobalarm-trailer
DUR=$(node --input-type=module -e "import { DUR } from './$T/timeline.mjs'; console.log(DUR.toFixed(3))")
node scripts/music_trailer.mjs --style rock --timeline $T/timeline.mjs --out out/music_jobalarm_trailer.wav
node render.mjs --fps 60 --sub 4 --dur $DUR --w 1080 --h 1920 --page $T/index.html --out out/jobalarm_trailer_silent.mp4 | grep -E "done|error" || true
bash scripts/mix.sh out/jobalarm_trailer_silent.mp4 out/music_jobalarm_trailer.wav out/jobalarm_trailer_1080x1920.mp4
echo "fertig: out/jobalarm_trailer_1080x1920.mp4 ($DUR s)"
