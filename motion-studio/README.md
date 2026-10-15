# Motion Studio

Ein Motion-Design-Studio, das Launch-Videos, Produkt-Ads und Showreels komplett in Code rendert.
Kein After Effects. Aufgebaut nach dem Guide „How to Build a Motion Design Studio With Opus 5.5“.

## Wie es funktioniert

Das Modell schreibt keine Videodatei, sondern ein Programm: `index.html` enthält eine Funktion
`window.seek(t)`, die den exakten Frame für jeden Zeitpunkt malt. `render.mjs` ruft sie in einem
Headless-Browser hunderte Male auf, screenshottet jeden Frame und pipet alles in ffmpeg.
Nichts hängt an einem Live-Timer, der Render ist jedes Mal identisch, ein Shot ändern = eine Zeile + Re-Render.

## Dateien

| Datei | Zweck |
|---|---|
| `CLAUDE.md` | House Rules: Render-Vertrag, verbotene Looks, Sound, Kritik-Loop. Gilt für jedes Video in diesem Ordner. |
| `render.mjs` | Renderer: `node render.mjs --fps 60 --dur 15 --sub 4` → `out/silent.mp4` (`--sub 4` = 4 Subframes gemischt = echte Motion Blur) |
| `lib/motion.js` | Closed-form Springs: `spring(t,k,d)`, `track(t, keys)` (ein Spring pro Zielwechsel, gestapelt), seeded noise |
| `beats.py` | Beat-Grid aus einem Track messen: `python3 beats.py audio/song.wav > beats.json` |
| `scripts/music.mjs` | Musik + SFX (click, pop, thump, whoosh, tick, ding) komplett in Code synthetisieren, Cue-Liste aus `cues.json` |
| `scripts/mix.sh` | Ton auf den Render legen, auf -14 LUFS normalisieren → `out/final.mp4` |
| `scripts/review.sh` | Contact Sheet, Glitch-Strip, Phone-Test, Loop-Check, Poster → `out/*.png` |
| `scripts/formats.sh` | 1:1 und 16:9 aus derselben Timeline rendern |
| `docs/prompts/` | Alle Prompt-Vorlagen aus dem Guide (Launch-Video, Referenz, State-Liste, Kritik, Director's Brief) |
| `.claude/skills/motion-reel/SKILL.md` | Skill: `/motion-reel for [URL], 20s, vertical, reference ./refs/frame.png` |
| `index.html` | Aktuelles Video (Showreel-Test, 15 s, 9:16, 120 BPM) |

## Setup

```bash
cd motion-studio
npm install                      # Playwright (Chromium ist in der Cloud-Session vorinstalliert)
pip install numpy librosa soundfile
```

Claude Code auf Opus 5.5 starten und `/model` auf **xhigh** stellen (neue Videos), **max** für große Launches,
**medium** nur für kleine Fixes. Das Default-Medium ist der häufigste Grund für flache erste Versuche.

## Pipeline für ein Video

```bash
node scripts/music.mjs --bpm 120 --dur 15 --cues cues.json   # oder: python3 beats.py audio/track.wav > beats.json
node render.mjs --fps 30 --sub 1 --dur 15 --out out/preview.mp4   # schnelle Vorschau
bash scripts/review.sh out/preview.mp4 4.2                        # Frames ANSCHAUEN, 1-10 bewerten, 3 Probleme fixen
node render.mjs --fps 60 --sub 4 --dur 15                         # finaler Render
bash scripts/mix.sh                                               # → out/final.mp4
bash scripts/formats.sh 15                                        # optional: 1:1 und 16:9
```

## Nächstes Video

Für ein echtes Produkt die Vorlage `docs/prompts/04_product_launch.md` ausfüllen, oder kurz:

```
/motion-reel for https://… , 20s, vertical, reference ./refs/frame.png
```

Voiceover: Key in `.env` (siehe `.env.example`), dann im Prompt nur „the ElevenLabs key is ELEVENLABS_API_KEY in .env“.
