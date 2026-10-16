// Zeitplan des Job-Alarm-Erklärvideos (120 BPM, 34 s = 17 Takte). Von index.html und vom Cue-Export genutzt.
export const BPM = 120, DUR = 34;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const T = {
  circle: bt(0), logo: bt(0.5), eyebrow: bt(1.5), h1: bt(2.5), h2: bt(4),           // Hook, Drop auf „kommt zu Ihnen.“
  sub: bt(8), chips: bt(10),
  p1: bt(12), tap1: bt(15),                                                             // Schritt 1: Suche festlegen
  p2: bt(20), card: bt(20), suche: bt(22), tapMail: bt(24.5), mail: bt(25), mailEnd: bt(28), tapCheck: bt(29), tapBtn: bt(31), env: bt(31.5),   // Schritt 2
  p3: bt(36), inbox: bt(36.5), newMail: bt(38.5), tapRow: bt(40.5), open: bt(41),                                  // Schritt 3: Posteingang, Mail ploppt auf, öffnen
  nHead: bt(41.6), nTitle: bt(42.2), nLine: bt(42.8), nJob: bt(43.5), nLoc: bt(44.2), nBtn: bt(45), badge: bt(46.5),
  end: bt(52), foot: bt(54), url: bt(54.5), claim: bt(55),                                                                           // Auflösung zur Anzeige, Schlussbild ab ca. 28,3 s
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
  { t: T.p3, sfx: 'whoosh', pan: 0.4 }, { t: T.inbox, sfx: 'pop', pan: 0.4 },
  { t: T.newMail - 0.05, sfx: 'whoosh', pan: 0.5 }, { t: T.newMail + 0.1, sfx: 'ding', pan: 0.4 }, { t: T.newMail + 0.25, sfx: 'pop', pan: 0.6 },
  { t: T.tapRow, sfx: 'click', pan: 0.3 }, { t: T.open, sfx: 'whoosh', pan: 0.3 },
  { t: T.nTitle, sfx: 'tick', pan: 0.4 }, { t: T.nJob, sfx: 'tick', pan: 0.4 }, { t: T.nBtn, sfx: 'pop', pan: 0.4 }, { t: T.badge, sfx: 'pop', pan: 0.6 },
  { t: T.end, sfx: 'whoosh', pan: 0 }, { t: T.foot, sfx: 'whoosh', pan: -0.3 },
  { t: T.url, sfx: 'tick', pan: -0.5 }, { t: T.url + 0.1, sfx: 'tick', pan: -0.5 }, { t: T.url + 0.2, sfx: 'tick', pan: -0.5 },
  { t: T.claim, sfx: 'tick', pan: 0.5 }, { t: T.claim + 0.35, sfx: 'pop', pan: 0.5 },
].map((c) => ({ ...c, t: r(c.t) }));
