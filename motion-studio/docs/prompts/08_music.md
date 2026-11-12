# Musik

Eigener Track: `python3 beats.py audio/song.wav > beats.json`
Die Animation liest beats.json: Screen-Wechsel auf beats, große Momente auf downbeats, SFX auf hits.

Kein Track:
```
Synthesize original music at 120 BPM in code, plus click, pop, thump, and whoosh sound effects.
Write a cue list of every sound effect timed to the beat grid, mix it all to -14 LUFS,
and combine it with out/silent.mp4 into out/final.mp4.
```
Vorlage: `node scripts/music.mjs --bpm 120 --dur 15 --cues cues.json` → out/music.wav, beats.json
