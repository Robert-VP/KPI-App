// node scripts/music_synthwave.mjs [--timeline templates/jobalarm-gta/timeline.mjs] [--out out/music_synthwave.wav] [--sfxgain 0.5]
// 80er-Synthwave (Neon/Vice-City-Gefühl), komplett im Code synthetisiert, eigene Komposition, lizenzfrei, deterministisch.
// Gated-Reverb-Snare, Oktav-Bass in Sechzehnteln, Arpeggio, breite Juno-Flächen, Brass-Lead; A-Moll (Am – F – C – G), Schluss in A-Dur mit Klang-Logo.
// Abschnitte und SFX kommen aus der Timeline-Datei: SECTIONS "Beat:Stufe,…" mit intro | drive | lead | lift | outro, dazu CUES und T.poster.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv;
const sarg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : d; };
const TL = await import(pathToFileURL(resolve(sarg('timeline', 'templates/jobalarm-gta/timeline.mjs'))).href);
const OUT = sarg('out', 'out/music_synthwave.wav'), SG = Number(sarg('sfxgain', 0.5));
const BPM = TL.BPM, DUR = TL.DUR, SR = 48000, N = Math.round(DUR * SR), TAU = Math.PI * 2;
const beat = 60 / BPM, step = beat / 4, BAR = beat * 4;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = 80;
const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;

/* ---------- Busse ---------- */
const bus = () => [new Float32Array(N), new Float32Array(N)];
const DRY = bus(), MUS = bus(), REV = bus(), DLY = bus(), SFX = bus();
const out = (b, pan, g) => ({ b, gl: g * Math.cos((pan + 1) * Math.PI / 4), gr: g * Math.sin((pan + 1) * Math.PI / 4) });
function voice(t0, len, fn, outs) {
  const i0 = Math.max(0, Math.round(t0 * SR)), i1 = Math.min(N, Math.round((t0 + len) * SR));
  for (let i = i0; i < i1; i++) { const v = fn((i - i0) / SR); if (v === 0) continue; for (const o of outs) { o.b[0][i] += v * o.gl; o.b[1][i] += v * o.gr; } }
}

/* ---------- DSP-Bausteine ---------- */
function svf() {
  let ic1 = 0, ic2 = 0; const o = { lp: 0, bp: 0, hp: 0 };
  o.run = (x, fc, q) => { const g = Math.tan(Math.PI * Math.min(fc, SR * 0.45) / SR), k = 1 / q; const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
    const v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3; ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2; o.lp = v2; o.bp = v1; o.hp = x - k * v1 - v2; return v2; };
  return o;
}
const blep = (p, dt) => { if (p < dt) { p /= dt; return p + p - p * p - 1; } if (p > 1 - dt) { p = (p - 1) / dt; return p * p + p + p + 1; } return 0; };
function saw(f, lfo = 0) { let p = rnd(), t = 0; return () => { t += 1 / SR; const dt = f * (1 + lfo * Math.sin(TAU * 0.6 * t + p * 6)) / SR; p += dt; if (p >= 1) p -= 1; return 2 * p - 1 - blep(p, dt); }; }
function square(f, pw = 0.5) { let p = rnd(); const dt = f / SR; return () => { p += dt; if (p >= 1) p -= 1; let v = p < pw ? 1 : -1; v += blep(p, dt); const q = (p - pw + 1) % 1; v -= blep(q, dt); return v; }; }
const adsr = (t, a, d, s, len, r) => { let v; if (t < a) v = t / a; else if (t < a + d) v = 1 - (1 - s) * (t - a) / d; else v = s; if (t > len) v *= Math.max(0, 1 - (t - len) / r); return v; };

/* ---------- Instrumente ---------- */
const KICKS = [];
function kick(t0, g = 1) {   // 80er-Drumcomputer
  KICKS.push(t0); let ph = 0;
  voice(t0, 0.45, (t) => { ph += TAU * (52 + 110 * Math.exp(-t * 30)) / SR; return Math.tanh(Math.sin(ph) * Math.exp(-t * 9) * 2.2) * 0.9 + (t < 0.004 ? noise() * 0.3 : 0); }, [out(DRY, 0, 0.6 * g)]);
}
function snare(t0, g = 1) {   // Gated-Reverb-Snare: dichter Rauschschwanz, der hart abreißt
  const f = svf(), f2 = svf(); let ph = 0;
  voice(t0, 0.32, (t) => { ph += TAU * (185 + 40 * Math.exp(-t * 40)) / SR; f.run(noise(), 2400, 0.7); f2.run(noise(), 6000, 0.6);
    const gate = t < 0.24 ? 1 - 0.35 * t / 0.24 : Math.max(0, 1 - (t - 0.24) / 0.015);
    return (Math.sin(ph) * 0.7 * Math.exp(-t * 28) + f.bp * 1.1 * (0.35 + 0.65 * Math.exp(-t * 30)) * gate + f2.hp * 0.35 * Math.exp(-t * 18)) * g; },
    [out(DRY, 0.05, 0.42), out(REV, 0, 0.1)]);
}
function hat(t0, vel, open = false) { const f = svf(); voice(t0, open ? 0.3 : 0.06, (t) => { f.run(noise(), 8200, 0.7); return f.hp * Math.exp(-t * (open ? 14 : 70)); }, [out(DRY, 0.25, 0.22 * vel)]); }
function tom(t0, m, g = 1) { let ph = 0; const fq = mtof(m); voice(t0, 0.5, (t) => { ph += TAU * fq * (1 + 0.8 * Math.exp(-t * 18)) / SR; return Math.sin(ph) * Math.exp(-t * 7); }, [out(DRY, (m - 45) / 20, 0.38 * g), out(REV, 0, 0.18 * g)]); }
function crash(t0, g = 1) { const f = svf(); voice(t0, 2.4, (t) => { f.run(noise(), 5000, 0.6); return f.hp * Math.exp(-t * 1.9) * Math.min(1, t * 600); }, [out(DRY, 0.3, 0.2 * g), out(REV, -0.3, 0.14 * g)]); }
function riser(t0, len, g = 1) { const f = svf(); voice(t0, len, (t) => { const p = t / len; f.run(noise(), 400 * 2 ** (p * 4.5), 2.5); return f.bp * p * p * 0.5 * g; }, [out(DRY, 0, 0.5), out(REV, 0, 0.3)]); }
function bass(t0, m, len, cut = 900) {   // Sägezahn-Bass, Filter schnappt zu
  const a = saw(mtof(m)), b = saw(mtof(m) * 1.004), f = svf();
  voice(t0, len + 0.02, (t) => { f.run((a() + b()) * 0.5, 120 + cut * Math.exp(-t * 22), 1.4); return Math.tanh(f.lp * 1.8) * adsr(t, 0.002, 0.05, 0.75, len, 0.015); }, [out(MUS, 0, 0.32)]);
}
function arp(t0, m, cut, vel = 1, pan = 0) {
  const s = square(mtof(m), 0.3), f = svf();
  voice(t0, 0.25, (t) => { f.run(s(), 300 + cut * Math.exp(-t * 20), 1.8); return f.lp * adsr(t, 0.002, 0.06, 0.25, 0.1, 0.06) * vel; }, [out(MUS, pan, 0.11), out(DLY, -pan, 0.08), out(REV, 0, 0.04)]);
}
function pad(t0, notes, len, g = 1, cut = 1700) {   // Juno-Fläche mit Chorus
  notes.forEach((m, k) => [-9, -3, 3, 9].forEach((c, j) => { const s = saw(mtof(m) * 2 ** (c / 1200), 0.0025), f = svf(), pan = (j / 1.5 - 1) * 0.85;
    voice(t0, len + 0.9, (t) => { f.run(s(), cut + 400 * Math.sin(TAU * 0.2 * (t0 + t)), 0.7); return f.lp * adsr(t, 0.12, 0.3, 0.85, len, 0.9); }, [out(MUS, pan, 0.028 * g), out(REV, pan, 0.03 * g)]); }));
}
function lead(t0, m, len, g = 1) {   // Brass-Lead mit Vibrato
  const s1 = saw(mtof(m) * 1.003), s2 = saw(mtof(m) * 0.997), sq = square(mtof(m + 12), 0.5), f = svf(); let tt = 0;
  voice(t0, len + 0.35, (t) => { tt = t; const v = (s1() + s2()) * 0.45 + sq() * 0.12; f.run(v, 900 + 2600 * Math.min(1, t / 0.06) * (0.7 + 0.3 * Math.exp(-t * 3)), 1.1); return Math.tanh(f.lp * 1.3) * adsr(t, 0.02, 0.2, 0.8, len, 0.3) * g; },
    [out(MUS, 0, 0.17), out(DLY, 0, 0.08), out(REV, 0, 0.1)]);
}
function bell(t0, m, g = 1) {   // Klang-Logo
  const fq = mtof(m); let pc = 0, pm = 0, ps = 0;
  voice(t0, 3.2, (t) => { pc += TAU * fq / SR; pm += TAU * fq * 2 / SR; ps += TAU * fq * 4.01 / SR;
    return (Math.sin(pc + 2.4 * Math.exp(-t * 2.6) * Math.sin(pm)) + 0.22 * Math.sin(ps) * Math.exp(-t * 5)) * Math.exp(-t * 1.3) * Math.min(1, t * 700) * g; }, [out(MUS, 0, 0.2), out(REV, 0, 0.12), out(DLY, 0, 0.05)]);
}

/* ---------- Arrangement ---------- */
const CH = { Am: [45, 3], F: [41, 4], C: [48, 4], G: [43, 4], A: [45, 4], D: [50, 4] };
const PROG = ['Am', 'F', 'C', 'G'];
const SEC = TL.SECTIONS.split(',').map((x) => { const [b, l] = x.split(':'); return { t0: Number(b) * beat, l: l.trim() }; });
SEC.forEach((x, i) => { x.t1 = i + 1 < SEC.length ? SEC[i + 1].t0 : DUR; });
const LEAD = [   // eigene Melodie, je Takt [Beat, MIDI, Beats]
  [[0, 76, 1.5], [1.5, 74, 0.5], [2, 72, 1], [3, 74, 1]], [[0, 72, 1.5], [1.5, 69, 0.5], [2, 72, 2]],
  [[0, 76, 1], [1, 79, 1.5], [2.5, 76, 0.5], [3, 74, 1]], [[0, 74, 2], [2, 71, 1], [3, 74, 1]]];
const LIFT = [[[0, 81, 2], [2, 79, 1], [3, 76, 1]], [[0, 77, 2], [2, 76, 1], [3, 72, 1]], [[0, 76, 1], [1, 79, 1], [2, 81, 2]], [[0, 83, 4]]];
let bi = 0;
for (const S of SEC) {
  for (let b = S.t0, k = 0; b < S.t1 - 1e-6; b += BAR, k++, bi++) {
    const outro = S.l === 'outro', name = outro ? 'A' : PROG[bi % 4], [r, th] = CH[name], tri = [r, r + th, r + 7], last = b + BAR >= S.t1 - 1e-6;
    const lvl = { intro: 0, drive: 1, lead: 2, lift: 3, outro: 1 }[S.l];
    pad(b, tri.map((m) => m + 12), BAR * 0.97, S.l === 'intro' ? 0.8 : 1, S.l === 'intro' ? 900 + 800 * k : 1700);
    for (let i = 0; i < 16; i++) { const tt = b + i * step, pat = [0, 7, 12, th, 7, 12, th + 12, 12]; arp(tt, r + 24 + pat[i % 8], S.l === 'intro' ? 900 : 2200 + 600 * Math.sin(TAU * tt / (2 * BAR)), i % 4 === 0 ? 1 : 0.7, i % 2 ? 0.4 : -0.4); }
    if (lvl >= 1 && !(outro && k >= 1)) {
      for (let q = 0; q < 4; q++) kick(b + q * beat);
      snare(b + beat); snare(b + 3 * beat, last && lvl >= 2 ? 1.1 : 1);
      for (let i = 0; i < 16; i++) hat(b + i * step, i % 2 ? 0.45 : 0.8, i % 8 === 6 && lvl >= 2);
      for (let i = 0; i < 16; i++) bass(b + i * step, r - 12 + (i % 2 ? 12 : 0), step * 0.85, lvl >= 2 ? 1200 : 900);
    } else if (outro) { for (let i = 0; i < 8; i++) bass(b + i * 2 * step, r - 12 + (i % 2 ? 12 : 0), step * 1.7, 600); }
    if (S.l === 'lead') for (const [q, m, l] of LEAD[k % 4]) lead(b + q * beat, m, l * beat * 0.95);
    if (S.l === 'lift') for (const [q, m, l] of LIFT[k % 4]) lead(b + q * beat, m, l * beat * 0.95, 1.05);
    if (last && lvl >= 1 && !outro) for (let i = 0; i < 4; i++) tom(b + 3 * beat + i * step, 52 - i * 4, 0.7 + 0.1 * i);   // 80er-Tom-Fill in den nächsten Abschnitt
    if (k === 0 && lvl >= 1) crash(b, outro ? 1 : 0.8);
  }
  if (S.l === 'intro') riser(S.t1 - 1.6, 1.6, 0.8);
}
// Klang-Logo beim Plakat, dazu Schlussakkord in A-Dur
const P0 = TL.T.poster;
[[0.3, 64], [0.65, 69], [1.0, 73]].forEach(([d, m]) => bell(P0 + d, m, 1));
lead(DUR - 4, 81, 2.8, 0.5); lead(DUR - 4, 76, 2.8, 0.45); lead(DUR - 4, 73, 2.8, 0.45);

/* ---------- SFX der Vorlage ---------- */
const SX = {
  click: (t0, p, g) => voice(t0, 0.05, (t) => noise() * Math.exp(-t * 180) * 0.6 + Math.sin(TAU * 2400 * t) * Math.exp(-t * 300) * 0.4, [out(SFX, p, g)]),
  pop: (t0, p, g) => voice(t0, 0.15, (t) => Math.sin(TAU * (900 * Math.exp(-t * 25) + 180) * t) * Math.exp(-t * 35) * 0.7, [out(SFX, p, g)]),
  thump: (t0, p, g) => voice(t0, 0.3, (t) => Math.sin(TAU * (90 * Math.exp(-t * 18) + 40) * t) * Math.exp(-t * 14) * 0.9, [out(SFX, p, g)]),
  whoosh: (t0, p, g) => { const f = svf(); voice(t0, 0.5, (t) => { const w = Math.sin(Math.PI * Math.min(1, t / 0.5 * 1.2)); f.run(noise(), 600 + 3000 * t, 0.8); return f.bp * w * w * 0.9; }, [out(SFX, p, g)]); },
  tick: (t0, p, g) => voice(t0, 0.03, (t) => Math.sin(TAU * 4000 * t) * Math.exp(-t * 400) * 0.3, [out(SFX, p, g)]),
  ding: (t0, p, g) => voice(t0, 0.6, (t) => (Math.sin(TAU * 1320 * t) + 0.5 * Math.sin(TAU * 1980 * t)) * Math.exp(-t * 6) * 0.3, [out(SFX, p, g)]),
  zap: (t0, p, g) => { const f = svf(); voice(t0, 0.18, (t) => { f.run(noise(), 1200, 3); return (f.bp * 0.8 + Math.sign(Math.sin(TAU * 120 * t)) * 0.15) * Math.exp(-t * 14); }, [out(SFX, p, g)]); },   // Neonröhre zündet
  bell: (t0, p, g) => { for (let i = 0; i < 6; i++) voice(t0 + i * 0.09, 0.5, (t) => (Math.sin(TAU * 2100 * t) + 0.6 * Math.sin(TAU * 2830 * t)) * Math.exp(-t * 9) * 0.22, [out(SFX, p * (i % 2 ? -1 : 1), g)]); },   // Klingel
};
for (const c of TL.CUES) (SX[c.sfx] || SX.click)(c.t, c.pan || 0, SG);

/* ---------- Effekte und Master ---------- */
function reverb(inL, inR, room, damp) {
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
const [rvL, rvR] = reverb(REV[0], REV[1], 0.88, 0.25);
const [dlL, dlR] = pingpong(DLY[0], DLY[1], step * 3, 0.4);
const sc = new Float32Array(N).fill(1);
for (const k of KICKS) { const i0 = Math.round(k * SR), len = Math.round(0.2 * SR); for (let j = 0; j < len && i0 + j < N; j++) { const x = j / len; sc[i0 + j] = Math.min(sc[i0 + j], 1 - 0.45 * (1 - x * x * (3 - 2 * x))); } }
const ML = new Float32Array(N), MR = new Float32Array(N); let hpL = 0, hpR = 0, xl = 0, xr = 0, pk = 0;
for (let i = 0; i < N; i++) {
  const L = MUS[0][i] * sc[i] + dlL[i] * (0.6 + 0.4 * sc[i]) + rvL[i] + DRY[0][i], R = MUS[1][i] * sc[i] + dlR[i] * (0.6 + 0.4 * sc[i]) + rvR[i] + DRY[1][i];
  hpL = 0.9974 * (hpL + L - xl); xl = L; hpR = 0.9974 * (hpR + R - xr); xr = R; ML[i] = hpL; MR[i] = hpR; pk = Math.max(pk, Math.abs(hpL), Math.abs(hpR));
}
let pk2 = 0; for (let i = 0; i < N; i++) { ML[i] = ML[i] / pk + SFX[0][i] * 0.6; MR[i] = MR[i] / pk + SFX[1][i] * 0.6; pk2 = Math.max(pk2, Math.abs(ML[i]), Math.abs(MR[i])); }
const g = 1.15 / pk2, fade = Math.round(1.2 * SR), buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const fd = i > N - fade ? (N - i) / fade : 1;
  buf.writeInt16LE(Math.round(Math.tanh(ML[i] * g) * 0.89 * fd * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.tanh(MR[i] * g) * 0.89 * fd * 32767), 46 + i * 4); }
writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (synthwave, ${DUR}s @ ${BPM} BPM, ${TL.CUES.length} sfx cues)`);
