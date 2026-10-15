#!/usr/bin/env bash
# bash scripts/mix.sh [silent.mp4] [music.wav] [final.mp4]
# Mixes audio onto the silent render with two-pass loudnorm to -14 LUFS (TP -1.5 dB), writes final.mp4.
set -euo pipefail
V="${1:-out/silent.mp4}"
A="${2:-out/music.wav}"
O="${3:-out/final.mp4}"
# gentle bus compression tames the transients so linear loudnorm can reach -14 without clipping
PRE="acompressor=threshold=-14dB:ratio=3:attack=4:release=90:makeup=2,alimiter=limit=0.5:attack=2:release=60:level=false"
# pass 1: measure
M=$(ffmpeg -i "$A" -af "$PRE,loudnorm=I=-14:TP=-2.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
LN="$PRE,loudnorm=I=-14:TP=-2.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=0.79:attack=1:release=50:level=false"   # Sicherheits-Limiter: Spitzen unter -2 dBFS
# pass 2: apply
ffmpeg -y -loglevel error -i "$V" -i "$A" -map 0:v -map 1:a -af "$LN" \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest "$O"
echo "wrote $O"
ffmpeg -i "$O" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak" | sed 's/Input/  final/'
