// node scripts/music_deephouse.mjs --variant latch|sugar|deep [--bpm 120] [--dur 12] [--cues cues.json] [--out out/x.wav] [--seed 11]
// Deep House, komplett im Code synthetisiert (lizenzfrei, deterministisch).
//   latch: soulful, Orgel-Stabs, leichter Swing, Moll-9-Akkorde (Richtung Disclosure)
//   sugar: sonnig, House-Piano, hüpfender Bass, Hook-Melodie (Richtung Robin Schulz)
//   deep:  dunkler, Moll-9-Saw-Stabs mit Dub-Delay, langer Bass (Richtung klassischer Deep House)
// Takt 1 ist ein gefiltertes Intro mit Riser, ab Takt 2 (bei 120 BPM = 2 s) läuft der volle Groove.
// Mit --cues werden die SFX der Vorlage dazugemischt und beats.json geschrieben (wie music.mjs).
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const argv = process.argv;
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? Number(argv[i + 1]) : d; };
const sarg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : d; };
const VAR = sarg('variant', 'latch'), BPM = arg('bpm', 120), DUR = arg('dur', 12), SR = 48000;
const OUT = sarg('out', `out/deephouse_${VAR}.wav`), CUES = sarg('cues', '');
mkdirSync(dirname(OUT), { recursive: true });

const N = Math.round(DUR * SR), TAU = Math.PI * 2;
const beat = 60 / BPM, step = beat / 4, barLen = beat * 4;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = arg('seed', 11) >>> 0;
const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;

/* ---------- Busse ---------- */
const bus = () => [new Float32Array(N), new Float32Array(N)];
const DRY = bus(), MUS = bus(), REV = bus(), DLY = bus();   // DRY: Drums/SFX · MUS: wird von der Kick geduckt
const out = (b, pan, g) => ({ b, gl: g * Math.cos((pan + 1) * Math.PI / 4), gr: g * Math.sin((pan + 1) * Math.PI / 4) });
function voice(t0, len, fn, outs) {
  const i0 = Math.max(0, Math.round(t0 * SR)), i1 = Math.min(N, Math.round((t0 + len) * SR));
  for (let i = i0; i < i1; i++) { const v = fn((i - i0) / SR); if (v === 0) continue; for (const o of outs) { o.b[0][i] += v * o.gl; o.b[1][i] += v * o.gr; } }
}

/* ---------- DSP-Bausteine ---------- */
function svf() {   // Zavalishin-TPT-SVF, stabil bei modulierter Frequenz
  let ic1 = 0, ic2 = 0; const o = { lp: 0, bp: 0, hp: 0 };
  o.run = (x, fc, q) => { const g = Math.tan(Math.PI * Math.min(fc, SR * 0.45) / SR), k = 1 / q; const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
    const v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3; ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2; o.lp = v2; o.bp = v1; o.hp = x - k * v1 - v2; return v2; };
  return o;
}
const blep = (p, dt) => { if (p < dt) { p /= dt; return p + p - p * p - 1; } if (p > 1 - dt) { p = (p - 1) / dt; return p * p + p + p + 1; } return 0; };
function saw(f) { let p = rnd(); const dt = f / SR; return () => { p += dt; if (p >= 1) p -= 1; return 2 * p - 1 - blep(p, dt); }; }
const adsr = (t, a, d, s, len, r) => { let v; if (t < a) v = t / a; else if (t < a + d) v = 1 - (1 - s) * (t - a) / d; else v = s; if (t > len) v *= Math.max(0, 1 - (t - len) / r); return v; };

/* ---------- Instrumente ---------- */
const KICKS = [];
function kick(t0, g = 1) {
  KICKS.push(t0); let ph = 0;
  voice(t0, 0.55, (t) => { const f = 46 + 112 * Math.exp(-t * 32); ph += TAU * f / SR; const a = Math.exp(-t * 11) * Math.min(1, t * 900);
    const click = t < 0.005 ? noise() * (1 - t / 0.005) * 0.25 : 0; return Math.tanh(Math.sin(ph) * a * 1.8) * 0.95 + click; }, [out(DRY, 0, 0.62 * g)]);
}
function clap(t0, g = 1) {
  const f = svf();
  voice(t0, 0.4, (t) => { let e = 0; for (const o of [0, 0.011, 0.022]) if (t >= o && t < o + 0.011) e += Math.exp(-(t - o) * 260);
    if (t >= 0.022) e += Math.exp(-(t - 0.022) * 17); f.run(noise() * e, 1350, 1.4); return f.bp * 1.6; }, [out(DRY, 0, 0.6 * g), out(REV, 0, 0.36 * g)]);
}
function hat(t0, open, vel, pan = 0.15) {
  const f = svf(), d = open ? 11 : 60;
  voice(t0, open ? 0.45 : 0.09, (t) => { f.run(noise(), 7600, 0.8); return f.hp * Math.exp(-t * d) * Math.min(1, t * 2000); }, [out(DRY, pan, 0.3 * vel), out(REV, pan, 0.07 * vel)]);
}
function shaker(t0, vel) {
  const f = svf();
  voice(t0, 0.08, (t) => { f.run(noise(), 5200, 0.7); return f.hp * Math.min(1, t / 0.006) * Math.exp(-t * 45); }, [out(DRY, -0.35, 0.18 * vel)]);
}
function perc(t0, fq, pan) {   // Conga-artiger Tom
  let ph = 0;
  voice(t0, 0.4, (t) => { ph += TAU * fq * (1 + 0.5 * Math.exp(-t * 40)) / SR; return Math.sin(ph) * Math.exp(-t * 16); }, [out(DRY, pan, 0.16), out(REV, pan, 0.06)]);
}
function bass(t0, m, len, cut = 520, q = 1.2) {
  const f = svf(), s = saw(mtof(m)); let ph = 0; const fq = mtof(m);
  voice(t0, len + 0.05, (t) => { ph += TAU * fq / SR; const c = 260 + cut * Math.exp(-t * 9); f.run(s(), c, q);
    return Math.tanh((f.lp * 0.9 + Math.sin(ph) * 0.8) * 1.6) * adsr(t, 0.004, 0.08, 0.85, len, 0.035); }, [out(MUS, 0, 0.42)]);
}
function organ(t0, notes, len) {
  notes.forEach((m, k) => { const fq = mtof(m); let ph = rnd() * TAU; const f = svf();
    voice(t0, len + 0.06, (t) => { ph += TAU * fq / SR; const p = ph;
      const v = Math.sin(p) + 0.6 * Math.sin(2 * p) + 0.33 * Math.sin(3 * p) + 0.22 * Math.sin(4 * p) * (0.4 + 0.6 * Math.exp(-t * 20)) + 0.08 * Math.sin(6 * p);
      f.run(v, 3200, 0.7); return f.lp * adsr(t, 0.003, 0.12, 0.7, len, 0.05); }, [out(MUS, (k - 1.5) * 0.25, 0.15), out(DLY, (k - 1.5) * 0.25, 0.05), out(REV, 0, 0.06)]); });
}
function piano(t0, notes, len, vel = 1) {
  notes.forEach((m, k) => { const fq = mtof(m), s = saw(fq), f = svf(); let ph = rnd() * TAU;
    voice(t0, len + 0.35, (t) => { ph += TAU * fq / SR; f.run(s(), 300 + 4200 * Math.exp(-t * 7), 0.8);
      const v = (f.lp * 0.45 + Math.sin(ph) * 0.6 + 0.2 * Math.sin(2 * ph) * Math.exp(-t * 9)) * Math.min(1, t * 500) * Math.exp(-t * 3) * (t > len ? Math.max(0, 1 - (t - len) / 0.3) : 1);
      return v * vel; }, [out(MUS, (k - 1.5) * 0.3, 0.16), out(REV, 0, 0.09)]); });
}
function sawStab(t0, notes, len) {
  notes.forEach((m, k) => { const a = saw(mtof(m) * 1.003), b = saw(mtof(m) * 0.997), f = svf();
    voice(t0, len + 0.06, (t) => { f.run((a() + b()) * 0.5, 260 + 2600 * Math.exp(-t * 16), 2.2); return f.lp * adsr(t, 0.002, 0.15, 0.4, len, 0.04); },
      [out(MUS, (k - 1.5) * 0.35, 0.17), out(DLY, (k - 1.5) * 0.35, 0.13), out(REV, 0, 0.08)]); });
}
function pad(t0, notes, len, g = 1) {
  notes.forEach((m, k) => [-1, 0, 1].forEach((d) => { const s = saw(mtof(m) * 2 ** (d * 8 / 1200)), f = svf();
    voice(t0, len + 0.7, (t) => { f.run(s(), 700 + 350 * Math.sin(TAU * 0.18 * (t0 + t)), 0.7); return f.lp * adsr(t, 0.45, 0.3, 0.8, len, 0.7); },
      [out(MUS, d * 0.65, 0.034 * g), out(REV, d * 0.65, 0.045 * g)]); }));
}
function pluck(t0, m, vel = 1, pan = 0) {
  const fq = mtof(m); let ph = 0, mp = 0;
  voice(t0, 0.9, (t) => { mp += TAU * fq * 2 / SR; ph += TAU * fq / SR + 1.6 * Math.exp(-t * 18) * Math.sin(mp) / 40; return Math.sin(ph) * Math.exp(-t * 6.5) * Math.min(1, t * 800) * vel; },
    [out(MUS, pan, 0.2), out(DLY, -pan, 0.11), out(REV, 0, 0.07)]);
}
function riser(t0, len) {
  const f = svf();
  voice(t0, len, (t) => { const p = t / len; f.run(noise(), 400 * 2 ** (p * 4), 2.5); return f.bp * p * p * 0.5; }, [out(DRY, 0, 0.5), out(REV, 0, 0.3)]);
}

/* ---------- Varianten ---------- */
const CH = {   // Akkord-Stab-Voicings (MIDI) + Bassgrundton
  Am9: { n: [60, 64, 67, 71], b: 33 }, Dm9: { n: [60, 64, 65, 69], b: 38 }, Fmaj9: { n: [57, 60, 64, 67], b: 41 }, Em7: { n: [59, 62, 64, 67], b: 40 },
  Fmaj7: { n: [65, 69, 72, 76], b: 41 }, G6: { n: [67, 71, 74, 76], b: 43 }, Em7h: { n: [64, 67, 71, 74], b: 40 }, Am7: { n: [64, 67, 69, 72], b: 33 },
  G6d: { n: [59, 62, 64, 67], b: 43 },
};
const VARS = {
  latch: { prog: ['Am9', 'Dm9', 'Fmaj9', 'Em7'], swing: 0.16, sc: 0.75,
    bass: [[2, 2, 0], [6, 1, 0], [7, 1, 0], [10, 2, 0], [13, 2, 12]], stab: [[3, 1.4], [6, 1.4], [11, 1.4], [14, 1.4]], stabFn: organ, padG: 0.8 },
  sugar: { prog: ['Fmaj7', 'G6', 'Em7h', 'Am7'], swing: 0.05, sc: 0.65,
    bass: [[2, 1, 0], [3, 1, 12], [6, 1, 0], [10, 1, 0], [11, 1, 12], [14, 1, 0]], stab: [[2, 1.6], [6, 1.6], [10, 1.6], [13, 0.9], [14, 1.6]], stabFn: piano, padG: 0.6,
    hook: [[[0, 76], [3, 74], [6, 72], [8, 74], [11, 76], [14, 79]], [[0, 81], [3, 79], [6, 76], [10, 74], [12, 72]]] },
  deep: { prog: ['Am9', 'Am9', 'Fmaj9', 'G6d'], swing: 0.1, sc: 0.8,
    bass: [[2, 3, 0], [7, 2, 0], [10, 4, 0]], bassCut: 300, stab: [[3, 1], [10, 1]], stabFn: sawStab, padG: 1.2,
    hook: [[[0, 72], [7, 71]], [[0, 67], [10, 69]]] },
};
const P = VARS[VAR]; if (!P) throw new Error('unknown variant ' + VAR);
VARS.latch.lift = [[[3, 76], [6, 74], [10, 72], [14, 69]], [[3, 72], [6, 74], [8, 76], [11, 79], [14, 76]]];   // sanfte Melodie für lange Fassungen
const st = (barStart, s) => barStart + s * step + (s % 2 ? P.swing * step : 0);

/* ---------- Abschnitte ----------
   --sections "0:intro,12:full,36:perc,…" (Startbeat:Stufe). Stufen:
   intro  Filter öffnet sich, Kick + geschlossene Hats, kein Bass/Clap · light  Groove ohne Clap und offene Hats (zum Lesen)
   full   voller Groove · perc  + Percussion bzw. Hook (sugar/deep) · lift  + Melodie · build  ohne Kick/Bass, Filter + Riser, Snare-Wirbel
   outro  Filter schließt sich, letzter Takt ohne Kick
   Standard reproduziert die 12-s-Hörproben. */
const DEF = VAR === 'latch' ? '0:intro,4:full,12:perc' : '0:intro,4:full,8:perc';
const SEC = sarg('sections', DEF).split(',').map((x) => { const [b, l] = x.split(':'); return { b: Number(b), l: l.trim() }; }).sort((a, b) => a.b - b.b);
const totalBeats = DUR / beat;
SEC.forEach((x, i) => { x.e = i + 1 < SEC.length ? SEC[i + 1].b : Math.ceil(totalBeats / 4) * 4; });
const secAt = (bt) => { let r = SEC[0]; for (const x of SEC) if (bt >= x.b) r = x; return r; };
const LV = { intro: 0, outro: 0, build: 0, light: 1, full: 2, perc: 3, lift: 4 };
const FILT = SEC.filter((x) => x.l === 'intro' || x.l === 'build' || x.l === 'outro').map((x) => ({ t0: x.b * beat, t1: x.e * beat, dir: x.l === 'outro' ? -1 : 1 }));

const bars = Math.ceil(DUR / barLen);
for (let bi = 0; bi < bars; bi++) {
  const b0 = bi * barLen, sec = secAt(bi * 4), L = sec.l, lv = LV[L] ?? 2, ch = CH[P.prog[bi % P.prog.length]];
  const quiet = L === 'intro' || L === 'build' || L === 'outro', lastOutro = L === 'outro' && bi * 4 + 4 >= sec.e;
  if (L !== 'build' && !lastOutro) for (let q = 0; q < 4; q++) kick(b0 + q * beat, L === 'intro' ? 0.85 : 1);
  if (lv >= 2) { clap(b0 + beat); clap(b0 + 3 * beat); }
  if (L === 'build') for (let k = 0; k < 16; k++) { const t = b0 + k * step; if (k >= 8 || k % 2 === 0) clap(t, 0.25 + 0.6 * (k / 16)); }
  for (let s = 0; s < 16; s++) {
    const t = st(b0, s);
    if (s % 4 === 2) { if (lv >= 2) hat(t, true, 0.9); else hat(t, false, 0.6); }
    else if (VAR !== 'sugar' || s % 2 === 0) hat(t, false, [0.55, 0.3, 0, 0.4][s % 4]);
    if (VAR === 'sugar' && lv >= 2) shaker(t, s % 2 ? 0.7 : 1);
  }
  if (lv >= 3 && VAR === 'latch') for (const [s, f, p] of [[7, 330, -0.5], [10, 250, 0.5], [15, 300, -0.3]]) perc(st(b0, s), f, p);
  if (lv >= 1 || (L === 'outro' && !lastOutro)) for (const [s, l, o] of P.bass) bass(st(b0, s), ch.b + o, l * step * 0.9, P.bassCut || 520);
  for (const [s, l] of P.stab) P.stabFn(st(b0, s), ch.n, l * step, quiet ? 0.6 : 1);
  pad(b0, ch.n.map((m) => m - 12), barLen * (lastOutro ? 1.6 : 0.92), P.padG);
  if (P.hook && lv >= 3) for (const [s, m] of P.hook[bi % 2]) pluck(st(b0, s), m, 0.9, s % 4 === 0 ? -0.3 : 0.3);
  if (P.lift && lv >= 4) for (const [s, m] of P.lift[bi % 2]) pluck(st(b0, s), m, 0.55, s % 4 === 0 ? -0.3 : 0.3);
}
// Riser vor jedem Übergang aus Intro/Build in den Groove
SEC.forEach((x, i) => { const nx = SEC[i + 1]; if (!nx || !(x.l === 'intro' || x.l === 'build') || nx.l === 'outro') return;
  const len = x.l === 'intro' ? barLen * 0.5 : Math.min((x.e - x.b) * beat, barLen * 2); riser(x.e * beat - len, len); });

/* ---------- SFX der Vorlage (optional) ---------- */
let cues = [];
if (CUES && existsSync(CUES)) {
  const S = {
    click: (t0, p, g) => voice(t0, 0.05, (t) => noise() * Math.exp(-t * 180) * 0.6 + Math.sin(TAU * 2400 * t) * Math.exp(-t * 300) * 0.4, [out(DRY, p, g)]),
    pop: (t0, p, g) => voice(t0, 0.15, (t) => Math.sin(TAU * (900 * Math.exp(-t * 25) + 180) * t) * Math.exp(-t * 35) * 0.7, [out(DRY, p, g)]),
    thump: (t0, p, g) => voice(t0, 0.3, (t) => Math.sin(TAU * (90 * Math.exp(-t * 18) + 40) * t) * Math.exp(-t * 14) * 0.9, [out(DRY, p, g)]),
    whoosh: (t0, p, g) => { const f = svf(); voice(t0, 0.5, (t) => { const w = Math.sin(Math.PI * Math.min(1, t / 0.5 * 1.2)); f.run(noise(), 600 + 3000 * t, 0.8); return f.bp * w * w * 0.9; }, [out(DRY, p, g)]); },
    tick: (t0, p, g) => voice(t0, 0.03, (t) => Math.sin(TAU * 4000 * t) * Math.exp(-t * 400) * 0.3, [out(DRY, p, g)]),
    ding: (t0, p, g) => voice(t0, 0.6, (t) => (Math.sin(TAU * 1320 * t) + 0.5 * Math.sin(TAU * 1980 * t)) * Math.exp(-t * 6) * 0.3, [out(DRY, p, g), out(REV, p, 0.3 * g)]),
  };
  const SG = arg('sfxgain', 0.5);   // SFX sitzen im Groove statt darüber
  cues = JSON.parse(readFileSync(CUES, 'utf8')); for (const c of cues) (S[c.sfx] || S.click)(c.t, c.pan || 0, SG);
}

/* ---------- Effekte ---------- */
function reverb(inL, inR, room = 0.84, damp = 0.3) {   // Freeverb
  const sc = SR / 44100, combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], aps = [556, 441, 341, 225];
  const mk = (sp) => ({ c: combs.map((d) => ({ b: new Float32Array(Math.round((d + sp) * sc)), i: 0, f: 0 })), a: aps.map((d) => ({ b: new Float32Array(Math.round((d + sp) * sc)), i: 0 })) });
  const run = (x, ch) => { let y = 0; for (const c of ch.c) { const o = c.b[c.i]; c.f = o * (1 - damp) + c.f * damp; c.b[c.i] = x * 0.015 + c.f * room; c.i = (c.i + 1) % c.b.length; y += o; }
    for (const a of ch.a) { const o = a.b[a.i]; a.b[a.i] = y + o * 0.5; a.i = (a.i + 1) % a.b.length; y = o - y; } return y; };
  const L = mk(0), R = mk(23), oL = new Float32Array(N), oR = new Float32Array(N);
  for (let i = 0; i < N; i++) { const x = (inL[i] + inR[i]); oL[i] = run(x, L); oR[i] = run(x, R); } return [oL, oR];
}
function pingpong(inL, inR, time, fb = 0.4) {
  const d = Math.round(time * SR), bL = new Float32Array(d), bR = new Float32Array(d), oL = new Float32Array(N), oR = new Float32Array(N); let i2 = 0, lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) { const yL = bL[i2], yR = bR[i2]; lpL += 0.45 * (yL - lpL); lpR += 0.45 * (yR - lpR);
    bL[i2] = inL[i] + inR[i] + lpR * fb; bR[i2] = lpL * fb; i2 = (i2 + 1) % d; oL[i] = yL; oR[i] = yR; } return [oL, oR];
}
const [rvL, rvR] = reverb(REV[0], REV[1]);
const [dlL, dlR] = pingpong(DLY[0], DLY[1], step * 3, VAR === 'deep' ? 0.5 : 0.38);

/* ---------- Sidechain (Ducking auf die Kick) + Intro-Filter + Master ---------- */
const sc = new Float32Array(N).fill(1);
for (const k of KICKS) { const i0 = Math.round(k * SR), len = Math.round(0.24 * SR);
  for (let j = 0; j < len && i0 + j < N; j++) { const x = j / len, g = 1 - P.sc * (1 - x * x * (3 - 2 * x)); sc[i0 + j] = Math.min(sc[i0 + j], g); } }
const fL = svf(), fR = svf(); let hpL = 0, hpR = 0, xl = 0, xr = 0;
const ML = new Float32Array(N), MR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR; let mL = MUS[0][i] * sc[i] + dlL[i] * (0.5 + 0.5 * sc[i]) + rvL[i] * (0.6 + 0.4 * sc[i]), mR = MUS[1][i] * sc[i] + dlR[i] * (0.5 + 0.5 * sc[i]) + rvR[i] * (0.6 + 0.4 * sc[i]);
  for (const f of FILT) if (t >= f.t0 && t < f.t1) { const p = (t - f.t0) / (f.t1 - f.t0), q = f.dir > 0 ? p : 1 - p; const c = 300 * 2 ** (6 * q * q); mL = fL.run(mL, c, 0.9); mR = fR.run(mR, c, 0.9); }   // Filterfahrten in Intro, Build, Outro
  let L = mL + DRY[0][i], R = mR + DRY[1][i];
  hpL = 0.9974 * (hpL + L - xl); xl = L; hpR = 0.9974 * (hpR + R - xr); xr = R;   // DC/Subsonic-Hochpass ~20 Hz
  ML[i] = hpL; MR[i] = hpR;
}
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(ML[i]), Math.abs(MR[i]));
const g = 1.15 / (peak || 1), fade = Math.round(0.06 * SR);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const fd = i > N - fade ? (N - i) / fade : 1;
  buf.writeInt16LE(Math.round(Math.tanh(ML[i] * g) * 0.89 * fd * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.tanh(MR[i] * g) * 0.89 * fd * 32767), 46 + i * 4); }
writeFileSync(OUT, buf);
if (CUES) { const nb = Math.ceil(DUR / beat), beats = Array.from({ length: nb }, (_, i) => +(i * beat).toFixed(3));
  writeFileSync('beats.json', JSON.stringify({ bpm: BPM, beats, downbeats: beats.filter((_, i) => i % 4 === 0), hits: cues.map((c) => c.t) }, null, 1)); }
console.log(`wrote ${OUT} (deep house "${VAR}", ${DUR}s @ ${BPM} BPM${cues.length ? `, ${cues.length} sfx cues` : ''})`);
