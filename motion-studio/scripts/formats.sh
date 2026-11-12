#!/usr/bin/env bash
# bash scripts/formats.sh [dur]
# Renders 1:1 and 16:9 from the same timeline (index.html must read the canvas size), then mixes audio.
set -euo pipefail
DUR="${1:-15}"
node render.mjs --fps 60 --sub 4 --dur "$DUR" --w 1080 --h 1080 --out out/silent_1x1.mp4
bash scripts/mix.sh out/silent_1x1.mp4 out/music.wav out/final_1x1.mp4
node render.mjs --fps 60 --sub 4 --dur "$DUR" --w 1920 --h 1080 --out out/silent_16x9.mp4
bash scripts/mix.sh out/silent_16x9.mp4 out/music.wav out/final_16x9.mp4
