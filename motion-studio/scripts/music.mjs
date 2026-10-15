// node scripts/music.mjs --bpm 120 --dur 15 [--cues cues.json] [--out out/music.wav] [--seed 7]
// Synthesizes an original track + SFX cues entirely in code. Deterministic (seeded). Writes beats.json too.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';

const argv = process.argv;
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? Number(argv[i + 1]) : d; };
const sarg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : d; };
const BPM = arg('bpm', 120), DUR = arg('dur', 15), SR = 48000, SEED = arg('seed', 7);
const OUT = sarg('out', 'out/music.wav');
const CUES = sarg('cues', 'cues.json');
mkdirSync('out', { recursive: true });

const N = Math.round(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const beat = 60 / BPM;
const TAU = Math.PI * 2;

// seeded noise
let s = SEED >>> 0;
const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const noiseBuf = new Float32Array(N); for (let i = 0; i < N; i++) noiseBuf[i] = rnd();

const env = (t, a, d, sus = 0, r = 0.05, len = 0.3) => {
  if (t < 0) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - sus) * ((t - a) / d);
  if (t < len) return sus;
  return Math.max(0, sus * (1 - (t - len) / r));
};
const add = (t0, dur, fn, pan = 0, gain = 1) => {
  const i0 = Math.max(0, Math.floor(t0 * SR)), i1 = Math.min(N, Math.ceil((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = i0; i < i1; i++) { const v = fn((i - i0) / SR, i); L[i] += v * gl; R[i] += v * gr; }
};

// ---- instruments ----
const kick = (t0) => add(t0, 0.35, (t) => { const f = 48 + 110 * Math.exp(-t * 28); return Math.sin(TAU * f * t) * env(t, 0.001, 0.3, 0, 0.02, 0.3) * 1.2; });
const clap = (t0) => add(t0, 0.2, (t, i) => { const b = noiseBuf[i]; const e = Math.exp(-t * 30) * (1 + 0.5 * Math.sin(TAU * 60 * t)); return b * e * 0.5; });
const hat = (t0, open = false) => add(t0, open ? 0.25 : 0.06, (t, i) => { const b = noiseBuf[i] - (noiseBuf[i - 1] || 0); return b * Math.exp(-t * (open ? 18 : 90)) * 0.35; });
const bass = (t0, f, len = 0.22) => add(t0, len + 0.05, (t) => { const o = Math.sign(Math.sin(TAU * f * t)) * 0.4 + Math.sin(TAU * f * t) * 0.6; const lp = 1 / (1 + t * 12); return o * env(t, 0.003, len, 0, 0.05, len) * 0.55 * (0.4 + 0.6 * lp); });
const pad = (t0, freqs, len) => add(t0, len + 0.3, (t) => { let v = 0; for (const f of freqs) v += Math.sin(TAU * f * t + 0.3 * Math.sin(TAU * 0.5 * t)) + 0.3 * Math.sin(TAU * 2 * f * t); return v / freqs.length * env(t, 0.08, len, 0.7, 0.3, len) * 0.22; }, 0, 1);
const pluck = (t0, f, pan) => add(t0, 0.3, (t) => Math.sin(TAU * f * t) * Math.exp(-t * 14) * 0.3 + Math.sin(TAU * f * 2 * t) * Math.exp(-t * 30) * 0.1, pan);
const riser = (t0, len) => add(t0, len, (t, i) => { const p = t / len; return noiseBuf[i] * p * p * 0.25 * (0.5 + 0.5 * Math.sin(TAU * (200 + 1800 * p * p) * t)); });

// ---- SFX ----
const sfx = {
  click: (t0, pan = 0) => add(t0, 0.05, (t, i) => (noiseBuf[i] - noiseBuf[i - 1]) * Math.exp(-t * 180) * 0.9 + Math.sin(TAU * 2400 * t) * Math.exp(-t * 300) * 0.4, pan),
  pop: (t0, pan = 0) => add(t0, 0.15, (t) => Math.sin(TAU * (900 * Math.exp(-t * 25) + 180) * t) * Math.exp(-t * 35) * 0.7, pan),
  thump: (t0, pan = 0) => add(t0, 0.3, (t) => Math.sin(TAU * (90 * Math.exp(-t * 18) + 40) * t) * Math.exp(-t * 14) * 0.9, pan),
  whoosh: (t0, pan = 0) => add(t0, 0.5, (t, i) => { const p = t / 0.5; const w = Math.sin(Math.PI * Math.min(1, p * 1.2)); let v = 0; for (let k = 1; k <= 3; k++) v += noiseBuf[i - k * 7] || 0; return v / 3 * w * w * 0.5 * (0.3 + 0.7 * p); }, pan),
  tick: (t0, pan = 0) => add(t0, 0.03, (t) => Math.sin(TAU * 4000 * t) * Math.exp(-t * 400) * 0.3, pan),
  ding: (t0, pan = 0) => add(t0, 0.6, (t) => (Math.sin(TAU * 1320 * t) + 0.5 * Math.sin(TAU * 1980 * t)) * Math.exp(-t * 6) * 0.3, pan),
};

// ---- arrangement (A minor) ----
const A = 55, C = 65.41, D = 73.42, E = 82.41, F = 87.31, G = 98;
const prog = [[A, C * 2, E * 2], [F, A * 2, C * 4], [C, E * 2, G * 2], [G, D * 2 * 1, G * 2 * 1]];
const bassLine = [A, A, A * 2, A, F, F, F * 2, F, C, C, C * 2, C, G, G, G * 2, G];
const totalBeats = Math.ceil(DUR / beat);
for (let b = 0; b < totalBeats; b++) {
  const t = b * beat, bar = Math.floor(b / 4), inBar = b % 4;
  kick(t);
  if (inBar === 1 || inBar === 3) clap(t);
  hat(t); hat(t + beat / 2, inBar === 3);
  if (b >= 4) { bass(t, bassLine[b % 16], 0.2); bass(t + beat / 2, bassLine[b % 16] * (inBar === 2 ? 1.5 : 1), 0.12); }
  if (inBar === 0) pad(t, prog[bar % 4].map((f) => f * 2), beat * 3.6);
  if (b >= 8 && b % 2 === 1) pluck(t + beat / 4, prog[bar % 4][(b >> 1) % 3] * 4, (b % 4) - 1.5);
}
riser(DUR - 2 * beat * 2, 2 * beat * 2);

// ---- cues from file: [{ "t": 1.0, "sfx": "click", "pan": -0.5 }, ...] ----
let cues = [];
if (existsSync(CUES)) { cues = JSON.parse(readFileSync(CUES, 'utf8')); for (const c of cues) (sfx[c.sfx] || sfx.click)(c.t, c.pan || 0); }

// ---- master: soft clip + normalize ----
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.tanh(L[i] * g * 1.2) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.tanh(R[i] * g * 1.2) * 32767), 46 + i * 4);
}
writeFileSync(OUT, buf);
const beats = Array.from({ length: totalBeats }, (_, i) => +(i * beat).toFixed(3));
writeFileSync('beats.json', JSON.stringify({ bpm: BPM, beats, downbeats: beats.filter((_, i) => i % 4 === 0), hits: cues.map((c) => c.t) }, null, 1));
console.log(`wrote ${OUT} (${DUR}s @ ${BPM} BPM, ${cues.length} sfx cues) + beats.json`);
