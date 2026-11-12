// Job-Alarm-Erklärvideo, LinkedIn-Fassung mit klarer Gliederung (120 BPM, 61 s, 4:5):
// Einstieg → Überblick „So funktioniert's“ → Kapitel 1/2/3 (Titelkarte, dann Vorführung mit Untertiteln) → Vorteile → Anzeige.
export const BPM = 120, DUR = 61;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const T = {
  circle: bt(0), logo: bt(0.5), eyebrow: bt(1.5), h1: bt(2.5), h2: bt(4), hookOut: bt(10),          // Einstieg
  ov: bt(10.5), ovRows: [bt(11.5), bt(12.75), bt(14)], ovOut: bt(20),                                 // Überblick
  c1: bt(20), web: bt(24.5), tapBr: bt(27), tapRg: bt(28.5), tapAlarm: bt(32.5), webOut: bt(34),      // Kapitel 1
  form: bt(34), card: bt(34), suche: bt(35), tapMail: bt(36.5), mail: bt(37), mailEnd: bt(39.5), tapCheck: bt(40.5), tapBtn: bt(44), formOut: bt(47),
  c2: bt(48), done: bt(51.5), tapClose: bt(57), doneOut: bt(57.5),                                    // Kapitel 2
  mbox: bt(58), cMail: bt(59.5), tapCRow: bt(62), cOpen: bt(62.5), tapConfirm: bt(67), active: bt(67.5), mboxOut: bt(75),
  c3: bt(76), inbox: bt(79.5), newMail: bt(81.5), tapRow: bt(85), open: bt(85.5), s3out: bt(95.5),    // Kapitel 3
  nHead: bt(86), nTitle: bt(86.6), nLine: bt(87.2), nJob: bt(87.9), nLoc: bt(88.6), nBtn: bt(89.3), badge: bt(90.5),
  pros: bt(96), prosOut: bt(106), prosStep: 0.4,                                                       // Vorteile
  end: bt(106), sub: bt(106.6), chips: bt(107.2), foot: bt(108), url: bt(108.5), claim: bt(109),      // Anzeige, Schlussbild ab ca. 55 s
  tap1: 1e9, env: 1e9,
};
T.p1 = T.c1 + 2; T.p2 = T.c2 + 2; T.p3 = T.c3 + 2; T.stepsEnd = T.pros;   // Schrittmarke oben, sobald die Titelkarte weicht
// Kapitel-Titelkarten: [Start, Ende, Nummer, Titel, Erklärung]
export const CHAPTERS = [
  [T.c1, T.c1 + 2.1, 1, 'Suche festlegen', 'Branche und Region wählen, E-Mail-Adresse eintragen.'],
  [T.c2, T.c2 + 1.65, 2, 'E-Mail bestätigen', 'Ein Klick in der Bestätigungs-Mail – fertig.'],
  [T.c3, T.c3 + 1.65, 3, 'Stellen erhalten', 'Neue passende Stellen kommen automatisch per E-Mail.'],
];
// Untertitel (Anleitung): [Start, Ende, Text]
export const CAPTIONS = [
  [bt(25), bt(31), 'Auf der Stellenseite Branche und Region wählen'],
  [bt(31), bt(34.5), 'Dann auf „Job-Alarm für diese Suche“ tippen'],
  [bt(35), bt(42), 'E-Mail-Adresse eintragen und zustimmen'],
  [bt(42), bt(47.5), 'Auf „Job-Alarm aktivieren“ tippen'],
  [bt(52), bt(58), 'Wir senden Ihnen eine Bestätigungs-Mail'],
  [bt(59.5), bt(63.5), 'Bestätigungs-Mail öffnen …'],
  [bt(63.5), bt(68), '… und auf „Job-Alarm bestätigen“ klicken'],
  [bt(68), bt(75.5), 'Fertig: Ihr Job-Alarm ist aktiv'],
  [bt(80), bt(88), 'Neue passende Stelle? Sie erhalten automatisch eine E-Mail.'],
  [bt(88), bt(95.5), 'Mit „Stelle ansehen“ direkt zur Anzeige'],
];
export const OVERVIEW = [['Suche festlegen', 'Branche und Region wählen'], ['E-Mail bestätigen', 'Ein Klick in der Bestätigungs-Mail'], ['Stellen erhalten', 'Neue Stellen kommen per E-Mail']];
export const SECTIONS = '0:intro,4:perc,20:drive,48:drive,76:peak,96:drive,108:perc,116:outro';
const r = (x) => Math.round(x * 10000) / 10000;
const ticks = (t0, n, dt, pan) => Array.from({ length: n }, (_, i) => ({ t: t0 + i * dt, sfx: 'tick', pan }));
export const CUES = [
  { t: T.circle, sfx: 'whoosh', pan: 0.4 }, { t: T.logo, sfx: 'pop', pan: -0.5 }, ...ticks(T.eyebrow + 0.1, 6, 0.07, -0.3), { t: T.h1, sfx: 'thump' }, { t: T.h2, sfx: 'thump' },
  { t: T.ov, sfx: 'whoosh', pan: 0 }, ...T.ovRows.map((x, i) => ({ t: x, sfx: 'pop', pan: -0.3 + i * 0.3 })),
  ...CHAPTERS.flatMap(([a]) => [{ t: a, sfx: 'whoosh', pan: 0 }, { t: a + 0.15, sfx: 'thump' }]),
  { t: T.web, sfx: 'whoosh', pan: 0.2 }, { t: T.tapBr, sfx: 'click', pan: -0.1 }, { t: T.tapRg, sfx: 'click', pan: 0.2 }, { t: T.tapAlarm, sfx: 'click', pan: 0.5 },
  ...ticks(T.suche, 7, 0.13, -0.4), { t: T.tapMail, sfx: 'click', pan: -0.3 }, ...ticks(T.mail, 10, 0.12, -0.3), { t: T.tapCheck, sfx: 'click', pan: -0.4 }, { t: T.tapBtn, sfx: 'pop', pan: -0.2 },
  { t: T.done + 0.35, sfx: 'ding', pan: 0 }, { t: T.tapClose, sfx: 'click', pan: 0.2 },
  { t: T.cMail, sfx: 'pop', pan: 0.4 }, { t: T.tapCRow, sfx: 'click', pan: 0.2 }, { t: T.tapConfirm, sfx: 'click', pan: 0 }, { t: T.active, sfx: 'ding', pan: 0 },
  { t: T.newMail + 0.1, sfx: 'ding', pan: 0.4 }, { t: T.newMail + 0.25, sfx: 'pop', pan: 0.6 }, { t: T.tapRow, sfx: 'click', pan: 0.3 }, { t: T.nBtn, sfx: 'pop', pan: 0.4 }, { t: T.badge, sfx: 'pop', pan: 0.6 },
  ...[0, 1, 2, 3].map((i) => ({ t: T.pros + 0.3 + i * T.prosStep, sfx: 'pop', pan: -0.3 + i * 0.2 })),
  { t: T.end, sfx: 'whoosh', pan: 0 }, { t: T.foot, sfx: 'whoosh', pan: -0.3 }, { t: T.claim + 0.35, sfx: 'pop', pan: 0.5 },
].map((c) => ({ ...c, t: r(c.t) }));
