// Job-Alarm-Reel im Neon-Look der 80er (Vorlage: poster.png), 9:16, 120 BPM, 24 s = 12 Takte.
// Ablauf: Schriftzug flackert → Sonne geht auf, Chrom-Logo → Kamera neigt sich, Logo nach oben wie auf dem Plakat → „Neue Missionen verfügbar!“
// → drei Vorteile (dazu eine Job-Alarm-Mail aufs Handy) → Knopf „Jetzt Job-Alarm aktivieren“ → Neon-Blitz ins Plakat.
export const BPM = 120, DUR = 24;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const T = {
  title: 0.3,        // „NEW MISSIONS AVAILABLE!“ flackert an
  titleOut: 1.75,
  rise: 1.0,         // Sonne geht auf, Himmel wird hell (bis ~2,6 s)
  logo: bt(4),       // Drop: Chrom-Schriftzug „Voß &“
  script: bt(5),     // „Partner“ schreibt sich
  swoosh: bt(6),
  flare: bt(7),
  sub: bt(8),        // PERSONALBERATUNG · SEIT 1992
  frame: bt(12),     // Kamera neigt sich, Logo wandert nach oben (bis bt(15))
  box: bt(16),       // „Neue Missionen verfügbar!“
  bell: bt(18),
  rows: [bt(20), bt(24), bt(28)],
  notif: [bt(25), bt(30)],   // Job-Alarm-Mail kommt aufs Handy
  cta: bt(32),
  press: bt(36),
  poster: bt(40),    // Übergang ins Plakat (1 s)
  posterIn: 1.0,
};
export const TXT = {
  title: ['NEUE MISSIONEN', 'VERFÜGBAR!'],
  sub: 'PERSONALBERATUNG', since: 'SEIT 1992',
  tag: 'Der Voß & Partner Job-Alarm.',
  rows: [['Passende Stellenangebote', 'für deine Suche.'], ['Automatisch direkt', 'in dein Postfach.'], ['Diskret und kostenlos.']],
  notif: ['Voß & Partner · Job-Alarm', 'Neue Stelle: Gebietsverkaufsleiter (m/w/d)', 'Kälte- und Klimatechnik · Bayern West'],
  cta: 'Jetzt Job-Alarm aktivieren', done: '✓ Job-Alarm aktiv', bio: 'Link in der Bio',
};
// Musik (scripts/music_synthwave.mjs): Abschnitte in Beats
export const SECTIONS = '0:intro,4:drive,16:lead,32:lift,40:outro';
const r = (x) => Math.round(x * 10000) / 10000;
export const CUES = [
  { t: T.title, sfx: 'zap', pan: 0 }, { t: T.title + 0.35, sfx: 'zap', pan: 0.2 },
  { t: T.logo, sfx: 'thump' }, { t: T.script, sfx: 'whoosh', pan: 0.3 }, { t: T.flare, sfx: 'ding', pan: -0.2 },
  { t: T.frame, sfx: 'whoosh', pan: 0 }, { t: T.box, sfx: 'thump' }, { t: T.bell, sfx: 'bell', pan: 0.4 },
  ...T.rows.map((x, i) => ({ t: x, sfx: 'pop', pan: -0.3 + i * 0.3 })),
  { t: T.notif[0], sfx: 'ding', pan: 0.3 }, { t: T.cta, sfx: 'whoosh', pan: 0 }, { t: T.press, sfx: 'click', pan: 0 }, { t: T.press + 0.12, sfx: 'ding', pan: 0 },
  { t: T.poster, sfx: 'whoosh', pan: 0 },
].map((c) => ({ ...c, t: r(c.t) })).sort((a, b) => a.t - b.t);
