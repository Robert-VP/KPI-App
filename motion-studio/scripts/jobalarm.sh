#!/usr/bin/env bash
# bash scripts/jobalarm.sh — Erklärvideo Job-Alarm in 9:16, 4:5 und 1:1 (32 s, 60 fps) mit Deep House (Variante 1) und SFX.
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/jobalarm
node --input-type=module -e "import { CUES } from './$T/timeline.mjs'; import { writeFileSync } from 'node:fs'; writeFileSync('$T/cues.json', JSON.stringify(CUES, null, 1));"
node scripts/music_deephouse.mjs --variant latch --bpm 120 --dur 32 --sections "0:intro,4:full,20:perc,36:lift,48:full,60:outro" --cues $T/cues.json --out out/music_jobalarm.wav
for f in 1080x1920 1080x1350 1080x1080; do
  ( node render.mjs --fps 60 --sub 4 --dur 32 --w ${f%x*} --h ${f#*x} --page $T/index.html --out out/jobalarm_${f}_silent.mp4 | grep -E "done|error"
    bash scripts/mix.sh out/jobalarm_${f}_silent.mp4 out/music_jobalarm.wav out/jobalarm_erklaervideo_${f}.mp4 ) &
done
wait
ffmpeg -y -loglevel error -sseof -0.1 -i out/jobalarm_erklaervideo_1080x1350.mp4 -frames:v 1 -update 1 out/jobalarm_poster.png
echo "fertig: out/jobalarm_erklaervideo_{1080x1920,1080x1350,1080x1080}.mp4"
