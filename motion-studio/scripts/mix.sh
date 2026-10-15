#!/usr/bin/env bash
# bash scripts/mix.sh [silent.mp4] [music.wav] [final.mp4]
# Mixes audio onto the silent render, normalizes to -14 LUFS, writes final.mp4.
set -euo pipefail
V="${1:-out/silent.mp4}"
A="${2:-out/music.wav}"
O="${3:-out/final.mp4}"
ffmpeg -y -loglevel error -i "$V" -i "$A" -map 0:v -map 1:a \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
  -c:v copy -c:a aac -b:a 192k -shortest "$O"
echo "wrote $O"
