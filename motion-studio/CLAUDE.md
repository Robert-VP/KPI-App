# Motion studio rules

## Render contract
- Every film is a pure function of time: window.seek(t) paints frame t.
- No CSS transitions, no setTimeout, no requestAnimationFrame in render mode,
  no state carried between frames. Seeded noise only, never Math.random.
- Render with `node render.mjs`. Encode H.264 yuv420p, CRF 16.
- The page is one HTML file (index.html) with one canvas `#c` and `window.seek(t)`.
- Use closed-form springs from lib/motion.js. Any value with more than one target uses `track()`.
  Tiny overshoot on UI, none on type.

## Look
- Banned: centered title on a gradient, everything fading in,
  corner labels and frame borders, glow on UI, generic particle bursts.
- One display font, one UI font. One accent color unless the brief says otherwise.
- Every 2 to 4 seconds something new must happen on screen.

## Sound
- Music and sound effects are synthesized in code unless a track is supplied.
- Place hits on the measured beat grid (beats.json). Loudness -14 LUFS.
- Music: `node scripts/music.mjs` → out/music.wav. Beat grid: `python3 beats.py <track> > beats.json`.
- Mix: `bash scripts/mix.sh` → out/final.mp4 (loudnorm to -14 LUFS).

## Loop before you show me anything
1. Render one frame per beat as a contact sheet (`bash scripts/review.sh`) and LOOK at it.
2. Score it 1-10 on: hook in first 2s, readability at phone size,
   motion quality, variety, brand accuracy, sound sync.
3. Fix the 3 worst problems. Repeat until every score is 8+.
4. Only then do the full render.

## Repo notes
- Headless Chromium is pre-installed for Playwright (PLAYWRIGHT_BROWSERS_PATH). Never run `playwright install`.
- Quick preview: `node render.mjs --fps 30 --sub 1 --dur 15` (fast). Final: `node render.mjs --fps 60 --sub 4`.
- Keep real product assets in ./assets, references in ./refs, music in ./audio, docs in ./docs.
