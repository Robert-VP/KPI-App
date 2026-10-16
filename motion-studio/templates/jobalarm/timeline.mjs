// Zeitplan des Job-Alarm-Erklärvideos (120 BPM, 44 s = 22 Takte). Von index.html und vom Cue-Export genutzt.
// Ablauf: Hook → Stellenseite (wo?) → Formular → „Fast geschafft!“ → Bestätigungs-Mail → „Job-Alarm ist aktiv“
//         → neue Stelle ploppt im Posteingang auf → Vorteile → Anzeige mit Fußband.
export const BPM = 120, DUR = 44;
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
  pros: bt(64), prosOut: bt(72),                                                               // Vorteile
  end: bt(72), foot: bt(74), url: bt(74.5), claim: bt(75),                                     // Auflösung zur Anzeige, Schlussbild ab ca. 38 s
};
export const SECTIONS = '0:intro,4:perc,12:drive,20:drive,32:perc,40:drive,52:peak,64:drive,72:perc,84:outro';
const r = (x) => Math.round(x * 10000) / 10000;
const ticks = (t0, n, dt, pan) => Array.from({ length: n }, (_, i) => ({ t: t0 + i * dt, sfx: 'tick', pan }));
export const CUES = [
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
  ...[0, 1, 2, 3].map((i) => ({ t: T.pros + 0.3 + i * 0.5, sfx: 'pop', pan: -0.3 + i * 0.2 })),
  { t: T.end, sfx: 'whoosh', pan: 0 }, { t: T.foot, sfx: 'whoosh', pan: -0.3 },
  ...ticks(T.url, 3, 0.1, -0.5), { t: T.claim, sfx: 'tick', pan: 0.5 }, { t: T.claim + 0.35, sfx: 'pop', pan: 0.5 },
].map((c) => ({ ...c, t: r(c.t) }));
