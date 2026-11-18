// Job-Alarm-Trailer im Stil der GTA-VI-Trailer, 9:16, Musik A (80er-Rockballade, 94 BPM), 10 Takte ≈ 25,5 s.
// Kaltstart mit Untertiteln → Drop: schnelle Schnitte auf den Takt (Kinobild-Band, Ausschnitte aus den Plakaten) → Spiel-Oberfläche mit Minikarte
// und Missions-Text → Spiel-Handy mit Job-Alarm-Mail, „JOB-ALARM AKTIVIERT“ → drei Vorteile → beide Figuren → Titelkarte → Schlusskarte.
export const BPM = 94, BAR = 4 * 60 / BPM, DUR = 10 * BAR;
const b = (n) => n * BAR, q = (n) => n * 60 / BPM;   // Takt, Beat
// Einstellungen im Kinobild-Band: [Start, Ende, Plakat, Mitte x, Mitte y, Breite (Plakat-Pixel), Zoom-Fahrt, Schwenk x]
export const SHOTS = [
  [b(1), b(2), 1, 700, 1530, 390, 0.06, -20],      // Skyline am Wasser
  [b(2), b(2) + q(2), 3, 285, 640, 420, 0.1, 10],  // Gesicht sie
  [b(2) + q(2), b(3), 2, 730, 1300, 400, 0.08, -25], // Auto, Rücklichter
  [b(3), b(3) + q(2), 3, 600, 720, 360, 0.1, -10], // Gesicht er
  [b(3) + q(2), b(4), 1, 260, 1530, 390, 0.06, 25],  // Palmen und Skyline links
  [b(4), b(5), 3, 470, 700, 640, 0.07, 0],         // beide, mit Minikarte und Missions-Text
  [b(6), b(6) + q(1.33), 2, 730, 1300, 400, 0.06, 20],
  [b(6) + q(1.33), b(6) + q(2.67), 1, 700, 1530, 390, 0.06, -20],
  [b(6) + q(2.67), b(7), 3, 285, 640, 420, 0.06, 10],
  [b(7), b(8), 3, 470, 690, 700, 0.12, 0],         // beide, langsam heran
];
export const T = {
  sub: [[0.25, b(1) - 0.2, 'Du suchst gerade nicht aktiv …'], [b(1) + 0.1, b(2) - 0.1, '… aber wenn das Richtige kommt,', 'willst du es wissen.']],
  drop: b(2), mission: [b(4) + 0.3, b(5) - 0.15], phone: [b(5), b(6)], notif: b(5) + q(1), passed: b(5) + q(2.5),
  pros: [b(6), b(6) + q(1.33), b(6) + q(2.67)], tag: [b(7) + 0.3, b(8) - 0.2], title: b(8), end: b(9),
};
export const TXT = {
  presents: 'VOSS & PARTNER PRÄSENTIERT',
  mission: ['Neue Mission:', 'Traumjob finden.'],
  notif: ['Voß & Partner · Job-Alarm', 'Neue Stelle: Gebietsverkaufsleiter (m/w/d)', 'Kälte- und Klimatechnik · Bayern West'],
  passed: ['JOB-ALARM', 'AKTIVIERT'],
  pros: [['Passende Stellen', 'für deine Suche.'], ['Automatisch', 'in dein Postfach.'], ['Diskret und', 'kostenlos.']],
  tag: 'Neue Missionen verfügbar.',
  title: 'JOB-ALARM', over: 'VOSS & PARTNER', cta: 'Jetzt Job-Alarm aktivieren.', soon: 'Jetzt verfügbar.',
};
// Musik (scripts/music_trailer.mjs --style rock --timeline …): Takte
export const MUSIC = { full: 2, lead: [4, 8], hit: 8, end: 9 };
const r = (x) => Math.round(x * 10000) / 10000;
export const CUES = [
  { t: T.drop, sfx: 'whoosh', pan: 0 }, ...SHOTS.slice(2).map((s) => ({ t: s[0], sfx: 'cut', pan: 0 })),
  { t: T.mission[0], sfx: 'blip', pan: -0.3 }, { t: T.notif, sfx: 'ding', pan: 0.3 }, { t: T.passed, sfx: 'passed', pan: 0 },
  ...T.pros.map((x, i) => ({ t: x, sfx: 'pop', pan: -0.3 + i * 0.3 })), { t: T.title, sfx: 'whoosh', pan: 0 },
].map((c) => ({ ...c, t: r(c.t) })).sort((a, c) => a.t - c.t);
