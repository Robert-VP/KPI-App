#!/usr/bin/env bash
# bash scripts/imagefilm.sh — Imagefilm Voß & Partner (104 s, 60 fps, mit Logo-Intro) in 16:9 und 4:5, Musik Deep House mit wechselnder Stimmung.
#   out/imagefilm_voss_partner_16x9.mp4            Website, Präsentationen, YouTube
#   out/imagefilm_voss_partner_4x5_linkedin.mp4    LinkedIn-Feed
# Jedes Format wird in Abschnitten von 24 s gerendert (fertige Abschnitte werden übersprungen) und dann zusammengefügt.
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/imagefilm
read DUR SEC < <(node --input-type=module -e "import * as m from './$T/timeline.mjs'; import { writeFileSync } from 'node:fs'; writeFileSync('$T/cues.json', JSON.stringify(m.CUES, null, 1)); console.log(m.DUR, m.SECTIONS);")
node scripts/music_deephouse.mjs --variant latch --bpm 120 --dur $DUR --sections "$SEC" --fills --cues $T/cues.json --out out/music_imagefilm.wav
render() {   # $1 = BxH, $2 = Name
  local f=$1 name=$2 W=${1%x*} H=${1#*x} list=out/imagefilm_${1}_parts.txt; : > $list
  for st in $(seq 0 24 $((DUR - 1))); do local d=$(( DUR - st < 24 ? DUR - st : 24 )); local p=out/imagefilm_${f}_part$st.mp4
    ffprobe -v error $p >/dev/null 2>&1 || node render.mjs --fps 60 --sub 4 --start $st --dur $d --w $W --h $H --page $T/index.html --out $p | grep -E "done|error"
    echo "file '$(basename $p)'" >> $list; done
  ffmpeg -v error -y -f concat -safe 0 -i $list -c copy out/imagefilm_${f}_silent.mp4
  bash scripts/mix.sh out/imagefilm_${f}_silent.mp4 out/music_imagefilm.wav out/$name
}
render 1920x1080 imagefilm_voss_partner_16x9.mp4 &
render 1080x1350 imagefilm_voss_partner_4x5_linkedin.mp4 &
wait
echo "fertig: out/imagefilm_voss_partner_16x9.mp4, out/imagefilm_voss_partner_4x5_linkedin.mp4 ($DUR s)"
