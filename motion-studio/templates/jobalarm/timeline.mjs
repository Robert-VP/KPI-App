// Zeitplan des Job-Alarm-Erklärvideos (120 BPM, 32 s = 16 Takte). Von index.html und vom Cue-Export genutzt.
export const BPM = 120, DUR = 32;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const T = {
  circle: bt(0), logo: bt(0.5), eyebrow: bt(1.5), h1: bt(2.5), h2: bt(4),           // Hook, Drop auf „kommt zu Ihnen.“
  sub: bt(8), chips: bt(10),
  p1: bt(12), tap1: bt(15),                                                             // Schritt 1: Suche festlegen
  p2: bt(20), card: bt(20), suche: bt(22), tapMail: bt(24.5), mail: bt(25), mailEnd: bt(28), tapCheck: bt(29), tapBtn: bt(31), env: bt(31.5),   // Schritt 2
  p3: bt(36), notif: bt(36.5), nHead: bt(37), nTitle: bt(38), nLine: bt(38.5), nJob: bt(39.5), nLoc: bt(40.5), nBtn: bt(41.5), badge: bt(43),   // Schritt 3
  end: bt(48), foot: bt(50), url: bt(50.5), bio: bt(52.5),                              // Auflösung zur Anzeige, Schlussbild ab ca. 26,5 s
};
const r = (x) => Math.round(x * 10000) / 10000;
export const CUES = [
  { t: T.circle, sfx: 'whoosh', pan: 0.4 }, { t: T.logo, sfx: 'pop', pan: -0.5 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ t: T.eyebrow + 0.1 + i * 0.07, sfx: 'tick', pan: -0.3 })),
  { t: T.h1, sfx: 'thump' }, { t: T.h2, sfx: 'thump' },
  { t: T.sub, sfx: 'whoosh', pan: -0.2 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ t: T.chips + i * 0.08, sfx: 'pop', pan: -0.6 + i * 0.2 })),
  { t: T.p1, sfx: 'whoosh', pan: 0.2 }, { t: T.tap1, sfx: 'click', pan: -0.2 }, { t: T.tap1 + 0.06, sfx: 'pop', pan: -0.2 },
  { t: T.p2, sfx: 'whoosh', pan: -0.3 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ t: T.suche + i * 0.13, sfx: 'tick', pan: -0.4 })),
  { t: T.tapMail, sfx: 'click', pan: -0.3 },
  ...Array.from({ length: 10 }, (_, i) => ({ t: T.mail + i * 0.15, sfx: 'tick', pan: -0.3 })),
  { t: T.tapCheck, sfx: 'click', pan: -0.4 }, { t: T.tapBtn, sfx: 'thump', pan: -0.2 }, { t: T.tapBtn + 0.04, sfx: 'pop', pan: -0.2 },
  { t: T.env, sfx: 'whoosh', pan: 0.5 },
  { t: T.p3, sfx: 'whoosh', pan: 0.4 }, { t: T.notif + 0.15, sfx: 'ding', pan: 0.4 },
  { t: T.nTitle, sfx: 'tick', pan: 0.4 }, { t: T.nJob, sfx: 'tick', pan: 0.4 }, { t: T.nBtn, sfx: 'pop', pan: 0.4 }, { t: T.badge, sfx: 'pop', pan: 0.6 },
  { t: T.end, sfx: 'whoosh', pan: 0 }, { t: T.foot, sfx: 'whoosh', pan: -0.3 },
  ...Array.from({ length: 8 }, (_, i) => ({ t: T.url + i * 0.14, sfx: 'tick', pan: -0.5 })),
  { t: T.bio, sfx: 'pop', pan: 0.6 },
].map((c) => ({ ...c, t: r(c.t) }));
