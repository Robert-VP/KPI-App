#!/usr/bin/env bash
# bash scripts/jobalarm.sh — Erklärvideo Job-Alarm in zwei Fassungen (60 fps, Deep House Variante 1 dynamisch, SFX):
#   out/jobalarm_instagram_reel_1080x1920.mp4  Kurzfassung (?v=kurz), 9:16 fürs Instagram-Reel
#   out/jobalarm_linkedin_1080x1350.mp4        LinkedIn-Fassung mit Kapiteln und Untertiteln (Vorlage templates/jobalarm-linkedin), 4:5
#   … und beide zusätzlich mit Melodic Techno wie im Imagefilm: *_melodic_techno.mp4 (MUSIK_NUR=1 mischt nur die Musik neu, ohne Rendern)
# Dauer, Musik-Abschnitte und SFX-Cues kommen aus templates/jobalarm/timeline.mjs.
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/jobalarm
TL=templates/jobalarm-linkedin
read DK SK < <(node --input-type=module -e "import * as m from './$T/timeline.mjs'; import { writeFileSync } from 'node:fs'; writeFileSync('$T/cues_kurz.json', JSON.stringify(m.CUES_KURZ, null, 1)); console.log(m.DUR_KURZ, m.SECTIONS_KURZ);")
read DL SL < <(node --input-type=module -e "import * as m from './$TL/timeline.mjs'; import { writeFileSync } from 'node:fs'; writeFileSync('$TL/cues.json', JSON.stringify(m.CUES, null, 1)); console.log(m.DUR, m.SECTIONS);")
node scripts/music_deephouse.mjs --variant latch --bpm 120 --dur $DL --sections "$SL" --fills --cues $TL/cues.json --out out/music_jobalarm_linkedin.wav
node scripts/music_deephouse.mjs --variant latch --bpm 120 --dur $DK --sections "$SK" --fills --cues $T/cues_kurz.json --out out/music_jobalarm_instagram.wav
node scripts/music_imagefilm.mjs --style techno --dur $DL --sections "$SL" --cues $TL/cues.json --out out/music_jobalarm_linkedin_melodic_techno.wav
node scripts/music_imagefilm.mjs --style techno --dur $DK --sections "$SK" --cues $T/cues_kurz.json --out out/music_jobalarm_instagram_melodic_techno.wav
if [ "${MUSIK_NUR:-}" = 1 ]; then
  bash scripts/mix.sh out/jobalarm_instagram_silent.mp4 out/music_jobalarm_instagram_melodic_techno.wav out/jobalarm_instagram_reel_1080x1920_melodic_techno.mp4
  bash scripts/mix.sh out/jobalarm_linkedin_silent.mp4 out/music_jobalarm_linkedin_melodic_techno.wav out/jobalarm_linkedin_1080x1350_melodic_techno.mp4
  exit 0
fi
( node render.mjs --fps 60 --sub 4 --dur $DK --w 1080 --h 1920 --page $T/index.html --query "?v=kurz" --out out/jobalarm_instagram_silent.mp4 | grep -E "done|error"
  bash scripts/mix.sh out/jobalarm_instagram_silent.mp4 out/music_jobalarm_instagram.wav out/jobalarm_instagram_reel_1080x1920.mp4
  bash scripts/mix.sh out/jobalarm_instagram_silent.mp4 out/music_jobalarm_instagram_melodic_techno.wav out/jobalarm_instagram_reel_1080x1920_melodic_techno.mp4 ) &
( node render.mjs --fps 60 --sub 4 --dur $DL --w 1080 --h 1350 --page $TL/index.html --out out/jobalarm_linkedin_silent.mp4 | grep -E "done|error"
  bash scripts/mix.sh out/jobalarm_linkedin_silent.mp4 out/music_jobalarm_linkedin.wav out/jobalarm_linkedin_1080x1350.mp4
  bash scripts/mix.sh out/jobalarm_linkedin_silent.mp4 out/music_jobalarm_linkedin_melodic_techno.wav out/jobalarm_linkedin_1080x1350_melodic_techno.mp4 ) &
wait
echo "fertig: out/jobalarm_instagram_reel_1080x1920.mp4 ($DK s), out/jobalarm_linkedin_1080x1350.mp4 ($DL s)"
