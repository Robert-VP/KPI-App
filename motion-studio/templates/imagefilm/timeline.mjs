// Imagefilm Voß & Partner für Kunden und potenzielle Kunden (120 BPM, 96 s, 16:9 und 4:5).
// Neun Kapitel, Wechsel jeweils mit dem goldenen Dreiecks-Mosaik. Texte aus voss-partner.de (Website-Repository),
// Mandate aus den veröffentlichten Stellen (VP-23xx) sowie abgeschlossene Projekte laut Auftraggeber.
export const BPM = 120, DUR = 96;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const WIPES = [8, 18, 28, 40, 58, 66, 78, 86];                       // Mosaik-Übergänge (s), Bild gedeckt nach +0,37 s
export const COVER = 0.37;
export const SCENES = ['open', 'markt', 'grund', 'mandate', 'direkt', 'messen', 'award', 'werte', 'outro'];
export const STAGE = { open: 'navy', markt: 'light', grund: 'light', mandate: 'dark', direkt: 'navy', messen: 'light', award: 'navy', werte: 'light', outro: 'navy' };
export const sceneStart = (i) => (i === 0 ? 0 : WIPES[i - 1] + COVER);
// Musik: Stimmung folgt dem Inhalt (Beats). ruhig → Groove → treibend (Direktansprache) → Aufbau (Messen) → Höhepunkt (Auszeichnung) → warm aus
export const SECTIONS = '0:intro,16:light,36:full,56:perc,80:drive,116:drive,124:build,132:peak,156:full,172:perc,184:outro';

export const TXT = {
  open: { eyebrow: 'PERSONALBERATUNG MIT TECHNISCHER KOMPETENZ', claim: ['Wir finden', 'die Richtigen'],
    sub: 'Seit 1992 besetzen wir Schlüsselpositionen in der Gebäudetechnik, Versorgungstechnik und in industriell geprägten Umfeldern.' },
  markt: { eyebrow: 'MARKTKENNTNIS', label: 'Seit über drei Jahrzehnten zuhause in:',
    chips: ['Technische Gebäudeausrüstung', 'Versorgungstechnik', 'Heizungs- & Sanitärtechnik', 'Kälte- & Klimatechnik', 'Lüftungstechnik', 'Gebäudeautomation',
      'MSR/Elektrotechnik', 'Energietechnik', 'Rohrleitungsbau', 'Tiefbau', 'Umwelttechnologie', 'Anlagenbau'] },
  grund: { eyebrow: 'UNSER GRUNDSATZ', lines: ['Wir besetzen alle Positionen.', 'Hauptsache in unserer Branche.'], note: 'Vom Fachexperten bis zur Geschäftsführung.',
    tiers: [['Geschäftsführung', 'Geschäftsführer · CFO'], ['Leitung', 'Vertriebsleitung · Niederlassungsleitung · Leiter Service · Werksleitung'], ['Fach- und Spezialisten', 'Projektingenieure · Fachplaner · Area Sales · Servicetechnik']] },
  mandate: { eyebrow: 'AUS UNSEREN MANDATEN', head: 'Unterschiedliche Ebenen. Eine Branche.', note: 'Auszug aus aktuellen und abgeschlossenen Mandaten' },
  direkt: { eyebrow: 'ECHTE DIREKTANSPRACHE', head: ['Wir warten nicht', 'auf Bewerbungen'],
    sub: 'Wir identifizieren und gewinnen gezielt Kandidaten, die heute erfolgreich sind – und morgen Ihr Team verstärken.',
    viz: 'Wir sprechen die Menschen an, die heute erfolgreich arbeiten.', procHead: 'Vier Schritte. Klar und planbar.',
    steps: ['Bedarfsanalyse', 'Anforderungsprofil & Strategie', 'Marktanalyse & Ansprache', 'Präsentation & Begleitung'] },
  messen: { eyebrow: 'WO SIE UNS TREFFEN', head: 'Persönlicher Austausch ist durch nichts zu ersetzen.', note: 'Termin auf einer Messe vereinbaren? Schreiben Sie uns kurz.' },
  award: { eyebrow: 'AUSGEZEICHNET', head: 'Beste Personalberater', sub: 'SZ-Institut der Süddeutschen Zeitung', years: ['2024', '2025', '2026'], streak: 'Drei Mal in Folge.',
    quote: 'Spezialisierung ist kein Nachteil, sondern ein echter Qualitätsfaktor.' },
  werte: { eyebrow: 'WORAUF SIE SICH VERLASSEN KÖNNEN', tiles: [
    ['Seit 1992', 'Inhabergeführt, in zweiter Generation.'],
    ['Ahlen · Stuttgart', 'Mandate in ganz Deutschland, Österreich und der Schweiz.'],
    ['Diskret', 'Auf Wunsch unter unserem Logo – Ihre Strategie bleibt geschützt.'],
    ['Gewährleistung', 'Bewährt sich eine Besetzung nicht, besetzen wir ohne zusätzliche Kosten nach.']] },
  outro: { claim: 'Wir finden die Richtigen', cta: 'Sprechen wir über Ihre Position.', ctaSub: 'Erstgespräch vereinbaren – kostenfrei und unverbindlich.',
    tel: '02528 / 9501-77', web: 'voss-partner.de', resp: 'Antwort innerhalb von 24 Stunden.' },
};
// Mandate: [Ebene, Titel, Zusatz]. Aktuelle Stellen (VP-23xx) und abgeschlossene Projekte laut Auftraggeber.
export const MANDATE = [
  [['GESCHÄFTSFÜHRUNG', 'CFO (m/w/d)', 'Finanzen'], ['VERTRIEBSLEITUNG', 'Sales Director (m/w/d)', 'Industrielle Kühlsysteme · Oberfranken'], ['LEITUNG', 'Technischer Leiter (m/w/d)', 'Kälte- und Klimafachgroßhandel · München'],
   ['LEITUNG', 'Werksleitung (m/w/d)', 'Industrielle Fertigung'], ['VERTRIEBSLEITUNG', 'Gesamtvertriebsleiter (m/w/d)', 'Armaturen Gas- und Wasserversorgung · NRW'], ['LEITUNG', 'Leiter Controlling (m/w/d)', 'SHK-Großhandel · Süddeutschland']],
  [['VERTRIEBSLEITUNG', 'Vertriebsleiter (m/w/d)', 'Kältetechnik'], ['LEITUNG', 'Niederlassungsleiter (m/w/d)', 'Kälte- und Klimafachgroßhandel · Wien'], ['LEITUNG', 'Leiter Service (m/w/d)', 'Kälte-, Klima- und Wärmepumpentechnik'],
   ['LEITUNG', 'Leiter Schulungswesen (m/w/d)', 'Aus- und Weiterbildung'], ['LEITUNG', 'Bereichsleiter Anlagenbau (m/w/d)', 'Kältetechnik · Hessen, RLP, NRW'], ['LEITUNG', 'Personalleitung (m/w/d)', 'Agrar- und Lebensmittelwirtschaft · Münsterland']],
  [['FACH', 'Projektingenieur (m/w/d)', 'Versorgungstechnik HLS · Stuttgart'], ['FACH', 'Fachplaner (m/w/d) HVAC', 'Rhein-Main'], ['VERTRIEB', 'Area Sales Manager (m/w/d)', 'Wärmepumpen · Kassel-Hannover'],
   ['VERTRIEB', 'Außendienst (m/w/d)', 'Haus- und Gebäudeautomation · Köln/Bonn'], ['VERTRIEB', 'Vertriebsmitarbeiter (m/w/d)', 'Brandschutz · Berlin'], ['VERTRIEB', 'Technischer Vertrieb (m/w/d)', 'Wasseraufbereitung · bundesweit'],
   ['FACH', 'Obermonteur (m/w/d)', 'Kältetechnik · Raum Stuttgart'], ['GEBIETSLEITUNG', 'Gebietsverkaufsleiter (m/w/d)', 'Armaturen Gas/Wasser · Nordbayern']],
];
// Messen laut Website (Abschnitt „Wo Sie uns treffen“), ohne Stand
export const MESSEN = [['Data Centre World', 'Frankfurt'], ['IFAT', 'München'], ['Intersolar', 'München'], ['FeuerTrutz', 'Nürnberg'], ['Chillventa', 'Nürnberg'], ['Belektro', 'Berlin'],
  ['GET Nord', 'Hamburg'], ['BAU', 'München'], ['Oldenburger Rohrleitungsforum', 'Oldenburg'], ['Elektrotechnik', 'Dortmund'], ['eltefa', 'Stuttgart'], ['ISH', 'Frankfurt'],
  ['Tausendwasser', 'Berlin'], ['Light + Building', 'Frankfurt'], ['MCE', 'Mailand'], ['SHK+E', 'Essen'], ['IFH/Intherm', 'Nürnberg']];
// Durchlauf der Messen: Position in Zeilen, schneller werdend
export const REEL = { u0: 1.6, v0: 0.75, a: 0.95 };
export const reelPos = (u) => { const x = Math.max(0, u - REEL.u0); return REEL.v0 * x + REEL.a * x * x; };

const r4 = (x) => Math.round(x * 10000) / 10000;
const S0 = SCENES.map((_, i) => sceneStart(i));
const at = (scene, u) => S0[SCENES.indexOf(scene)] + u;
export const CUES = (() => {
  const c = [];
  WIPES.forEach((w) => { c.push({ t: w, sfx: 'whoosh', pan: 0 }); c.push({ t: w + 0.37, sfx: 'thump' }); });
  c.push({ t: 0.3, sfx: 'pop', pan: -0.5 }, { t: 1.6, sfx: 'thump' }, { t: 2.4, sfx: 'thump' }, { t: 2.9, sfx: 'pop', pan: 0.3 });
  for (let i = 0; i < 12; i++) c.push({ t: at('markt', 0.5 + i * 0.16), sfx: 'tick', pan: 0.3 });
  TXT.markt.chips.forEach((_, i) => c.push({ t: at('markt', 2.8 + i * 0.12), sfx: 'pop', pan: -0.6 + (i % 6) * 0.24 }));
  c.push({ t: at('grund', 0.4), sfx: 'thump' }, { t: at('grund', 1.2), sfx: 'thump' });
  [0, 1, 2].forEach((i) => c.push({ t: at('grund', 2.6 + i * 0.8), sfx: 'pop', pan: 0.4 }));
  c.push({ t: at('mandate', 0.5), sfx: 'whoosh', pan: -0.4 });
  c.push({ t: at('direkt', 0.5), sfx: 'thump' }, { t: at('direkt', 1.2), sfx: 'thump' }, { t: at('direkt', 8.6), sfx: 'whoosh', pan: 0.3 });
  [0, 1, 2, 3, 4, 5].forEach((i) => c.push({ t: at('direkt', 9.8 + i * 0.22), sfx: 'ding', pan: -0.5 + i * 0.2 }));
  c.push({ t: at('direkt', 13.2), sfx: 'whoosh', pan: -0.3 });
  [0, 1, 2, 3].forEach((i) => c.push({ t: at('direkt', 13.9 + i * 0.55), sfx: 'pop', pan: -0.45 + i * 0.3 }));
  for (let k = 1; k < 40; k++) {   // jede Messe, die durch die Mitte läuft, tickt – schneller werdend
    const x = (-REEL.v0 + Math.sqrt(REEL.v0 * REEL.v0 + 4 * REEL.a * k)) / (2 * REEL.a), u = REEL.u0 + x;
    if (u < 7.6) c.push({ t: at('messen', u), sfx: 'tick', pan: 0.2 });
  }
  c.push({ t: at('award', 0.4), sfx: 'thump' }); [0, 1, 2].forEach((i) => c.push({ t: at('award', 1.8 + i * 0.7), sfx: 'pop', pan: -0.4 + i * 0.4 }));
  c.push({ t: at('award', 4.0), sfx: 'ding', pan: 0 });
  [0, 1, 2, 3].forEach((i) => c.push({ t: at('werte', 0.6 + i * 0.5), sfx: 'pop', pan: -0.45 + i * 0.3 }));
  c.push({ t: at('outro', 0.3), sfx: 'pop' }, { t: at('outro', 1.0), sfx: 'thump' }, { t: at('outro', 2.2), sfx: 'whoosh', pan: 0.2 }, { t: at('outro', 2.6), sfx: 'ding', pan: 0 });
  return c.filter((x) => x.t < DUR).sort((a, b) => a.t - b.t).map((x) => ({ ...x, t: r4(x.t) }));
})();
