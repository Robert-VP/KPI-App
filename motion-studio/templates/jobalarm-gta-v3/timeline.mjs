// Job-Alarm-Reel, Fassung 3: Kamerafahrt über das Plakat mit den zwei Figuren (poster.png, 941×1672), 9:16, 120 BPM, 24 s.
// Ablauf: Schriftzug flackert → Blitz, Gesichter → Logo glänzt → Missions-Box, Glocke klingelt → die drei Vorteile leuchten nacheinander,
// dazu eine Job-Alarm-Mail → Knopf wird gedrückt → ganzes Plakat mit „Link in der Bio“.
export const BPM = 120, DUR = 24;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const T = {
  title: 0.3, titleOut: 1.75, drop: bt(4),
  glint: bt(14), bell: [bt(20), bt(21)], rows: [bt(25), bt(27), bt(29)], notif: [bt(30), bt(34)],
  press: bt(38), poster: bt(41),   // ab hier ganzes Plakat (Klang-Logo der Musik)
};
// Kamera in Plakat-Pixeln: [Zeit, Mitte x, Mitte y, Zoom] (Zoom 1 = Plakatbreite füllt das Bild)
export const CAM = [[bt(4), 440, 650, 1.95], [bt(11), 440, 620, 1.85], [bt(13), 470, 300, 1.85], [bt(17), 470, 290, 1.75], [bt(19), 470, 1080, 1.14],
  [bt(23), 470, 1080, 1.1], [bt(24.5), 470, 1300, 1.16], [bt(33), 470, 1310, 1.12], [bt(34.5), 467, 1480, 1.2], [bt(39.5), 467, 1490, 1.15], [bt(41.5), 470.5, 836, 1], [24, 470.5, 836, 1]];
export const PT = {   // Positionen im Plakat
  logo: [[300, 220], [610, 240]], bell: [765, 1080], rows: [[240, 1222, 140, 82], [230, 1320, 140, 82], [215, 1415, 140, 82]], btn: [467, 1522, 745, 132], bio: [470, 1642],
};
export const TXT = {
  title: ['NEW MISSIONS', 'AVAILABLE!'], bio: 'Link in der Bio',
  notif: ['Voß & Partner · Job-Alarm', 'Neue Stelle: Gebietsverkaufsleiter (m/w/d)', 'Kälte- und Klimatechnik · Bayern West'],
};
export const SECTIONS = '0:intro,4:drive,16:lead,32:lift,40:outro';
const r = (x) => Math.round(x * 10000) / 10000;
export const CUES = [
  { t: T.title, sfx: 'zap', pan: 0 }, { t: T.title + 0.35, sfx: 'zap', pan: 0.2 }, { t: T.drop, sfx: 'thump' }, { t: T.drop, sfx: 'whoosh', pan: 0 },
  { t: CAM[2][0] - 1, sfx: 'whoosh', pan: -0.3 }, { t: T.glint, sfx: 'ding', pan: 0.2 }, { t: CAM[4][0] - 1, sfx: 'whoosh', pan: 0.3 },
  { t: T.bell[0], sfx: 'bell', pan: 0.4 }, ...T.rows.map((x, i) => ({ t: x, sfx: 'pop', pan: -0.4 + i * 0.3 })), { t: T.notif[0], sfx: 'ding', pan: 0.3 },
  { t: T.press, sfx: 'click', pan: 0 }, { t: T.press + 0.12, sfx: 'ding', pan: 0 }, { t: CAM[10][0] - 1, sfx: 'whoosh', pan: 0 },
].map((c) => ({ ...c, t: r(c.t) })).sort((a, b) => a.t - b.t);
