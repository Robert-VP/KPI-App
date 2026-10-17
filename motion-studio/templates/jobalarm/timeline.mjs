// Zeitplan des Job-Alarm-Erklärvideos (120 BPM). Zwei Fassungen: LinkedIn (lang, 44 s) und Instagram-Reel (kurz, 28 s, ?v=kurz).
// Von index.html und vom Cue-Export genutzt.
// Ablauf: Hook → Stellenseite (wo?) → Formular → „Fast geschafft!“ → Bestätigungs-Mail → „Job-Alarm ist aktiv“
//         → neue Stelle ploppt im Posteingang auf → Vorteile → Anzeige mit Fußband.
export const BPM = 120, DUR = 44, DUR_KURZ = 28;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const T = {
  circle: bt(0), logo: bt(0.5), eyebrow: bt(1.5), h1: bt(2.5), h2: bt(4),                  // Hook, Drop auf „kommt zu Ihnen.“
  sub: bt(8), chips: bt(10),
  p1: bt(12), web: bt(12.5), tapBr: bt(15), tapRg: bt(17), tapAlarm: bt(19.5), webOut: bt(20.5),   // Schritt 1: Stellenseite, Suche festlegen
  tap1: 1e9, env: 1e9,                                                                         // (frühere Chip-/Brief-Animation aus)
  p2: bt(21), card: bt(21), suche: bt(22.5), tapMail: bt(24.5), mail: bt(25), mailEnd: bt(28), tapCheck: bt(29), tapBtn: bt(31),   // Schritt 2: Formular
  done: bt(32), tapClose: bt(38.5), doneOut: bt(39),                                           // „Fast geschafft!“
  mbox: bt(39.5), cMail: bt(41), tapCRow: bt(42.5), cOpen: bt(43), tapConfirm: bt(46), active: bt(46.5), mboxOut: bt(52),   // Bestätigung
  p3: bt(52), inbox: bt(52.5), newMail: bt(54.5), tapRow: bt(56.5), open: bt(57),               // Schritt 3: neue Stelle ploppt auf
  nHead: bt(57.6), nTitle: bt(58.2), nLine: bt(58.8), nJob: bt(59.5), nLoc: bt(60.2), nBtn: bt(61), badge: bt(62.5),
  pros: bt(64), prosOut: bt(73.5), prosStep: 0.35,                                                               // Vorteile, letzter steht gut 3 s
  end: bt(73.5), foot: bt(75.5), url: bt(76), claim: bt(76.5),                                     // Auflösung zur Anzeige, Schlussbild ab ca. 39 s
};
export const SECTIONS = '0:intro,4:perc,12:drive,20:drive,32:perc,40:drive,52:peak,64:drive,72:perc,84:outro';
// Kurzfassung fürs Instagram-Reel: gleiche Szenen, ohne „Fast geschafft!“, alles straffer
export const T_KURZ = {
  circle: bt(0), logo: bt(0.5), eyebrow: bt(1.5), h1: bt(2.5), h2: bt(4), sub: bt(6), chips: bt(7),
  p1: bt(8), web: bt(8.5), tapBr: bt(10.5), tapRg: bt(11.75), tapAlarm: bt(13.25), webOut: bt(14.25), tap1: 1e9, env: 1e9,
  p2: bt(14.25), card: bt(14.25), suche: bt(14.75), tapMail: bt(15.25), mail: bt(15.5), mailEnd: bt(16.5), tapCheck: bt(17), tapBtn: bt(17.75),
  done: 1e9, tapClose: 1e9, doneOut: 1e9,
  mbox: bt(18.5), cMail: bt(19.25), tapCRow: bt(20.25), cOpen: bt(20.5), tapConfirm: bt(22.5), active: bt(23), mboxOut: bt(26),
  p3: bt(26), inbox: bt(26.5), newMail: bt(27.5), tapRow: bt(28.75), open: bt(29.25),
  nHead: bt(29.65), nTitle: bt(30.05), nLine: bt(30.45), nJob: bt(30.85), nLoc: bt(31.25), nBtn: bt(31.65), badge: bt(32.25),
  pros: bt(33), prosOut: bt(41.75), prosStep: 0.35,
  end: bt(41.75), foot: bt(43.75), url: bt(44.25), claim: bt(44.75),                                     // Schlussbild ab ca. 23 s
};
export const SECTIONS_KURZ = '0:intro,4:perc,8:drive,16:drive,24:peak,32:drive,40:perc,52:outro';
const r = (x) => Math.round(x * 10000) / 10000;
const ticks = (t0, n, dt, pan) => Array.from({ length: n }, (_, i) => ({ t: t0 + i * dt, sfx: 'tick', pan }));
export const cuesFor = (T) => [
  { t: T.circle, sfx: 'whoosh', pan: 0.4 }, { t: T.logo, sfx: 'pop', pan: -0.5 }, ...ticks(T.eyebrow + 0.1, 6, 0.07, -0.3),
  { t: T.h1, sfx: 'thump' }, { t: T.h2, sfx: 'thump' }, { t: T.sub, sfx: 'whoosh', pan: -0.2 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ t: T.chips + i * 0.08, sfx: 'pop', pan: -0.6 + i * 0.2 })),
  { t: T.web, sfx: 'whoosh', pan: 0.2 }, { t: T.tapBr, sfx: 'click', pan: -0.1 }, { t: T.tapBr + 0.2, sfx: 'pop', pan: -0.1 },
  { t: T.tapRg, sfx: 'click', pan: 0.2 }, { t: T.tapRg + 0.2, sfx: 'pop', pan: 0.2 }, { t: T.tapAlarm, sfx: 'click', pan: 0.5 }, { t: T.webOut, sfx: 'whoosh', pan: -0.3 },
  ...ticks(T.suche, 7, 0.13, -0.4), { t: T.tapMail, sfx: 'click', pan: -0.3 }, ...ticks(T.mail, 10, 0.15, -0.3),
  { t: T.tapCheck, sfx: 'click', pan: -0.4 }, { t: T.tapBtn, sfx: 'thump', pan: -0.2 }, { t: T.tapBtn + 0.04, sfx: 'pop', pan: -0.2 },
  { t: T.done, sfx: 'whoosh', pan: 0 }, { t: T.done + 0.35, sfx: 'ding', pan: 0 }, { t: T.tapClose, sfx: 'click', pan: 0.2 },
  { t: T.mbox, sfx: 'whoosh', pan: 0.3 }, { t: T.cMail, sfx: 'pop', pan: 0.4 }, { t: T.tapCRow, sfx: 'click', pan: 0.2 }, { t: T.cOpen, sfx: 'whoosh', pan: 0.2 },
  { t: T.tapConfirm, sfx: 'click', pan: 0 }, { t: T.active, sfx: 'ding', pan: 0 },
  { t: T.p3, sfx: 'whoosh', pan: 0.4 }, { t: T.inbox, sfx: 'pop', pan: 0.4 },
  { t: T.newMail - 0.05, sfx: 'whoosh', pan: 0.5 }, { t: T.newMail + 0.1, sfx: 'ding', pan: 0.4 }, { t: T.newMail + 0.25, sfx: 'pop', pan: 0.6 },
  { t: T.tapRow, sfx: 'click', pan: 0.3 }, { t: T.open, sfx: 'whoosh', pan: 0.3 },
  { t: T.nTitle, sfx: 'tick', pan: 0.4 }, { t: T.nJob, sfx: 'tick', pan: 0.4 }, { t: T.nBtn, sfx: 'pop', pan: 0.4 }, { t: T.badge, sfx: 'pop', pan: 0.6 },
  ...[0, 1, 2, 3].map((i) => ({ t: T.pros + 0.3 + i * T.prosStep, sfx: 'pop', pan: -0.3 + i * 0.2 })),
  { t: T.end, sfx: 'whoosh', pan: 0 }, { t: T.foot, sfx: 'whoosh', pan: -0.3 },
  ...ticks(T.url, 3, 0.1, -0.5), { t: T.claim, sfx: 'tick', pan: 0.5 }, { t: T.claim + 0.35, sfx: 'pop', pan: 0.5 },
].filter((c) => c.t < 1e6).map((c) => ({ ...c, t: r(c.t) }));
export const CUES = cuesFor(T), CUES_KURZ = cuesFor(T_KURZ);
