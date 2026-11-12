#!/usr/bin/env bash
# bash scripts/imagefilm_musik.sh — Imagefilm mit drei alternativen Musiken, Bild unverändert (nutzt die stummen Renderings aus imagefilm.sh).
#   out/imagefilm_voss_partner_16x9_1_episch.mp4               (und _4x5_linkedin_1_episch.mp4)
#   out/imagefilm_voss_partner_16x9_3_melodic_techno.mp4       (und _4x5_linkedin_3_melodic_techno.mp4)
#   out/imagefilm_voss_partner_16x9_4_episch_deephouse.mp4     (und _4x5_linkedin_4_episch_deephouse.mp4)
set -euo pipefail
cd "$(dirname "$0")/.."
T=templates/imagefilm
for f in out/imagefilm_1920x1080_silent.mp4 out/imagefilm_1080x1350_silent.mp4; do [ -f $f ] || { echo "fehlt: $f (erst bash scripts/imagefilm.sh)"; exit 1; }; done
read DUR SEC < <(node --input-type=module -e "import * as m from './$T/timeline.mjs'; console.log(m.DUR, m.SECTIONS);")
node scripts/music_deephouse.mjs --variant latch --bpm 120 --dur $DUR --sections "$SEC" --fills --out out/music_imagefilm_groove.wav
node scripts/music_imagefilm.mjs --style epic --out out/music_imagefilm_1_episch.wav &
node scripts/music_imagefilm.mjs --style techno --out out/music_imagefilm_3_melodic_techno.wav &
node scripts/music_imagefilm.mjs --style hybrid --groove out/music_imagefilm_groove.wav --out out/music_imagefilm_4_episch_deephouse.wav &
wait
for m in 1_episch 3_melodic_techno 4_episch_deephouse; do
  bash scripts/mix.sh out/imagefilm_1920x1080_silent.mp4 out/music_imagefilm_$m.wav out/imagefilm_voss_partner_16x9_$m.mp4 &
  bash scripts/mix.sh out/imagefilm_1080x1350_silent.mp4 out/music_imagefilm_$m.wav out/imagefilm_voss_partner_4x5_linkedin_$m.mp4 &
done
wait
