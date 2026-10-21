#!/usr/bin/env bash
# bash scripts/review.sh [video] [fast-moment-seconds]
# Turns a video into images Claude can review: contact sheet, glitch strip, phone test, loop check.
set -euo pipefail
V="${1:-out/final.mp4}"
T="${2:-4.2}"
mkdir -p out
# Contact sheet: 2 frames per second, 6 across
ffmpeg -y -loglevel error -i "$V" -vf "fps=2,scale=270:-1,tile=6x5" -frames:v 1 out/contact.png
# Strip: 12 frames around a fast moment, to catch glitches
ffmpeg -y -loglevel error -ss "$(python3 -c "print(max(0,$T-0.1))")" -i "$V" -vf "scale=320:-1,tile=12x1" -frames:v 1 out/strip.png
# Phone test: how it reads at 360px wide
ffmpeg -y -loglevel error -i "$V" -vf "fps=1,scale=360:-1,tile=5x3" -frames:v 1 out/phone.png
# Loop check: play it twice and watch the seam
ffmpeg -y -loglevel error -stream_loop 1 -i "$V" -c copy out/loop_check.mp4
# Poster frame at 1s
ffmpeg -y -loglevel error -ss 1 -i "$V" -frames:v 1 out/poster.png
echo "wrote out/contact.png out/strip.png out/phone.png out/loop_check.mp4 out/poster.png"
