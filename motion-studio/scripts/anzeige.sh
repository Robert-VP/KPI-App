#!/usr/bin/env bash
# bash scripts/anzeige.sh [templates/stellenanzeige] [dur] [fast]
# Rendert eine Stellenanzeige als Video in 9:16, 4:5 und 1:1 aus derselben Timeline, mit Musik und SFX.
set -euo pipefail
T="${1:-templates/stellenanzeige}"; DUR="${2:-12}"; FAST="${3:-}"
Q="--fps 60 --sub 4"; [ -n "$FAST" ] && Q="--fps 30 --sub 1"
node scripts/music.mjs --bpm 120 --dur "$DUR" --cues "$T/cues.json" --out out/music.wav
for f in 1080x1920 1080x1350 1080x1080; do
  W=${f%x*}; H=${f#*x}
  node render.mjs $Q --dur "$DUR" --w "$W" --h "$H" --page "$T/index.html" --out "out/anzeige_${f}_silent.mp4"
  bash scripts/mix.sh "out/anzeige_${f}_silent.mp4" out/music.wav "out/anzeige_${f}.mp4"
done
ffmpeg -y -loglevel error -sseof -0.1 -i out/anzeige_1080x1920.mp4 -frames:v 1 -update 1 out/anzeige_poster.png
echo "fertig: out/anzeige_1080x1920.mp4 out/anzeige_1080x1350.mp4 out/anzeige_1080x1080.mp4"
