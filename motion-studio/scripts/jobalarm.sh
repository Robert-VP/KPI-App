#!/usr/bin/env bash
# bash scripts/jobalarm.sh — Erklärvideo Job-Alarm in zwei Fassungen (60 fps, Deep House Variante 1 dynamisch, SFX):
#   out/jobalarm_instagram_reel_1080x1920.mp4  Kurzfassung (?v=kurz), 9:16 fürs Instagram-Reel
#   out/jobalarm_linkedin_1080x1350.mp4        lange Fassung, 4:5 für den LinkedIn-Feed
# Dauer, Musik-Abschnitte und SFX-Cues kommen aus templates/jobalarm/timeline.mjs.
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/jobalarm
read DL SL DK SK < <(node --input-type=module -e "import * as m from './$T/timeline.mjs'; import { writeFileSync } from 'node:fs'; writeFileSync('$T/cues.json', JSON.stringify(m.CUES, null, 1)); writeFileSync('$T/cues_kurz.json', JSON.stringify(m.CUES_KURZ, null, 1)); console.log(m.DUR, m.SECTIONS, m.DUR_KURZ, m.SECTIONS_KURZ);")
node scripts/music_deephouse.mjs --variant latch --bpm 120 --dur $DL --sections "$SL" --fills --cues $T/cues.json --out out/music_jobalarm_linkedin.wav
node scripts/music_deephouse.mjs --variant latch --bpm 120 --dur $DK --sections "$SK" --fills --cues $T/cues_kurz.json --out out/music_jobalarm_instagram.wav
( node render.mjs --fps 60 --sub 4 --dur $DK --w 1080 --h 1920 --page $T/index.html --query "?v=kurz" --out out/jobalarm_instagram_silent.mp4 | grep -E "done|error"
  bash scripts/mix.sh out/jobalarm_instagram_silent.mp4 out/music_jobalarm_instagram.wav out/jobalarm_instagram_reel_1080x1920.mp4 ) &
( node render.mjs --fps 60 --sub 4 --dur $DL --w 1080 --h 1350 --page $T/index.html --out out/jobalarm_linkedin_silent.mp4 | grep -E "done|error"
  bash scripts/mix.sh out/jobalarm_linkedin_silent.mp4 out/music_jobalarm_linkedin.wav out/jobalarm_linkedin_1080x1350.mp4 ) &
wait
echo "fertig: out/jobalarm_instagram_reel_1080x1920.mp4 ($DK s), out/jobalarm_linkedin_1080x1350.mp4 ($DL s)"
