// node scripts/music_trailer.mjs --style rock|funk|trap [--dur 20] [--out out/x.wav]
// Hörproben für den Job-Alarm-Trailer in Richtung der GTA-VI-Trailer-Stimmung, eigene Kompositionen, im Code synthetisiert (lizenzfrei).
//   rock  A · 80er-Rockballade, 94 BPM, H-Moll/D-Dur (Bm – G – D – A): Gitarren (Karplus-Strong), große Gated-Drums, warme Orgel – melancholisch, Roadmovie
//   funk  B · 80er-Funk-Pop, 112 BPM, E-Moll (Em7 – A7): Slap-Bass, Funk-Gitarre, Bläser-Stöße, Claps – sonnig, Miami-Strand
//   trap  C · moderner Hip-Hop/Trap, 140 BPM halbtaktig, F-Moll: 808-Bass mit Glide, Hi-Hat-Rolls, dunkle Glocken – Straße, Nacht
import { writeFileSync } from 'node:fs';

const argv = process.argv;
const sarg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : d; };
const STYLE = sarg('style', 'rock'), DUR = Number(sarg('dur', 20)), OUT = sarg('out', `out/trailer_${STYLE}.wav`);
const BPM = { rock: 94, funk: 112, trap: 140 }[STYLE]; if (!BPM) throw new Error('unknown style ' + STYLE);
const SR = 48000, N = Math.round(DUR * SR), TAU = Math.PI * 2, beat = 60 / BPM, step = beat / 4, BAR = beat * 4;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = 61;
const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;
const bus = () => [new Float32Array(N), new Float32Array(N)];
const DRY = bus(), MUS = bus(), REV = bus(), DLY = bus();
const out = (b, pan, g) => ({ b, gl: g * Math.cos((pan + 1) * Math.PI / 4), gr: g * Math.sin((pan + 1) * Math.PI / 4) });
function voice(t0, len, fn, outs) { const i0 = Math.max(0, Math.round(t0 * SR)), i1 = Math.min(N, Math.round((t0 + len) * SR));
  for (let i = i0; i < i1; i++) { const v = fn((i - i0) / SR); if (v === 0) continue; for (const o of outs) { o.b[0][i] += v * o.gl; o.b[1][i] += v * o.gr; } } }
function svf() { let ic1 = 0, ic2 = 0; const o = { lp: 0, bp: 0, hp: 0 };
  o.run = (x, fc, q) => { const g = Math.tan(Math.PI * Math.min(fc, SR * 0.45) / SR), k = 1 / q; const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
    const v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3; ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2; o.lp = v2; o.bp = v1; o.hp = x - k * v1 - v2; return v2; }; return o; }
const blep = (p, dt) => { if (p < dt) { p /= dt; return p + p - p * p - 1; } if (p > 1 - dt) { p = (p - 1) / dt; return p * p + p + p + 1; } return 0; };
function saw(f) { let p = rnd(); const dt = f / SR; return () => { p += dt; if (p >= 1) p -= 1; return 2 * p - 1 - blep(p, dt); }; }
const adsr = (t, a, d, s, len, r) => { let v; if (t < a) v = t / a; else if (t < a + d) v = 1 - (1 - s) * (t - a) / d; else v = s; if (t > len) v *= Math.max(0, 1 - (t - len) / r); return v; };

/* ---------- Instrumente ---------- */
function ks(t0, m, len, o) {   // Gitarrensaite (Karplus-Strong), o: { bright, decay, drive, pan, g }
  const f = mtof(m), d = Math.max(2, Math.round(SR / f)), buf = new Float32Array(d); for (let i = 0; i < d; i++) buf[i] = noise() * (0.5 + 0.5 * o.bright); let i = 0, last = 0;
  const damp = 0.5 - 0.04 * (1 - o.bright), fb = o.decay;
  voice(t0, len + 0.08, (t) => { const y = buf[i], nx = buf[(i + 1) % d]; buf[i] = (y * damp + nx * (1 - damp)) * fb; i = (i + 1) % d;
    const mute = t > len ? Math.max(0, 1 - (t - len) / 0.06) : 1; return Math.tanh(y * o.drive) / Math.tanh(o.drive) * mute; }, [out(MUS, o.pan, 0.2 * o.g), out(REV, o.pan, 0.06 * o.g)]);
}
const strum = (t0, notes, len, o, dn = true) => (dn ? notes : [...notes].reverse()).forEach((m, k) => ks(t0 + k * 0.012, m, len, { ...o, pan: o.pan + (k - 2) * 0.08 }));
function kick(t0, g = 1, f0 = 50) { let ph = 0; voice(t0, 0.5, (t) => { ph += TAU * (f0 + 110 * Math.exp(-t * 28)) / SR; return Math.tanh(Math.sin(ph) * Math.exp(-t * 8) * 2.2) * 0.9 + (t < 0.004 ? noise() * 0.3 : 0); }, [out(DRY, 0, 0.6 * g)]); }
function snare(t0, g = 1, gated = true) { const f = svf(), f2 = svf(); let ph = 0;
  voice(t0, 0.4, (t) => { ph += TAU * (185 + 40 * Math.exp(-t * 40)) / SR; f.run(noise(), 2300, 0.7); f2.run(noise(), 6000, 0.6);
    const tail = gated ? (t < 0.26 ? 1 - 0.3 * t / 0.26 : Math.max(0, 1 - (t - 0.26) / 0.015)) : Math.exp(-t * 14);
    return (Math.sin(ph) * 0.7 * Math.exp(-t * 26) + f.bp * (0.3 + 0.7 * Math.exp(-t * 30)) * tail + f2.hp * 0.3 * Math.exp(-t * 18)) * g; }, [out(DRY, 0.05, 0.4), out(REV, 0, 0.12)]); }
function clap(t0, g = 1) { const f = svf(); voice(t0, 0.35, (t) => { let e = 0; for (const o of [0, 0.01, 0.02]) if (t >= o && t < o + 0.01) e += Math.exp(-(t - o) * 250); if (t >= 0.02) e += Math.exp(-(t - 0.02) * 16); f.run(noise() * e, 1400, 1.3); return f.bp * 1.6; }, [out(DRY, 0, 0.42 * g), out(REV, 0, 0.25 * g)]); }
function hat(t0, vel, open = false, pan = 0.25) { const f = svf(); voice(t0, open ? 0.3 : 0.05, (t) => { f.run(noise(), 8500, 0.7); return f.hp * Math.exp(-t * (open ? 13 : 75)); }, [out(DRY, pan, 0.22 * vel)]); }
function tom(t0, m, g = 1) { let ph = 0; const fq = mtof(m); voice(t0, 0.6, (t) => { ph += TAU * fq * (1 + 0.7 * Math.exp(-t * 16)) / SR; return Math.sin(ph) * Math.exp(-t * 6); }, [out(DRY, (m - 45) / 18, 0.4 * g), out(REV, 0, 0.2 * g)]); }
function crash(t0, g = 1) { const f = svf(); voice(t0, 2.5, (t) => { f.run(noise(), 5000, 0.6); return f.hp * Math.exp(-t * 1.8) * Math.min(1, t * 600); }, [out(DRY, 0.3, 0.18 * g), out(REV, -0.3, 0.12 * g)]); }
function bassGtr(t0, m, len, g = 1, slap = 0) { const f = svf(); let ph = 0; const fq = mtof(m), s = saw(fq);
  voice(t0, len + 0.03, (t) => { ph += TAU * fq / SR; f.run(s(), 220 + (700 + 2500 * slap) * Math.exp(-t * (14 - 6 * slap)), 1.2); return Math.tanh((f.lp * 0.8 + Math.sin(ph) * 0.7) * (1.4 + slap)) * adsr(t, 0.003, 0.1, 0.7, len, 0.03) * g; }, [out(MUS, 0, 0.36)]); }
function organ(t0, notes, len, g = 1) { notes.forEach((m, k) => { const fq = mtof(m); let ph = rnd() * TAU; const f = svf();
  voice(t0, len + 0.3, (t) => { ph += TAU * fq * (1 + 0.002 * Math.sin(TAU * 6 * t)) / SR; const v = Math.sin(ph) + 0.5 * Math.sin(2 * ph) + 0.3 * Math.sin(3 * ph) + 0.15 * Math.sin(4 * ph); f.run(v, 2400, 0.7); return f.lp * adsr(t, 0.08, 0.2, 0.85, len, 0.3) * g; }, [out(MUS, (k - 1.5) * 0.3, 0.06), out(REV, 0, 0.05)]); }); }
function pad(t0, notes, len, g = 1, cut = 1600) { notes.forEach((m) => [-8, 0, 8].forEach((c, j) => { const s = saw(mtof(m) * 2 ** (c / 1200)), f = svf();
  voice(t0, len + 0.8, (t) => { f.run(s(), cut, 0.7); return f.lp * adsr(t, 0.4, 0.3, 0.85, len, 0.8); }, [out(MUS, (j - 1) * 0.7, 0.03 * g), out(REV, (j - 1) * 0.7, 0.04 * g)]); })); }
function brass(t0, notes, len, g = 1) { notes.forEach((m) => [-6, 6].forEach((c, j) => { const s = saw(mtof(m) * 2 ** (c / 1200)), f = svf();
  voice(t0, len + 0.15, (t) => { f.run(s(), 400 + 3000 * Math.min(1, t / 0.03) * Math.exp(-t * 4), 1.0); return Math.tanh(f.lp * 1.5) * adsr(t, 0.01, 0.1, 0.7, len, 0.1) * g; }, [out(MUS, (j - 0.5) * 0.6, 0.06), out(REV, 0, 0.05)]); })); }
function lead(t0, m, len, g = 1) { const a = saw(mtof(m) * 1.003), b = saw(mtof(m) * 0.997), f = svf();
  voice(t0, len + 0.3, (t) => { f.run((a() + b()) * 0.5, 1200 + 2200 * Math.min(1, t / 0.05), 1.0); return Math.tanh(f.lp * 1.4) * adsr(t, 0.02, 0.2, 0.8, len, 0.25) * g; }, [out(MUS, 0, 0.14), out(DLY, 0, 0.07), out(REV, 0, 0.08)]); }
function bellFM(t0, m, g = 1) { const fq = mtof(m); let pc = 0, pm = 0; voice(t0, 2.5, (t) => { pc += TAU * fq / SR; pm += TAU * fq * 3.5 / SR; return Math.sin(pc + 2 * Math.exp(-t * 3) * Math.sin(pm)) * Math.exp(-t * 1.8) * Math.min(1, t * 600) * g; }, [out(MUS, 0, 0.16), out(DLY, 0, 0.08), out(REV, 0, 0.12)]); }
function k808(t0, m, len, m2 = null, g = 1) { let ph = 0; const f1 = mtof(m), f2 = mtof(m2 ?? m);
  voice(t0, len + 0.05, (t) => { const u = Math.min(1, t / len), fq = (m2 === null ? f1 : f1 + (f2 - f1) * Math.min(1, Math.max(0, (u - 0.5) * 3))) * (1 + 1.5 * Math.exp(-t * 40)); ph += TAU * fq / SR;
    return Math.tanh(Math.sin(ph) * 2.2) * (t > len ? Math.max(0, 1 - (t - len) / 0.05) : 1) * Math.min(1, t * 400) * g; }, [out(DRY, 0, 0.5)]); }

/* ---------- Arrangements ---------- */
const bars = Math.ceil(DUR / BAR);
if (STYLE === 'rock') {   // Bm – G – D – A, Gitarren-Achtel, große Drums ab Takt 3, Melodie ab Takt 5
  const CH = [[47, [59, 62, 66, 71]], [43, [55, 59, 62, 67]], [50, [57, 62, 66, 69]], [45, [57, 61, 64, 69]]];
  const MEL = [[[0, 74, 1.5], [1.5, 73, 0.5], [2, 71, 2]], [[0, 71, 1], [1, 74, 1], [2, 76, 2]], [[0, 78, 1.5], [1.5, 76, 0.5], [2, 74, 2]], [[0, 73, 3], [3, 69, 1]]];
  for (let b = 0; b < bars; b++) { const t0 = b * BAR, [r, ch] = CH[b % 4], full = b >= 2;
    organ(t0, ch.map((m) => m - 12), BAR * 0.98, full ? 1 : 0.7);
    for (let i = 0; i < 8; i++) { const tt = t0 + i * beat / 2; if (i === 0 || (full && i === 4)) strum(tt, ch, beat * 1.6, { bright: 0.9, decay: 0.997, drive: 2.5, pan: -0.4, g: 1 });
      else ks(tt, ch[i % 2 ? 1 : 0] - 12, beat * 0.3, { bright: 0.5, decay: 0.99, drive: 3, pan: 0.45, g: full ? 0.9 : 0.6 }); }
    if (full) { for (let q = 0; q < 4; q++) { if (q % 2 === 0) kick(t0 + q * beat); else snare(t0 + q * beat); } kick(t0 + 2.5 * beat, 0.7); for (let i = 0; i < 8; i++) hat(t0 + i * beat / 2, i % 2 ? 0.5 : 0.8);
      for (let i = 0; i < 8; i++) bassGtr(t0 + i * beat / 2, r - 12, beat / 2 * 0.9, 1); if (b === 2) crash(t0); if (b % 4 === 3) [0, 1, 2, 3].forEach((k) => tom(t0 + 3 * beat + k * step, 50 - k * 4, 0.8)); }
    if (b >= 4) for (const [q, m, l] of MEL[b % 4]) lead(t0 + q * beat, m, l * beat * 0.95, 0.9);
  }
}
if (STYLE === 'funk') {   // Em7 – A7, Slap-Bass, Chicken-Scratch-Gitarre, Bläser
  const CH = [[40, [64, 67, 71, 74]], [45, [64, 67, 69, 73]]], BASS = [[0, 0, 0], [3, 12, 1], [4, 0, 0], [6, 10, 0], [7, 12, 1], [10, 0, 0], [11, 12, 1], [12, 7, 0], [14, 10, 0], [15, 12, 1]];
  for (let b = 0; b < bars; b++) { const t0 = b * BAR, [r, ch] = CH[b % 2], full = b >= 1;
    pad(t0, ch.map((m) => m - 12), BAR * 0.97, 0.8, 1300);
    for (let i = 0; i < 16; i++) { const tt = t0 + i * step + (i % 2 ? 0.08 * step : 0); if ([2, 6, 10, 14].includes(i)) strum(tt, ch, step * 0.6, { bright: 1, decay: 0.98, drive: 1.6, pan: 0.4, g: 0.8 }, i % 4 === 2);
      else if (full) ks(tt, ch[1], step * 0.15, { bright: 0.8, decay: 0.95, drive: 1, pan: 0.4, g: 0.35 }); }
    if (full) { for (let q = 0; q < 4; q++) { kick(t0 + q * beat, 0.9, 56); if (q % 2) { clap(t0 + q * beat); snare(t0 + q * beat, 0.6, false); } } for (let i = 0; i < 16; i++) hat(t0 + i * step, i % 4 === 2 ? 0.9 : 0.4, i % 4 === 2);
      for (const [s, o, sl] of BASS) bassGtr(t0 + s * step, r - 12 + o, step * 0.9, 1, sl); }
    if (b >= 2 && b % 2 === 0) { brass(t0 + 3.5 * beat, [76, 79, 83], step * 1.5); brass(t0 + 3.75 * beat, [76, 79, 83], step * 2); }
    if (b >= 4) [[0, 83], [0.75, 81], [1.5, 79], [2.5, 76]].forEach(([q, m]) => brass(t0 + q * beat, [m, m - 12], step * 2.6, 0.9));
    if (b === 1 || b === 4) crash(t0, 0.8);
  }
}
if (STYLE === 'trap') {   // F-Moll, halbtaktig: Snare auf 3, 808 mit Glide, Hi-Hat-Rolls, dunkle Glocken
  const ROOT = [41, 41, 37, 39], MEL = [77, 80, 79, 75, 77, 72, 75, 70];
  for (let b = 0; b < bars; b++) { const t0 = b * BAR, r = ROOT[b % 4], full = b >= 2;
    pad(t0, [r + 24, r + 27, r + 31], BAR * 0.97, 0.9, 900);
    for (let i = 0; i < 8; i++) bellFM(t0 + i * beat / 2, MEL[(i + b * 3) % 8] - (i % 3 === 2 ? 12 : 0), i % 2 ? 0.5 : 0.8);
    if (full) { kick(t0, 1, 46); k808(t0, r - 12, beat * 1.4, null); kick(t0 + 1.75 * beat, 0.8, 46); k808(t0 + 1.75 * beat, r - 12, beat * 0.9, b % 2 ? r - 7 : r - 14); k808(t0 + 3 * beat, r - 12, beat * 0.8);
      snare(t0 + 2 * beat, 1, false); clap(t0 + 2 * beat, 0.9);
      for (let i = 0; i < 16; i++) { const tt = t0 + i * step; if (i === 14 && b % 2) { for (let k = 0; k < 6; k++) hat(tt + k * step / 3, 0.4 + k * 0.08); i++; continue; } hat(tt, i % 2 ? 0.45 : 0.75, false, 0.2); }
      if (b === 2) crash(t0); }
  }
}

/* ---------- Effekte, Master ---------- */
function reverb(inL, inR, room, damp) { const sc = SR / 44100, combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], aps = [556, 441, 341, 225];
  const mk = (sp) => ({ c: combs.map((d) => ({ b: new Float32Array(Math.round((d + sp) * sc)), i: 0, f: 0 })), a: aps.map((d) => ({ b: new Float32Array(Math.round((d + sp) * sc)), i: 0 })) });
  const run = (x, ch) => { let y = 0; for (const c of ch.c) { const o = c.b[c.i]; c.f = o * (1 - damp) + c.f * damp; c.b[c.i] = x * 0.015 + c.f * room; c.i = (c.i + 1) % c.b.length; y += o; }
    for (const a of ch.a) { const o = a.b[a.i]; a.b[a.i] = y + o * 0.5; a.i = (a.i + 1) % a.b.length; y = o - y; } return y; };
  const L = mk(0), R = mk(23), oL = new Float32Array(N), oR = new Float32Array(N); for (let i = 0; i < N; i++) { const x = inL[i] + inR[i]; oL[i] = run(x, L); oR[i] = run(x, R); } return [oL, oR]; }
function pingpong(inL, inR, time, fb = 0.4) { const d = Math.round(time * SR), bL = new Float32Array(d), bR = new Float32Array(d), oL = new Float32Array(N), oR = new Float32Array(N); let i2 = 0, lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) { const yL = bL[i2], yR = bR[i2]; lpL += 0.45 * (yL - lpL); lpR += 0.45 * (yR - lpR); bL[i2] = inL[i] + inR[i] + lpR * fb; bR[i2] = lpL * fb; i2 = (i2 + 1) % d; oL[i] = yL; oR[i] = yR; } return [oL, oR]; }
const [rvL, rvR] = reverb(REV[0], REV[1], STYLE === 'rock' ? 0.86 : 0.8, 0.3), [dlL, dlR] = pingpong(DLY[0], DLY[1], step * 3, 0.38);
const ML = new Float32Array(N), MR = new Float32Array(N); let hpL = 0, hpR = 0, xl = 0, xr = 0, pk = 0;
for (let i = 0; i < N; i++) { const L = MUS[0][i] + dlL[i] + rvL[i] + DRY[0][i], R = MUS[1][i] + dlR[i] + rvR[i] + DRY[1][i]; hpL = 0.9974 * (hpL + L - xl); xl = L; hpR = 0.9974 * (hpR + R - xr); xr = R; ML[i] = hpL; MR[i] = hpR; pk = Math.max(pk, Math.abs(hpL), Math.abs(hpR)); }
const g = 1.15 / pk, fade = Math.round(1.5 * SR), buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const fd = i > N - fade ? (N - i) / fade : 1; buf.writeInt16LE(Math.round(Math.tanh(ML[i] * g) * 0.89 * fd * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.tanh(MR[i] * g) * 0.89 * fd * 32767), 46 + i * 4); }
writeFileSync(OUT, buf); console.log(`wrote ${OUT} (${STYLE}, ${DUR}s @ ${BPM} BPM)`);
