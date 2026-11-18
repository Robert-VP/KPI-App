#!/usr/bin/env bash
# bash scripts/anzeige.sh [templates/stellenanzeige] [dur] [fast|""] [jobs/name.js]
# Ohne Job-Datei wird job.js der Vorlage genutzt; mit Job-Datei heißen die Ausgaben out/anzeige_<name>_<format>.mp4
# Musik: MUSIC_SCRIPT=scripts/music_deephouse.mjs MUSIC_ARGS="--variant latch" für Deep House (Variante 1, soulful mit Orgel).
# Rendert eine Stellenanzeige als Video in 9:16, 4:5 und 1:1 aus derselben Timeline, mit Musik und SFX.
set -euo pipefail
T="${1:-templates/stellenanzeige}"; DUR="${2:-12}"; FAST="${3:-}"; JOBF="${4:-}"
QUERY=""; NAME="anzeige"; if [ -n "$JOBF" ]; then QUERY="?job=$JOBF"; NAME="anzeige_$(basename "$JOBF" .js)"; fi
Q="--fps 60 --sub 4"; [ -n "$FAST" ] && Q="--fps 30 --sub 1"
node "${MUSIC_SCRIPT:-scripts/music.mjs}" --bpm "${BPM:-120}" --dur "$DUR" --cues "$T/cues.json" --out out/music.wav ${MUSIC_ARGS:-}
for f in 1080x1920 1080x1350 1080x1080; do
  W=${f%x*}; H=${f#*x}
  node render.mjs $Q --dur "$DUR" --w "$W" --h "$H" --page "$T/index.html" --query "$QUERY" --out "out/${NAME}_${f}_silent.mp4"
  bash scripts/mix.sh "out/${NAME}_${f}_silent.mp4" out/music.wav "out/${NAME}_${f}.mp4"
done
ffmpeg -y -loglevel error -sseof -0.1 -i "out/${NAME}_1080x1920.mp4" -frames:v 1 -update 1 "out/${NAME}_poster.png"
echo "fertig: out/${NAME}_1080x1920.mp4 out/${NAME}_1080x1350.mp4 out/${NAME}_1080x1080.mp4"
