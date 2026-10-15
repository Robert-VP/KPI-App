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

## Round 3 (final 60 fps, 4 subframes, mixed)
Scores: hook 8 · phone readability 8 · motion 8 · variety 9 · brand n/a · sound sync 8
- Strip at 2.5–2.9 s: tile split shows clean blended motion blur, no tearing.
- Phone sheet: every line readable at 360 px wide, including the mono captions.
- Loudness: -14.1 LUFS integrated, true peak -0.7 dBTP (two-pass loudnorm with bus compressor + limiter).

# Review log — Stellenanzeige als Video (templates/stellenanzeige, 12 s, 9:16)

## Round 1 (preview 30 fps)
Scores: hook 7 · phone readability 9 · motion 8 · variety 6 · brand accuracy 10 · sound sync 8
- Last frame vs. the generator's real PNG export (same seed, same texts): identical layout, motif, band, QR.
- Problem: 7.5–12 s dead (4.5 s without a new event). Fix: pill pulse at 8.5 s, QR bob at 10 s, bell rings at 11 s, cues added.

## Round 2 (preview 30 fps)
Scores: hook 7 · phone readability 9 · motion 8 · variety 8 · brand accuracy 10 · sound sync 8
Hold phase now has a beat-timed event every 1.5 s. Go for the full render in 9:16, 4:5, 1:1.

## Delivered (final 60 fps, 4 subframes, -14.1 LUFS)
- Leiter Supply Chain Management (CI reference), Außendienstmitarbeiter, Leiter Controlling: 9:16, 4:5, 1:1 each.
- Recruiter (m/w/d) in eigener Sache: second text layer (bullets + highlight pill) 8.0–10.5 s, people motif. Contact sheet checked: swap completes, last frame = plain ad.

# Review log — Recruiter-Film (templates/recruiter-film, 20 s, 9:16)

## Round 1 (preview 30 fps)
Scores: hook 4 · phone readability 7 · motion 8 · variety 9 · brand accuracy 9 · sound sync 8
1. Hook clipped at the right edge (font too large). Fix: four short lines, auto-fit to width.
2. Phone rings linger as faint circles until the end. Fix: rings live for 1 s only.
3. Gold figures too small at phone size. Fix: 1.85× instead of 1.45×.

## Round 2 (frames at 0.6, 1.7, 4, 6.8, 8.6, 10.2, 17, 19.5 s)
Scores: hook 8 · phone readability 8 · motion 8 · variety 9 · brand accuracy 9 · sound sync 8
Hook fits, cone search and call read as scripted, ad block and footer identical to the template. Go for the full render.

## Final (60 fps, 4 subframes, calm music, -14.1 LUFS, TP -3.3 dBTP)
Delivered as out/film_recruiter_1080x1920.mp4, _1080x1350.mp4, _1080x1080.mp4. Contact sheet matches the script: hook fits, cone search, gold figures, call line and three words, ad builds, pill states, footer, gold figure in the motif at 19 s. No QR, no job alarm.

## Version 2 (28 s, growth story + crosshair) — frames at 1.7, 5.2, 8.4, 10.0, 10.7, 13.6, 15.5, 16.5, 18.9, 22.0, 24.6, 27.9 s
Scores: hook 8 · phone readability 8 · motion 9 · variety 10 · brand accuracy 9 · sound sync 8
Every 1.5–3 s a new idea. Crosshair scan, customers, three growth lines with distinct motion, lock-on on the open slot, ad end frame identical to the template. Go for the full render.

## Version 3 (36 s, end sequence) — frames at 25.5, 26.7, 28.4, 30.9, 32.2, 32.85, 33.4, 35.9 s
1. Pixel box measured with regular weight, but the number is bold once highlighted: digits 025 and 77 stayed readable. Fix: measure bold, coverage threshold 0.04. Re-check at 33.0 and 35.9 s: number fully covered.
Scores: hook 8 · phone readability 8 · motion 9 · variety 10 · brand accuracy 9 · sound sync 8. Go for the full render.

## Version 3 final (60 fps, 4 subframes, calm music, -14.0 LUFS, TP -1.8 dBTP, 36.0 s)
Delivered as out/film_recruiter_v3_1080x1920.mp4, _1080x1350.mp4, _1080x1080.mp4. Contact sheet at 1 fps checked end to end: every shot as scripted, phone number covered from 33 s to the last frame.

# Review log — Recruiter-Film Version 4 (dynamisch, 33 s, 128 BPM)
Frames checked: 28 across the film in 9:16, 12 in 1:1.
Scores: hook 9 · phone readability 8 · motion 9 · variety 10 · brand accuracy 9 · sound sync 8
Contrast cuts land on the beat, zoom-through reads as one move, flash cards readable at one beat each, ad end and pixelated number unchanged. 1:1 type scales correctly. Go for the full render.

## Version 4 final (60 fps, 4 subframes, 128 BPM, 33.0 s)
First mix hit +1.9 dBTP (dense 128-BPM drums). Fix in scripts/mix.sh: safety limiter after loudnorm (limit -2 dBFS). Remixed from the silent renders: -14.1 LUFS, -0.4 dBTP.
Contact sheet at 1 fps checked end to end: cuts, zoom-through, iris, wipe, growth, lock-on, flash cards, ad, Q&A, pixelated number all as scripted.

# Review log — Recruiter-Film Version 5 (100 s, 120 BPM ruhig)
Frames at every hold start and hold end (34 frames, 9:16) and 10 frames in 1:1: every statement fully built at hold start and still complete at hold end.
1. Variable name clash with the reused end section (ebS) stopped the page. Fix: renamed.
2. 1:1: first gold figure partly under the logo. Fix: gold targets start below the logo.

# Review log — Recruiter-Film Version 6 (66,5 s)
1. Typography check on v5 crops: line advance 1.08 made descenders touch the next line (Ansprechen/Überzeugen, Möglichkeiten/persönlichen) and the underline sat on „in Ahlen“. Fix: baseline step 0.24 × previous + 0.96 × current size (1.2), letter spacing 0, underline at +0.11 em, larger masks.
2. Name clash blockH (ad slice) – renamed to lineBlockH.
3. 27 frames at every hold start and end: each statement complete for its full window, no empty transitions longer than 0.8 s.

# Review log — Recruiter-Film Version 7 (71 s, 128 BPM)
27 frames (9:16) at hold starts/ends and wipes, 10 frames in 1:1.
1. Gold twinkles of the navy stage landed next to text and on the logo. Fix: no twinkles and dimmed texture inside text areas and the logo corner.
2. Underline under „gesucht!“ cut through the g descender. Fix: underline at +0.3 em for lines with descenders.
