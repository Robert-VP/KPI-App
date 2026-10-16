#!/usr/bin/env bash
# bash scripts/social.sh jobs/name.js [dur]
# Stellenanzeige als Social-Video: Instagram-Reel 1080x1920 (?safe=reel: Inhalte außerhalb der App-Overlays, ohne QR)
# und LinkedIn-Feed 1080x1350 (4:5, Layout 1:1 wie die Anzeige inkl. QR). 30 fps mit 8 Teilbildern Bewegungsunschärfe,
# AAC 256k, -14 LUFS, faststart. Ausgaben: out/<name>_reel.mp4, out/<name>_linkedin.mp4 und je ein Titelbild.
set -euo pipefail
cd "$(dirname "$0")/.."
JOBF="$1"; DUR="${2:-12}"; T=templates/stellenanzeige; NAME="$(basename "$JOBF" .js)"
node scripts/music.mjs --bpm "${BPM:-120}" --dur "$DUR" --cues "$T/cues.json" --out "out/music_${NAME}.wav" ${MUSIC_ARGS:-}
for spec in "reel 1080 1920 &safe=reel" "linkedin 1080 1350 "; do
  set -- $spec; K=$1; W=$2; H=$3; X="${4:-}"
  node render.mjs --fps 30 --sub 8 --dur "$DUR" --w "$W" --h "$H" --page "$T/index.html" --query "?job=$JOBF$X" --out "out/${NAME}_${K}_silent.mp4"
  bash scripts/mix.sh "out/${NAME}_${K}_silent.mp4" "out/music_${NAME}.wav" "out/${NAME}_${K}.mp4"
  ffmpeg -y -loglevel error -sseof -0.1 -i "out/${NAME}_${K}.mp4" -frames:v 1 -update 1 "out/${NAME}_${K}_titelbild.png"
done
echo "fertig: out/${NAME}_reel.mp4 out/${NAME}_linkedin.mp4"
