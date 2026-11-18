#!/usr/bin/env bash
# bash scripts/mix.sh [silent.mp4] [music.wav] [final.mp4]
# Mixes audio onto the silent render with two-pass loudnorm to -14 LUFS (true peak under -1 dBTP; AAC 256k with an 18 kHz cutoff overshoots far less than 192k full band), writes final.mp4.
set -euo pipefail
V="${1:-out/silent.mp4}"
A="${2:-out/music.wav}"
O="${3:-out/final.mp4}"
# gentle bus compression tames the transients so linear loudnorm can reach -14 without clipping
PRE="acompressor=threshold=-14dB:ratio=3:attack=4:release=90:makeup=2,alimiter=limit=0.5:attack=2:release=60:level=false"
# pass 1: measure
M=$(ffmpeg -i "$A" -af "$PRE,loudnorm=I=-14:TP=-2.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
LN="$PRE,loudnorm=I=-14:TP=-2.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=0.79:attack=1:release=50:level=false,aresample=192000,alimiter=limit=0.63:attack=0.5:release=40:level=false,aresample=48000"   # Sicherheits-Limiter, zweiter Limiter 4x überabgetastet gegen Inter-Sample-Spitzen
# pass 2: apply
ffmpeg -y -loglevel error -i "$V" -i "$A" -map 0:v -map 1:a -af "$LN" \
  -c:v copy -c:a aac -b:a 256k -cutoff 18000 -ar 48000 -shortest -movflags +faststart "$O"
echo "wrote $O"
ffmpeg -i "$O" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak" | sed 's/Input/  final/'
