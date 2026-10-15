# Review log — showreel test (index.html, 15 s, 9:16)

## Round 1 (preview 30 fps)
Scores: hook 8 · phone readability 7 · motion 7 · variety 9 · brand n/a · sound sync 8
Biggest problems:
1. 2.5–2.9 s and 7.4 s: accent→ink colour lerp passes through muddy brown (tiles, card). Fix: hard switch on the beat.
2. 9.5–12 s: carousel words at the cylinder edge squash into a thin line (looks like a glitch). Fix: cull below z=0.22.
3. 12–14.5 s: accent square overlaps the S of STUDIO. Fix: 220 px type, square moved left.
4. 14.85–14.95 s: crushed lockup still visible right before the loop seam. Fix: hide text at 0.2 s into the crush, line gone by 14.9 s.

## Round 2 (preview 30 fps)
Scores: hook 8 · phone readability 8 · motion 8 · variety 9 · brand n/a · sound sync 8
All four fixed. Seam frames 14.9 s and 0.0 s are both blank paper + dot grid. Go for the full render.

## Would improve next
- Loader bar step timing could hit the 16ths harder (tick SFX are on them, motion is slightly behind).
- A real product would replace the "RENDER STATS" card with real UI crops (see docs/prompts/04_product_launch.md).
