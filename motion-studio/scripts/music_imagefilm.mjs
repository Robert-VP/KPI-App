// node scripts/music_imagefilm.mjs --style epic|techno|hybrid [--groove out/music_imagefilm_groove.wav] [--out out/x.wav] [--sfxgain 0.5]
// Alternative Musiken für den Imagefilm, komplett im Code synthetisiert (lizenzfrei, deterministisch).
// Der Ablauf folgt den Kapiteln aus templates/imagefilm/timeline.mjs (Wechsel auf dem Raster der Mosaik-Übergänge), die SFX der Vorlage werden dazugemischt.
//   epic    1 · Episch, Richtung Hans Zimmer: Streicher-Ostinato, Hörner-Thema, Kriegstrommeln, Pauken, Chor, Solostimme, D-Moll, Schluss in D-Dur
//   techno  3 · Melodic Techno: rollender Bass, Arpeggio, große Lead-Melodie zur Auszeichnung, A-Moll, Schluss in A-Dur
//   hybrid  4 · Episch + Deep House: Intro, Auszeichnung und Outro episch (A-Moll), dazwischen der Deep-House-Groove aus --groove
// Klang-Logo in allen drei: drei Glockentöne (Quinte unten, Grundton, Terz) beim Logo im Intro, im Outro nach Dur aufgelöst.
import { writeFileSync, readFileSync } from 'node:fs';
import * as TL from '../templates/imagefilm/timeline.mjs';

const argv = process.argv;
const sarg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : d; };
const STYLE = sarg('style', 'epic'), OUT = sarg('out', `out/music_imagefilm_${STYLE}.wav`), SG = Number(sarg('sfxgain', 0.5));
if (!['epic', 'techno', 'hybrid'].includes(STYLE)) throw new Error('unknown style ' + STYLE);
const BPM = TL.BPM, DUR = TL.DUR, SR = 48000, N = Math.round(DUR * SR), TAU = Math.PI * 2;
const beat = 60 / BPM, step = beat / 4, BAR = beat * 4;
const G = {}; TL.SCENES.forEach((s, i) => { G[s] = i === 0 ? 0 : TL.WIPES[i - 1]; });   // Kapitelgrenzen = Beginn des Mosaik-Wechsels
const NEXT = (s) => { const i = TL.SCENES.indexOf(s); return i + 1 < TL.SCENES.length ? G[TL.SCENES[i + 1]] : DUR; };
const S0 = (s) => TL.sceneStart(TL.SCENES.indexOf(s));
const LOGO = { intro: [0.45, 0.8, 1.2], outro: [0.3, 0.65, 1.0] };   // Klang-Logo: Logo erscheint, dritter Ton mit der Zeile darunter
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = 23;
const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;

/* ---------- Busse ---------- */
const bus = () => [new Float32Array(N), new Float32Array(N)];
const DRY = bus(), MUS = bus(), REV = bus(), DLY = bus(), SFX = bus();   // MUS wird beim Techno von der Kick geduckt
const out = (b, pan, g) => ({ b, gl: g * Math.cos((pan + 1) * Math.PI / 4), gr: g * Math.sin((pan + 1) * Math.PI / 4) });
function voice(t0, len, fn, outs) {
  const i0 = Math.max(0, Math.round(t0 * SR)), i1 = Math.min(N, Math.round((t0 + len) * SR));
  for (let i = i0; i < i1; i++) { const v = fn((i - i0) / SR); if (v === 0) continue; for (const o of outs) { o.b[0][i] += v * o.gl; o.b[1][i] += v * o.gr; } }
}
const bars = (t0, t1, fn) => { for (let b = t0, k = 0; b < t1 - 1e-6; b += BAR, k++) fn(b, k); };

/* ---------- DSP-Bausteine ---------- */
function svf() {   // Zavalishin-TPT-SVF, stabil bei modulierter Frequenz
  let ic1 = 0, ic2 = 0; const o = { lp: 0, bp: 0, hp: 0 };
  o.run = (x, fc, q) => { const g = Math.tan(Math.PI * Math.min(fc, SR * 0.45) / SR), k = 1 / q; const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
    const v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3; ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2; o.lp = v2; o.bp = v1; o.hp = x - k * v1 - v2; return v2; };
  return o;
}
const blep = (p, dt) => { if (p < dt) { p /= dt; return p + p - p * p - 1; } if (p > 1 - dt) { p = (p - 1) / dt; return p * p + p + p + 1; } return 0; };
function saw(f) { let p = rnd(); const dt = f / SR; return () => { p += dt; if (p >= 1) p -= 1; return 2 * p - 1 - blep(p, dt); }; }
function vsaw(fq, vib, rate) {   // Sägezahn mit Vibrato, das nach 0,3 s einsetzt
  let p = rnd(), t = 0; return () => { t += 1 / SR; const dt = fq * (1 + vib * Math.sin(TAU * rate * t) * Math.min(1, Math.max(0, t - 0.3) * 2)) / SR; p += dt; if (p >= 1) p -= 1; return 2 * p - 1 - blep(p, dt); };
}
const adsr = (t, a, d, s, len, r) => { let v; if (t < a) v = t / a; else if (t < a + d) v = 1 - (1 - s) * (t - a) / d; else v = s; if (t > len) v *= Math.max(0, 1 - (t - len) / r); return v; };

/* ---------- gemeinsame Instrumente ---------- */
function bell(t0, m, g = 1) {   // Klang-Logo: FM-Glocke
  const fq = mtof(m); let pc = 0, pm = 0, ps = 0;
  voice(t0, 3.2, (t) => { pc += TAU * fq / SR; pm += TAU * fq * 2 / SR; ps += TAU * fq * 4.01 / SR;
    const v = Math.sin(pc + 2.4 * Math.exp(-t * 2.6) * Math.sin(pm)) + 0.22 * Math.sin(ps) * Math.exp(-t * 5); return v * Math.exp(-t * 1.3) * Math.min(1, t * 700) * g; },
  [out(MUS, 0, 0.2), out(REV, 0, 0.12), out(DLY, 0, 0.05)]);
}
function piano(t0, notes, len, vel = 1) {
  notes.forEach((m, k) => { const fq = mtof(m), s = saw(fq), f = svf(); let ph = rnd() * TAU;
    voice(t0, len + 0.35, (t) => { ph += TAU * fq / SR; f.run(s(), 300 + 4200 * Math.exp(-t * 7), 0.8);
      const v = (f.lp * 0.45 + Math.sin(ph) * 0.6 + 0.2 * Math.sin(2 * ph) * Math.exp(-t * 9)) * Math.min(1, t * 500) * Math.exp(-t * 3) * (t > len ? Math.max(0, 1 - (t - len) / 0.3) : 1);
      return v * vel; }, [out(MUS, (k - 1) * 0.3, 0.16), out(REV, 0, 0.1)]); });
}
function crash(t0, g = 1) { const f = svf(); voice(t0, 2.2, (t) => { f.run(noise(), 5200, 0.6); return f.hp * Math.exp(-t * 2.1) * Math.min(1, t * 600); }, [out(DRY, 0.3, 0.2 * g), out(REV, -0.3, 0.14 * g)]); }
function riser(t0, len, g = 1) { const f = svf(); voice(t0, len, (t) => { const p = t / len; f.run(noise(), 400 * 2 ** (p * 4), 2.5); return f.bp * p * p * 0.5 * g; }, [out(DRY, 0, 0.5), out(REV, 0, 0.3)]); }
function subDrop(t0, g = 1) { let ph = 0; voice(t0, 1.8, (t) => { ph += TAU * (32 + 38 * Math.exp(-t * 2.2)) / SR; return Math.sin(ph) * Math.exp(-t * 1.8) * Math.min(1, t * 300) * g; }, [out(DRY, 0, 0.5)]); }
function snare(t0, g) {
  const f = svf(); let ph = 0;
  voice(t0, 0.25, (t) => { ph += TAU * 190 / SR; f.run(noise(), 1900, 0.8); return (f.bp * 1.4 * Math.exp(-t * 22) + Math.sin(ph) * 0.5 * Math.exp(-t * 30)) * g; }, [out(DRY, 0.1, 0.32), out(REV, 0, 0.12)]);
}
function snareRoll(t0, len, g = 1) {   // Wirbel: immer dichter und lauter
  for (let t = 0; t < len;) { const p = t / len; snare(t0 + t, g * (0.15 + 0.85 * p * p)); t += 1 / (4 + 20 * p * p); }
}

/* ---------- Episch (Richtung Hans Zimmer: Ostinato der tiefen Streicher mit 3-3-2-Akzenten, Hörner-Thema, Kriegstrommeln, Pauken, Chor, Solostimme) ---------- */
function taiko(t0, g = 1, f0 = 50, pan = 0) {   // zwei Spieler leicht versetzt
  [[0, 1, 0, -0.2], [0.007, 0.7, 6, 0.35]].forEach(([dt, gg, df, pp]) => { const f = svf(); let ph = 0;
    voice(t0 + dt, 1.8, (t) => { ph += TAU * (f0 + df + 75 * Math.exp(-t * 26)) / SR; const body = Math.sin(ph) * Math.exp(-t * 3.8); f.run(noise(), 800, 0.9);
      return Math.tanh((body + f.bp * Math.exp(-t * 30) * 1.2) * 1.7) * Math.min(1, t * 1500) * gg; }, [out(DRY, pan + pp, 0.4 * g), out(REV, 0, 0.34 * g)]); });
}
function tom(t0, g, f0, pan) { let ph = 0; voice(t0, 0.6, (t) => { ph += TAU * f0 * (1 + 0.6 * Math.exp(-t * 30)) / SR; return Math.sin(ph) * Math.exp(-t * 9); }, [out(DRY, pan, 0.4 * g), out(REV, pan, 0.22 * g)]); }
function timp(t0, m, g = 1) {   // Pauke
  const fq = mtof(m); let p1 = 0, p2 = 0;
  voice(t0, 2.4, (t) => { const f = fq * (1 + 0.04 * Math.exp(-t * 20)); p1 += TAU * f / SR; p2 += TAU * f * 1.5 / SR;
    return (Math.sin(p1) + 0.35 * Math.sin(p2) * Math.exp(-t * 3)) * Math.exp(-t * 1.6) * Math.min(1, t * 800) * g; }, [out(DRY, -0.2, 0.32), out(REV, 0, 0.26)]);
}
function timpRoll(t0, len, m, g = 1) { for (let t = 0; t < len; t += 0.06) timp(t0 + t, m, g * 0.5 * (0.12 + 0.88 * (t / len) ** 2)); }
function braam(t0, len, notes, g = 1) {   // tiefer Blechbläser-Schlag
  notes.forEach((m) => [-1, 0, 1].forEach((d) => { const s = saw(mtof(m) * 2 ** (d * 9 / 1200)), f = svf();
    voice(t0, len + 1.2, (t) => { const c = 260 + 2500 * Math.min(1, t / 0.1) * Math.exp(-Math.max(0, t - 0.1) * 1.4); f.run(s(), c, 1.3);
      return Math.tanh(f.lp * 2.2) * (1 + 0.22 * Math.sin(TAU * 7 * t) * Math.exp(-t * 2)) * adsr(t, 0.012, 0.5, 0.5, len, 1.1); }, [out(MUS, d * 0.5, 0.08 * g), out(REV, d * 0.5, 0.06 * g)]); }));
}
function swell(t1, len, g = 1) { const f = svf(); voice(t1 - len, len, (t) => { const p = t / len; f.run(noise(), 3000 + 5000 * p, 0.7); return f.hp * p ** 3 * g; }, [out(DRY, 0.2, 0.22), out(REV, -0.2, 0.15)]); }
function shepard(t0, len, g = 1) {   // endlos steigender Ton
  const ph = new Array(6).fill(0);
  voice(t0, len, (t) => { const p = t / len; let v = 0; for (let k = 0; k < 6; k++) { const x = ((k + p * 1.6) % 6) / 6; ph[k] += TAU * 55 * 2 ** (x * 6) / SR; v += (Math.sin(ph[k]) + 0.3 * Math.sin(2 * ph[k])) * Math.sin(Math.PI * x) ** 2; }
    return v * (0.15 + 0.85 * p * p) * g; }, [out(MUS, 0, 0.07), out(REV, 0, 0.06)]);
}
function cello(t0, m, len, vel, pan) {   // tiefe Streicher, kurz gestrichen
  const ss = [0.997, 1, 1.003].map((d) => saw(mtof(m) * d)), f = svf();
  voice(t0, len + 0.15, (t) => { let v = 0; for (const s of ss) v += s(); f.run(v / 3, 350 + 2400 * vel * Math.exp(-t * 16), 0.9); return f.lp * adsr(t, 0.006, 0.09, 0.55, len, 0.1) * (0.4 + 0.6 * vel); },
    [out(MUS, pan, 0.2), out(REV, pan, 0.07)]);
}
function ens(t0, notes, len, g = 1, bright = 1, att = 0.5) {   // Streicher-Ensemble, breit
  notes.forEach((m) => [-11, -4, 3, 9].forEach((c, j) => { const s = vsaw(mtof(m) * 2 ** (c / 1200), 0.003, 4.8 + rnd()), f = svf(), pan = (j / 1.5 - 1) * 0.8, cut = Math.min(5000, mtof(m) * 4 * bright + 500);
    voice(t0, len + 1.2, (t) => { f.run(s(), cut * (0.6 + 0.4 * Math.min(1, t / 1.2)), 0.7); return f.lp * adsr(t, att, 0.4, 0.9, len, 1.2); }, [out(MUS, pan, 0.03 * g), out(REV, pan, 0.035 * g)]); }));
}
function hornChord(t0, notes, len, g = 1) {   // Hörner-Akkord mit Crescendo
  notes.forEach((m) => [-6, 0, 6].forEach((c, j) => { const s = vsaw(mtof(m) * 2 ** (c / 1200), 0.003, 5.2), f = svf();
    voice(t0, len + 0.8, (t) => { const d = Math.min(1, t / len) ** 1.5; f.run(s(), 300 + 1700 * (0.3 + 0.7 * d), 1.0); return Math.tanh(f.lp * 1.4) * (0.35 + 0.65 * d) * adsr(t, 0.3, 0.1, 1, len, 0.7); },
      [out(MUS, (j - 1) * 0.4, 0.05 * g), out(REV, (j - 1) * 0.4, 0.06 * g)]); }));
}
const lineAt = (ph, t) => { let k = 0; while (k + 1 < ph.length && ph[k + 1][0] <= t) k++; return k; };
function legato(ph, render) {   // eine Stimme über eine ganze Phrase: Portamento zwischen den Tönen
  const t0 = ph[0][0], tEnd = ph.at(-1)[0] + ph.at(-1)[2];
  const pitch = (t) => { const k = lineAt(ph, t), [ts, m] = ph[k], pr = k ? ph[k - 1][1] : m, gl = Math.min(1, (t - ts) / 0.09); return pr + (m - pr) * (1 - (1 - gl) ** 2); };
  const shape = (t) => { const k = lineAt(ph, t), [ts, , l] = ph[k]; return { u: (t - ts) / l, nt: t - ts }; };
  render(t0, tEnd, pitch, shape);
}
function hornLine(ph, g = 1, oct = 0) {   // Hörner unisono, jeder Ton schwillt an
  legato(ph, (t0, tEnd, pitch, shape) => [-7, -2, 3, 8].forEach((c, j) => { let p = rnd(); const f = svf(), pan = (j - 1.5) * 0.25;
    voice(t0, tEnd - t0 + 0.8, (t) => { const at = t0 + t, { u } = shape(at), fq = mtof(pitch(at) + oct) * 2 ** (c / 1200) * (1 + 0.004 * Math.sin(TAU * 5.2 * t) * Math.min(1, t)), dt = fq / SR;
      p += dt; if (p >= 1) p -= 1; const v = 2 * p - 1 - blep(p, dt);
      const dyn = (0.72 + 0.28 * Math.sin(Math.PI * Math.min(1, u))) * Math.min(1, t / 0.25) * (at > tEnd ? Math.max(0, 1 - (at - tEnd) / 0.7) : 1);
      f.run(v, 250 + 2300 * dyn * dyn, 1.0); return Math.tanh(f.lp * 1.6) * dyn; }, [out(MUS, pan, 0.07 * g), out(REV, pan, 0.075 * g)]); }));
}
function vocal(ph, g = 1) {   // Solostimme auf „a“: Formanten, verzögertes Vibrato, Portamento, Atem
  const FM = [[850, 1], [1220, 0.5], [2810, 0.28], [3500, 0.12]];
  legato(ph, (t0, tEnd, pitch, shape) => { let p = 0; const fs = FM.map(() => svf());
    voice(t0, tEnd - t0 + 1.2, (t) => { const at = t0 + t, { u, nt } = shape(at), vib = 0.007 * Math.min(1, Math.max(0, nt - 0.35) * 2), fq = mtof(pitch(at)) * (1 + vib * Math.sin(TAU * 5.4 * t)), dt = fq / SR;
      p += dt; if (p >= 1) p -= 1; const v = (2 * p - 1 - blep(p, dt)) + noise() * 0.08;
      const dyn = (0.6 + 0.4 * Math.sin(Math.PI * Math.min(1, u))) * Math.min(1, t / 0.4) * (at > tEnd ? Math.max(0, 1 - (at - tEnd) / 1.0) : 1);
      let y = 0; fs.forEach((f, j) => { f.run(v, FM[j][0], 9); y += f.bp * FM[j][1]; }); return y * dyn; }, [out(MUS, 0, 0.1 * g), out(REV, 0, 0.12 * g), out(DLY, 0, 0.04 * g)]); });
}
function choir(t0, notes, len, g = 1) {   // Chor auf „a“: drei Formantfilter
  const FM = [[730, 1.0], [1090, 0.5], [2440, 0.25]];
  notes.forEach((m) => [-12, -4, 4, 12].forEach((d, j) => { const s = vsaw(mtof(m) * 2 ** (d / 1200), 0.005, 4.5 + rnd()), fs = FM.map(() => svf());
    voice(t0, len + 1.4, (t) => { const v = s(); let y = 0; fs.forEach((f, k) => { f.run(v, FM[k][0], 6); y += f.bp * FM[k][1]; }); return y * adsr(t, 0.9, 0.5, 0.9, len, 1.4); },
      [out(MUS, (j / 1.5 - 1) * 0.8, 0.055 * g), out(REV, (j / 1.5 - 1) * 0.8, 0.09 * g)]); }));
}

// Hörner-Thema (eigene Komposition), acht Takte über Dm – Bb – F – C, je zwei Takte: [Takt, Beat, MIDI in D-Moll, Länge in Beats]
const THEME = [[0, 0, 62, 2], [0, 2, 69, 2], [1, 0, 67, 1.5], [1, 1.5, 65, 0.5], [1, 2, 64, 1], [1, 3, 65, 1],
  [2, 0, 62, 2], [2, 2, 70, 2], [3, 0, 69, 3], [3, 3, 67, 1],
  [4, 0, 69, 2], [4, 2, 72, 2], [5, 0, 70, 1.5], [5, 1.5, 69, 0.5], [5, 2, 67, 2],
  [6, 0, 67, 2], [6, 2, 64, 2], [7, 0, 64, 3], [7, 3, 65, 1]];
function epic(K, only) {   // K: Transposition (0 = D-Moll), only: nur diese Kapitel (Mischform)
  const CH = { Dm: [38, 3], Bb: [34, 4], F: [41, 4], C: [36, 4], Gm: [43, 3], A: [45, 4], D: [38, 4], G: [43, 4] };
  const ch = (n) => ({ r: CH[n][0] + K, th: CH[n][1] });
  const tri = (c, o) => [c.r + o, c.r + o + c.th, c.r + o + 7];
  const on = (s) => !only || only.includes(s);
  const base = 74 + K, motif = (maj) => [base - 5, base, base + (maj ? 4 : 3)];
  const prog = (s, names, fn) => { if (on(s)) bars(G[s], NEXT(s), (b, k) => fn(b, ch(names[k % names.length]), k)); };
  const theme = (t0, from, to) => THEME.filter(([b]) => b >= from && b < to).map(([b, q, m, l]) => [t0 + (b - from) * BAR + q * beat, m + K, l * beat]);
  const ost = (b, c, vel, rate = 4, until = Infinity) => { const n = Math.round(4 * rate), d = BAR / n, PAT = [0, 0, 12, 0, 0, 12, 7, 12];
    for (let i = 0; i < n; i++) { const t = b + i * d, x = i % 8, acc = x === 0 || x === 3 || x === 6; if (t >= until) break;
      cello(t, c.r + 12 + PAT[x], d * 0.85, vel * (acc ? 1 : 0.55), i % 2 ? 0.25 : -0.25); if (acc) cello(t, c.r, d * 0.9, vel * 0.8, 0); } };
  const DR = [[[0, 1], [0.3, 0.55]], [[0, 1], [1.5, 0.55], [2.5, 0.6]], [[0, 1], [0.75, 0.45], [1.5, 0.7], [2, 0.85], [3, 0.7], [3.5, 0.5]],
    [[0, 1], [0.75, 0.5], [1.5, 0.75], [2, 0.9], [2.75, 0.5], [3, 0.8], [3.5, 0.6], [3.75, 0.45]]];
  const drums = (b, lvl, g = 1) => { for (const [q, v] of DR[lvl]) taiko(b + q * beat, v * g, q === 0 ? 44 : 56, q % 1 ? 0.3 : -0.1);
    if (lvl >= 2) { tom(b + 3.75 * beat, 0.4 * g, 150, 0.45); tom(b + 1.75 * beat, 0.3 * g, 120, -0.45); } };
  const impact = (t, g, c) => { taiko(t, 1.3 * g, 38); braam(t, 1.8, [c.r, c.r + 12, c.r + 19, c.r + 24], g); crash(t, g); subDrop(t, g); timp(t, c.r + 12, g); };
  const logo = (s, maj) => LOGO[s].forEach((d, i) => { const m = motif(maj)[i]; bell(S0(s) + d, m, 1); piano(S0(s) + d, [m - 12], 1.2, 0.5); });

  if (on('intro')) { const c = ch('Dm'); ens(0, [c.r, c.r + 12], 4.6, 1.2, 0.5, 1.5); choir(0.4, [c.r + 24, c.r + 31], 3.8, 0.5); subDrop(0.25, 0.45); logo('intro', false);
    vocal([[1.6, 77 + K, 0.8], [2.4, 76 + K, 0.5], [2.9, 74 + K, 1.4]], 0.8); swell(G.open, 1.6); }
  prog('open', ['Dm', 'Dm', 'Bb', 'Bb'], (b, c, k) => { if (k === 0) { impact(b, 0.8, c); hornLine(theme(b, 0, 4), 0.55, -12); }
    if (k % 2 === 0) ens(b, [c.r + 12, ...tri(c, 24)], 2 * BAR, 1, 0.8); drums(b, 0, 0.6); });
  prog('markt', ['F', 'F', 'C', 'C', 'Dm'], (b, c, k) => { if (k === 0) { taiko(b, 0.9, 40); crash(b, 0.6); } if (k % 2 === 0) ens(b, [c.r + 12, ...tri(c, 24)], (k === 4 ? 1 : 2) * BAR, 1);
    ost(b, c, 0.55, 2); drums(b, 1, 0.6); timp(b, c.r + 12, 0.5); });
  prog('grund', ['Dm', 'Dm', 'Bb', 'Bb', 'C'], (b, c, k) => { if (k === 0) { taiko(b, 1, 40); crash(b, 0.7); } if (k % 2 === 0) { ens(b, [c.r + 12, ...tri(c, 24)], (k === 4 ? 1 : 2) * BAR, 1); hornChord(b, tri(c, 12), (k === 4 ? 1 : 2) * BAR * 0.95, 0.8); }
    ost(b, c, 0.62); drums(b, 1, 0.75); if (k === 4) swell(NEXT('grund'), 1.5); });
  prog('mandate', ['Gm', 'Gm', 'Dm', 'Dm', 'A', 'A'], (b, c, k) => { if (k === 0) { impact(b, 0.6, c); } if (k % 2 === 0) { ens(b, [c.r + 12, ...tri(c, 24)], 2 * BAR, 1.1); choir(b, tri(c, 24), 2 * BAR * 0.95, 0.45); }
    ost(b, c, 0.72); [0, 1.5, 3].forEach((q) => braam(b + q * beat, 0.25, [c.r, c.r + 12], 0.35)); drums(b, 2, 0.8); if (k === 5) { timpRoll(b + BAR / 2, BAR / 2, c.r + 12, 0.8); swell(b + BAR, 1.6); } });
  prog('direkt', ['Dm', 'Dm', 'Bb', 'Bb', 'F', 'F', 'C', 'C', 'Dm'], (b, c, k) => { if (k === 0) { impact(b, 0.95, c); hornLine(theme(b, 0, 8), 1.0); hornLine(theme(b, 0, 8), 0.4, 12); }
    if (k % 2 === 0) { ens(b, [c.r + 12, ...tri(c, 24), c.r + 36], (k === 8 ? 1 : 2) * BAR, 1.2); choir(b, tri(c, 24), (k === 8 ? 1 : 2) * BAR * 0.95, 0.6); }
    ost(b, c, 0.85); drums(b, 3, 0.9); if (k === 8) hornChord(b, tri(c, 12), BAR, 0.9); });
  if (on('messen')) {   // Ostinato wird schneller, endlos steigender Ton, Pauken- und Snare-Wirbel, kurze Stille vor der Auszeichnung
    const t0 = G.messen, stop = G.award - 0.4;
    ['Dm', 'Bb', 'Gm', 'A'].forEach((n, k) => { const b = t0 + k * BAR, c = ch(n); ens(b, [c.r + 12, ...tri(c, 24)], Math.min(BAR, stop - b), 0.9 + 0.25 * k, 0.8 + 0.2 * k, 0.2);
      ost(b, c, 0.6 + 0.12 * k, [4, 4, 8, 8][k], stop); taiko(b, 0.6 + 0.2 * k, 42); if (k >= 2) choir(b, tri(c, 24), Math.min(BAR, stop - b), 0.5 + 0.2 * k); });
    shepard(t0, stop - t0, 1); snareRoll(t0 + 2 * BAR, 2 * BAR - 0.4, 1); timpRoll(t0 + 2 * BAR, 2 * BAR - 0.4, ch('A').r + 12, 1);
  }
  prog('award', ['Bb', 'Bb', 'F', 'F', 'C', 'C'], (b, c, k) => { if (k === 0) { impact(b, 1.2, c); hornLine(theme(b, 2, 8), 1.15); hornLine(theme(b, 2, 8), 0.6, 12); hornLine(theme(b, 2, 8), 0.5, -12); }
    if (k === 2) impact(b, 0.85, c);
    if (k % 2 === 0) { ens(b, [c.r + 12, ...tri(c, 24), ...tri(c, 36)], 2 * BAR, 1.3, 1.2); choir(b, [...tri(c, 24), c.r + 36], 2 * BAR * 0.95, 0.95); }
    ost(b, c, 0.9); drums(b, 3, 1); });
  prog('werte', ['Dm', 'Dm', 'Bb', 'C'], (b, c, k) => { if (k === 0) { taiko(b, 0.8, 40); crash(b, 0.4);
      vocal([[b + 0.3, 74 + K, 1.6], [b + 2.0, 77 + K, 1.0], [b + 3.0, 76 + K, 0.9], [b + 4.0, 74 + K, 1.8], [b + 6.0, 72 + K, 0.9], [b + 7.0, 76 + K, 1.0]], 0.9); }
    ens(b, [c.r + 12, ...tri(c, 24)], BAR, 0.9, 0.7, 0.8); ost(b, c, 0.3, 2);
    [0, 7, 12, c.th + 12, 19, c.th + 12, 12, 7].forEach((o, i) => piano(b + i * beat / 2, [c.r + 24 + o], beat * 0.45, 0.45));
    if (k >= 2) choir(b, tri(c, 24), BAR * 0.95, 0.65); if (k === 3) { timpRoll(b + BAR / 2, BAR / 2, c.r + 12, 0.7); swell(b + BAR, 1.5); } });
  if (on('outro')) {   // D-Dur: Klang-Logo in Dur, Thema endet in Dur, plagaler Schluss D – G – D
    const t0 = G.outro, cD = ch('D'), cG = ch('G');
    impact(t0, 0.7, cD); ens(t0, [cD.r + 12, ...tri(cD, 24)], BAR, 1); choir(t0, tri(cD, 24), BAR, 0.5); hornChord(t0, tri(cD, 12), BAR * 0.95, 0.6); ost(t0, cD, 0.35, 2); logo('outro', true);
    ens(t0 + BAR, [cG.r + 12, ...tri(cG, 24)], BAR, 1.1); choir(t0 + BAR, tri(cG, 24), BAR, 0.7); ost(t0 + BAR, cG, 0.5);
    hornLine([[t0 + BAR, 71 + K, beat * 2], [t0 + BAR + 2 * beat, 69 + K, beat * 2], [t0 + 2 * BAR, 74 + K, DUR - t0 - 2 * BAR - 1.6]], 1.0);
    timpRoll(t0 + BAR + 1.0, 1.0, cD.r + 12, 0.8); swell(t0 + 2 * BAR, 1.2);
    const tf = t0 + 2 * BAR, hold = DUR - tf - 1.4; impact(tf, 1.0, cD); ens(tf, [cD.r, cD.r + 12, ...tri(cD, 24), ...tri(cD, 36)], hold, 1.3, 1.1); choir(tf, [...tri(cD, 24), cD.r + 36], hold, 0.95);
    hornChord(tf, tri(cD, 12), hold * 0.6, 0.8); bell(tf + 0.05, base + 4, 0.45); taiko(tf + 2 * beat, 0.5, 40);
  }
}

/* ---------- Melodic Techno ---------- */
const KICKS = [];
function kick(t0, g = 1) {
  KICKS.push(t0); let ph = 0;
  voice(t0, 0.5, (t) => { const f = 48 + 120 * Math.exp(-t * 34); ph += TAU * f / SR; const a = Math.exp(-t * 10) * Math.min(1, t * 900);
    return Math.tanh(Math.sin(ph) * a * 2) * 0.95 + (t < 0.005 ? noise() * (1 - t / 0.005) * 0.25 : 0); }, [out(DRY, 0, 0.62 * g)]);
}
function clap(t0, g = 1) {
  const f = svf();
  voice(t0, 0.4, (t) => { let e = 0; for (const o of [0, 0.011, 0.022]) if (t >= o && t < o + 0.011) e += Math.exp(-(t - o) * 260);
    if (t >= 0.022) e += Math.exp(-(t - 0.022) * 17); f.run(noise() * e, 1350, 1.4); return f.bp * 1.6; }, [out(DRY, 0, 0.5 * g), out(REV, 0, 0.36 * g)]);
}
function hat(t0, open, vel, pan = 0.15) {
  const f = svf(), d = open ? 11 : 60;
  voice(t0, open ? 0.45 : 0.09, (t) => { f.run(noise(), 7600, 0.8); return f.hp * Math.exp(-t * d) * Math.min(1, t * 2000); }, [out(DRY, pan, 0.28 * vel), out(REV, pan, 0.06 * vel)]);
}
function perc(t0, fq, pan) { let ph = 0; voice(t0, 0.3, (t) => { ph += TAU * fq * (1 + 0.5 * Math.exp(-t * 40)) / SR; return Math.sin(ph) * Math.exp(-t * 18); }, [out(DRY, pan, 0.14), out(DLY, -pan, 0.06)]); }
function tbass(t0, m, len, cut) {
  const s = saw(mtof(m)), f = svf(), fq = mtof(m); let ph = 0;
  voice(t0, len + 0.03, (t) => { ph += TAU * fq / SR; f.run(s(), 120 + cut * Math.exp(-t * 20), 1.6); return Math.tanh((f.lp + 0.6 * Math.sin(ph)) * 1.8) * adsr(t, 0.003, 0.06, 0.6, len, 0.02); }, [out(MUS, 0, 0.3)]);
}
function arp(t0, m, cut, vel = 1, pan = 0) {
  const s = saw(mtof(m)), s2 = saw(mtof(m) * 1.005), f = svf();
  voice(t0, 0.3, (t) => { f.run((s() + s2()) * 0.5, 150 + cut * Math.exp(-t * 16), 2.4); return f.lp * adsr(t, 0.002, 0.1, 0.3, 0.12, 0.08) * vel; }, [out(MUS, pan, 0.15), out(DLY, -pan, 0.1), out(REV, 0, 0.05)]);
}
function tpad(t0, notes, len, cut, g = 1) {
  notes.forEach((m) => [-1, 0, 1].forEach((d) => { const s = saw(mtof(m) * 2 ** (d * 9 / 1200)), f = svf();
    voice(t0, len + 0.8, (t) => { f.run(s(), cut + 300 * Math.sin(TAU * 0.15 * (t0 + t)), 0.7); return f.lp * adsr(t, 0.5, 0.3, 0.8, len, 0.8); }, [out(MUS, d * 0.7, 0.035 * g), out(REV, d * 0.7, 0.05 * g)]); }));
}
function lead(t0, m, len, g = 1) {   // Supersaw-Lead, links/rechts verteilt
  [-15, -9, -4, 0, 4, 9, 15].forEach((c, j) => { const s = saw(mtof(m) * 2 ** (c / 1200)), f = svf(), pan = (j - 3) / 3 * 0.7;
    voice(t0, len + 0.5, (t) => { f.run(s(), 1100 + 3800 * Math.min(1, t / 0.05) * (0.7 + 0.3 * Math.exp(-t * 2)), 0.8); return f.lp * adsr(t, 0.02, 0.3, 0.75, len, 0.45) * g; },
      [out(MUS, pan, 0.045), out(DLY, -pan, 0.02), out(REV, pan, 0.03)]); });
  const sub = saw(mtof(m - 12)), f = svf();
  voice(t0, len + 0.5, (t) => { f.run(sub(), 1600, 0.7); return f.lp * adsr(t, 0.02, 0.3, 0.75, len, 0.45) * g; }, [out(MUS, 0, 0.09)]);
}

function techno() {
  const CH = { Am: [33, 3], F: [29, 4], G: [31, 4], A: [33, 4], D: [38, 4] };
  const ch = (n) => ({ r: CH[n][0], th: CH[n][1] });
  const tri = (c, o) => [c.r + o, c.r + o + c.th, c.r + o + 7];
  const base = 69, motif = (maj) => [base - 5, base, base + (maj ? 4 : 3)];
  const LV = { intro: 0, open: 1, markt: 2, grund: 3, mandate: 4, direkt: 5, messen: 5, award: 6, werte: 2, outro: 1 };
  const CUT = { intro: 450, open: 700, markt: 1200, grund: 1800, mandate: 2400, direkt: 3200, messen: 3200, award: 4200, werte: 1500, outro: 900 };
  const MEL = [[[0, 76, 1.5], [1.5, 79, 1.5], [3, 81, 1]], [[0, 76, 4]], [[0, 77, 1.5], [1.5, 76, 1.5], [3, 72, 1]], [[0, 74, 4]]];
  const logo = (s, maj) => LOGO[s].forEach((d, i) => bell(S0(s) + d, motif(maj)[i], 1));
  logo('intro', false); riser(2.4, 1.6, 0.8);
  for (const s of TL.SCENES) {
    const lv = LV[s], names = s === 'outro' ? ['A', 'D', 'A', 'A', 'A'] : ['Am', 'Am', 'F', 'G'], stop = s === 'messen' ? G.award - 0.4 : Infinity;
    if (['open', 'direkt', 'award'].includes(s)) { crash(G[s], 1); subDrop(G[s], s === 'award' ? 1 : 0.7); } else if (lv >= 1) crash(G[s], 0.6);
    bars(G[s], NEXT(s), (b, k) => {
      const c = ch(names[k % names.length]), build = s === 'messen' && k >= 2, end = s === 'outro' && k >= 2;
      const cut = (t) => (s === 'messen' ? CUT.messen + 4000 * (t - G.messen) / (G.award - G.messen) : CUT[s]) * (1 + 0.25 * Math.sin(TAU * t / (BAR * 2)));
      if (lv >= 1 && !build && !end) for (let q = 0; q < 4; q++) { kick(b + q * beat, s === 'open' ? 0.85 : 1);
        for (const n of [1, 2, 3]) tbass(b + q * beat + n * step, c.r + 12 + (n === 3 && lv >= 5 ? 12 : 0), step * 0.8, 300 + 80 * lv); }
      for (let i = 0; i < 16; i++) { const t = b + i * step; if (t >= stop) break;
        if (lv >= 1 && !end && i % 4 === 2) hat(t, lv >= 2 && !build, 0.8); else if (lv >= 4 && !end) hat(t, false, i % 2 ? 0.35 : 0.5);
        const pat = [0, 7, 12, c.th + 12, 7, 12, c.th + 24, 12]; arp(t, c.r + 36 + pat[i % 8] - 12, cut(t), i % 4 === 0 ? 1 : 0.7, i % 2 ? 0.35 : -0.35); }
      if (lv >= 3 && !build && !end) { clap(b + beat); clap(b + 3 * beat); }
      if (lv >= 4 && !build && !end) for (const [n, f, p] of [[3, 360, 0.4], [7, 300, -0.5], [10, 250, 0.5], [15, 300, -0.3]]) perc(b + n * step, f, p);
      tpad(b, tri(c, 36), Math.min(BAR * (end && k === 4 ? 1.4 : 0.95), stop - b), s === 'award' ? 2200 : 900 + 0.2 * CUT[s], lv >= 5 ? 1.1 : 0.9);
      if (s === 'award') for (const [q, m, l] of MEL[k % 4]) lead(b + q * beat, m, l * beat * 0.95, 1);
      if (s === 'outro' && k === 2) { lead(b, 81, 4.2, 0.8); lead(b, 76, 4.2, 0.6); lead(b, 73, 4.2, 0.6); subDrop(b, 0.8); crash(b, 0.8); }
    });
  }
  snareRoll(G.messen + 2 * BAR, 2 * BAR - 0.4, 1); riser(G.messen + BAR, 3 * BAR - 0.4);
  logo('outro', true);
}

/* ---------- Arrangement ---------- */
const HYB = [[0, G.markt], [G.award, G.werte], [G.outro, DUR]];   // Mischform: hier episch, sonst Groove
if (STYLE === 'epic') epic(0);
else if (STYLE === 'hybrid') epic(-5, ['intro', 'open', 'award', 'outro']);
else techno();

/* ---------- SFX der Vorlage ---------- */
const SX = {
  click: (t0, p, g) => voice(t0, 0.05, (t) => noise() * Math.exp(-t * 180) * 0.6 + Math.sin(TAU * 2400 * t) * Math.exp(-t * 300) * 0.4, [out(SFX, p, g)]),
  pop: (t0, p, g) => voice(t0, 0.15, (t) => Math.sin(TAU * (900 * Math.exp(-t * 25) + 180) * t) * Math.exp(-t * 35) * 0.7, [out(SFX, p, g)]),
  thump: (t0, p, g) => voice(t0, 0.3, (t) => Math.sin(TAU * (90 * Math.exp(-t * 18) + 40) * t) * Math.exp(-t * 14) * 0.9, [out(SFX, p, g)]),
  whoosh: (t0, p, g) => { const f = svf(); voice(t0, 0.5, (t) => { const w = Math.sin(Math.PI * Math.min(1, t / 0.5 * 1.2)); f.run(noise(), 600 + 3000 * t, 0.8); return f.bp * w * w * 0.9; }, [out(SFX, p, g)]); },
  tick: (t0, p, g) => voice(t0, 0.03, (t) => Math.sin(TAU * 4000 * t) * Math.exp(-t * 400) * 0.3, [out(SFX, p, g)]),
  ding: (t0, p, g) => voice(t0, 0.6, (t) => (Math.sin(TAU * 1320 * t) + 0.5 * Math.sin(TAU * 1980 * t)) * Math.exp(-t * 6) * 0.3, [out(SFX, p, g)]),
};
for (const c of TL.CUES) (SX[c.sfx] || SX.click)(c.t, c.pan || 0, SG);

/* ---------- Effekte ---------- */
function reverb(inL, inR, room, damp) {   // Freeverb
  const sc = SR / 44100, combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], aps = [556, 441, 341, 225];
  const mk = (sp) => ({ c: combs.map((d) => ({ b: new Float32Array(Math.round((d + sp) * sc)), i: 0, f: 0 })), a: aps.map((d) => ({ b: new Float32Array(Math.round((d + sp) * sc)), i: 0 })) });
  const run = (x, ch) => { let y = 0; for (const c of ch.c) { const o = c.b[c.i]; c.f = o * (1 - damp) + c.f * damp; c.b[c.i] = x * 0.015 + c.f * room; c.i = (c.i + 1) % c.b.length; y += o; }
    for (const a of ch.a) { const o = a.b[a.i]; a.b[a.i] = y + o * 0.5; a.i = (a.i + 1) % a.b.length; y = o - y; } return y; };
  const L = mk(0), R = mk(23), oL = new Float32Array(N), oR = new Float32Array(N);
  for (let i = 0; i < N; i++) { const x = inL[i] + inR[i]; oL[i] = run(x, L); oR[i] = run(x, R); } return [oL, oR];
}
function pingpong(inL, inR, time, fb = 0.4) {
  const d = Math.round(time * SR), bL = new Float32Array(d), bR = new Float32Array(d), oL = new Float32Array(N), oR = new Float32Array(N); let i2 = 0, lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) { const yL = bL[i2], yR = bR[i2]; lpL += 0.45 * (yL - lpL); lpR += 0.45 * (yR - lpR);
    bL[i2] = inL[i] + inR[i] + lpR * fb; bR[i2] = lpL * fb; i2 = (i2 + 1) % d; oL[i] = yL; oR[i] = yR; } return [oL, oR];
}
const [rvL, rvR] = reverb(REV[0], REV[1], STYLE === 'techno' ? 0.84 : 0.9, 0.3);
const [dlL, dlR] = pingpong(DLY[0], DLY[1], step * 3, 0.42);

/* ---------- Summe, Sidechain (Techno), Mischform, Master ---------- */
const sc = new Float32Array(N).fill(1);
for (const k of KICKS) { const i0 = Math.round(k * SR), len = Math.round(0.24 * SR);
  for (let j = 0; j < len && i0 + j < N; j++) { const x = j / len, g = 1 - 0.7 * (1 - x * x * (3 - 2 * x)); sc[i0 + j] = Math.min(sc[i0 + j], g); } }
const ML = new Float32Array(N), MR = new Float32Array(N); let hpL = 0, hpR = 0, xl = 0, xr = 0;
for (let i = 0; i < N; i++) {
  const L = MUS[0][i] * sc[i] + dlL[i] * (0.5 + 0.5 * sc[i]) + rvL[i] * (0.6 + 0.4 * sc[i]) + DRY[0][i], R = MUS[1][i] * sc[i] + dlR[i] * (0.5 + 0.5 * sc[i]) + rvR[i] * (0.6 + 0.4 * sc[i]) + DRY[1][i];
  hpL = 0.9974 * (hpL + L - xl); xl = L; hpR = 0.9974 * (hpR + R - xr); xr = R; ML[i] = hpL; MR[i] = hpR;   // DC/Subsonic-Hochpass ~20 Hz
}
const rms = (a, b, t0, t1) => { let s = 0; const i0 = Math.round(t0 * SR), i1 = Math.round(t1 * SR); for (let i = i0; i < i1; i++) s += a[i] * a[i] + b[i] * b[i]; return Math.sqrt(s / (2 * (i1 - i0))); };
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(ML[i]), Math.abs(MR[i]));
let gm = 1 / (peak || 1);
if (STYLE === 'hybrid') {   // Groove einlesen, in den epischen Fenstern ausblenden, epische Teile auf die Lautheit des Grooves bringen
  const w = readFileSync(sarg('groove', 'out/music_imagefilm_groove.wav')), d = w.indexOf('data') + 8, GL = new Float32Array(N), GR = new Float32Array(N);
  for (let i = 0; i < N && d + i * 4 + 3 < w.length; i++) { GL[i] = w.readInt16LE(d + i * 4) / 32768; GR[i] = w.readInt16LE(d + i * 4 + 2) / 32768; }
  gm = 1.15 * rms(GL, GR, G.markt, G.messen) / rms(ML, MR, G.award, G.werte);
  const env = (t) => { let e = 1; for (const [a, b] of HYB) { if (t >= a - 0.06 && t < b + 0.12) e = Math.min(e, t < a ? (a - t) / 0.06 : t >= b ? (t - b) / 0.12 : 0); } return e; };
  const lift = (t) => 1 + 0.3 * Math.min(1, Math.max(0, (t + 0.2) / 0.2)) * (t < G.open ? 1 : 0) + 0.7 * Math.min(1, Math.max(0, (t - G.open + 0.2) / 0.2)) * (t < G.markt ? 1 : 0);   // epischer Einstieg so präsent wie der Groove danach
  for (let i = 0; i < N; i++) { const t = i / SR, e = env(t), l = lift(t); ML[i] = ML[i] * gm * l + GL[i] * e; MR[i] = MR[i] * gm * l + GR[i] * e; }
  gm = 1;
}
let pk = 0; for (let i = 0; i < N; i++) { ML[i] = ML[i] * gm + SFX[0][i] * 0.6; MR[i] = MR[i] * gm + SFX[1][i] * 0.6; pk = Math.max(pk, Math.abs(ML[i]), Math.abs(MR[i])); }
const g = 1.15 / pk, fade = Math.round(1.2 * SR);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
const sat = Math.tanh;   // sanfte Sättigung fängt die Spitzen der Schläge ab
for (let i = 0; i < N; i++) { const fd = i > N - fade ? (N - i) / fade : 1;
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sat(ML[i] * g))) * 0.89 * fd * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sat(MR[i] * g))) * 0.89 * fd * 32767), 46 + i * 4); }
writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${STYLE}, ${DUR}s @ ${BPM} BPM, ${TL.CUES.length} sfx cues)`);
