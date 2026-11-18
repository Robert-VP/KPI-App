#!/usr/bin/env bash
# bash scripts/jobalarm_gta_v3.sh — Job-Alarm-Reel Fassung 3: Kamerafahrt über das Plakat mit den zwei Figuren (templates/jobalarm-gta-v3),
# gleiche Synthwave-Musik → out/jobalarm_reel_gta-style_v3_figuren_1080x1920.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/jobalarm-gta-v3
DUR=$(node --input-type=module -e "import { DUR } from './$T/timeline.mjs'; console.log(DUR)")
node scripts/music_synthwave.mjs --timeline $T/timeline.mjs --out out/music_jobalarm_gta_v3.wav
node render.mjs --fps 60 --sub 4 --dur $DUR --w 1080 --h 1920 --page $T/index.html --out out/jobalarm_gta_v3_silent.mp4 | grep -E "done|error" || true
bash scripts/mix.sh out/jobalarm_gta_v3_silent.mp4 out/music_jobalarm_gta_v3.wav out/jobalarm_reel_gta-style_v3_figuren_1080x1920.mp4
echo "fertig: out/jobalarm_reel_gta-style_v3_figuren_1080x1920.mp4 ($DUR s)"
