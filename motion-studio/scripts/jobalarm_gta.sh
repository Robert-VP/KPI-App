#!/usr/bin/env bash
# bash scripts/jobalarm_gta.sh — Job-Alarm-Reel im Neon-Look der 80er nach dem Plakat (templates/jobalarm-gta), 9:16, 60 fps,
# eigene Synthwave-Musik (scripts/music_synthwave.mjs) → out/jobalarm_reel_gta-style_1080x1920.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/jobalarm-gta
DUR=$(node --input-type=module -e "import { DUR } from './$T/timeline.mjs'; console.log(DUR)")
node scripts/music_synthwave.mjs --timeline $T/timeline.mjs --out out/music_jobalarm_gta.wav
node render.mjs --fps 60 --sub 4 --dur $DUR --w 1080 --h 1920 --page $T/index.html --out out/jobalarm_gta_silent.mp4 | grep -E "done|error" || true
bash scripts/mix.sh out/jobalarm_gta_silent.mp4 out/music_jobalarm_gta.wav out/jobalarm_reel_gta-style_1080x1920.mp4
echo "fertig: out/jobalarm_reel_gta-style_1080x1920.mp4 ($DUR s)"
