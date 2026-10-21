// Imagefilm Voß & Partner für Kunden und potenzielle Kunden (120 BPM, 104 s, 16:9 und 4:5), mit Logo-Intro. Eigene Formulierungen, keine konkreten Mandate.
// Neun Kapitel, Wechsel jeweils mit dem goldenen Dreiecks-Mosaik. Texte aus voss-partner.de (Website-Repository),
// Positionen fiktiv, angelehnt an die Art der Mandate von Voß & Partner.
export const BPM = 120, DUR = 104;
const B = 60 / BPM;
export const bt = (n) => n * B;
export const WIPES = [4, 12, 22, 32, 48, 66, 74, 86, 94];                       // Mosaik-Übergänge (s), Bild gedeckt nach +0,37 s
export const COVER = 0.37;
export const SCENES = ['intro', 'open', 'markt', 'grund', 'mandate', 'direkt', 'messen', 'award', 'werte', 'outro'];
export const STAGE = { intro: 'light', open: 'navy', markt: 'light', grund: 'light', mandate: 'dark', direkt: 'navy', messen: 'light', award: 'navy', werte: 'light', outro: 'navy' };
export const sceneStart = (i) => (i === 0 ? 0 : WIPES[i - 1] + COVER);
// Musik: Stimmung folgt dem Inhalt (Beats). ruhig → Groove → treibend (Direktansprache) → Aufbau (Messen) → Höhepunkt (Auszeichnung) → warm aus
export const SECTIONS = '0:intro,24:light,44:full,64:perc,96:drive,132:drive,140:build,148:peak,172:full,188:perc,200:outro';

export const TXT = {
  intro: { line: 'SEIT 1992' },                                                  // farbiges Originallogo als kurzes Intro
  open: { eyebrow: 'PERSONALBERATUNG MIT TECHNISCHER KOMPETENZ', claim: ['Wir finden', 'die Richtigen'],
    sub: 'Seit 1992 besetzen wir Schlüsselpositionen in der Gebäudetechnik, Versorgungstechnik und in industriell geprägten Umfeldern.' },
  markt: { eyebrow: 'MARKTKENNTNIS', label: 'Seit über drei Jahrzehnten zuhause in:',
    chips: ['Technische Gebäudeausrüstung', 'Versorgungstechnik', 'Heizungs- & Sanitärtechnik', 'Kälte- & Klimatechnik', 'Lüftungstechnik', 'Gebäudeautomation',
      'MSR/Elektrotechnik', 'Energietechnik', 'Rohrleitungsbau', 'Tiefbau', 'Umwelttechnologie', 'Anlagenbau', 'Armaturentechnik'] },
  grund: { eyebrow: 'UNSER GRUNDSATZ', lines: ['Breit in den Positionen.', 'Tief in der Branche.'], note: 'Jede Ebene – in den Märkten, die wir seit 1992 kennen.',
    tiers: [['Geschäftsführung', 'Unternehmensleitung und C-Level'], ['Leitung', 'Bereichs-, Abteilungs- und Standortleitung'], ['Fachkräfte', 'Vertrieb · Technik · Planung · Service']] },
  mandate: { eyebrow: 'POSITIONEN, DIE WIR BESETZEN', head: 'Unterschiedliche Ebenen. Ein Fokus: Technik.', note: 'Beispielhafte Positionen – unsere Mandate bleiben vertraulich.' },
  direkt: { eyebrow: 'ECHTE DIREKTANSPRACHE', head: ['Wir warten nicht', 'auf Bewerbungen'],
    sub: 'Wir identifizieren und gewinnen gezielt Kandidaten, die heute erfolgreich sind – und morgen Ihr Team verstärken.',
    viz: 'Wir sprechen die Menschen an, die heute erfolgreich arbeiten.', procHead: 'Vier Schritte. Klar und planbar.',
    steps: ['Bedarfsanalyse', 'Anforderungsprofil & Strategie', 'Marktanalyse & Ansprache', 'Präsentation & Begleitung'] },
  messen: { eyebrow: 'WO SIE UNS TREFFEN', head: 'Persönlicher Austausch ist durch nichts zu ersetzen.', note: 'Termin auf einer Messe vereinbaren? Schreiben Sie uns kurz.' },
  award: { eyebrow: 'AUSGEZEICHNET', head: 'Beste Personalberater', sub: 'SZ-Institut der Süddeutschen Zeitung', years: ['2024', '2025', '2026'], streak: 'Zum dritten Mal in Folge.',
    quote: 'Für uns die Bestätigung: Wer sich spezialisiert, besetzt besser.' },
  werte: { eyebrow: 'WORAUF SIE SICH VERLASSEN KÖNNEN', tiles: [
    ['Seit 1992', 'Inhabergeführt, in zweiter Generation.'],
    ['Ahlen · Stuttgart', 'Mandate in ganz Deutschland, Österreich und der Schweiz.'],
    ['Diskret', 'Auf Wunsch unter unserem Logo – Ihre Strategie bleibt geschützt.'],
    ['Gewährleistung', 'Bewährt sich eine Besetzung nicht, besetzen wir ohne zusätzliche Kosten nach.']],
    haltung: 'UNSERE HALTUNG', passion: ['Was wir tun, tun wir aus Leidenschaft', 'und mit echter Neugier auf unsere Branchen'] },   // Zeile 2 in Marine, goldener Punkt wie bei den Claims
  outro: { claim: 'Wir finden die Richtigen', cta: 'Sprechen wir über Ihre Position.', ctaSub: 'Erstgespräch vereinbaren – kostenfrei und unverbindlich.',
    sites: [{ label: 'AHLEN · STAMMSITZ', street: 'Münsterstraße 124', city: '59227 Ahlen', tel: '02528 / 9501-77' },     // laut voss-partner.de/kontakt
      { label: 'STUTTGART · NIEDERLASSUNG', street: 'Moserstraße 20', city: '70182 Stuttgart', tel: '0711 / 3346-45' }],
    web: 'voss-partner.de', mail: 'info@voss-partner.de', resp: 'Antwort innerhalb von 24 Stunden.' },
};
// Fiktive, typische Positionen (keine konkreten Mandate): [Ebene, Titel, Branche] – von der Fachkraft bis zur Geschäftsführung
export const MANDATE = [   // flach, nach Ebene sortiert; die Szene verteilt sie auf 4 (16:9) bzw. 5 (4:5) Reihen, jede Reihe zieht einmal ganz durch
  ['GESCHÄFTSFÜHRUNG', 'Geschäftsführer (m/w/d)', 'Technische Gebäudeausrüstung'], ['GESCHÄFTSFÜHRUNG', 'CFO (m/w/d)', 'Versorgungstechnik'],
  ['GESCHÄFTSFÜHRUNG', 'Technischer Geschäftsführer (m/w/d)', 'Armaturentechnik'], ['GESCHÄFTSFÜHRUNG', 'COO (m/w/d)', 'Anlagenbau'],
  ['GESCHÄFTSFÜHRUNG', 'Prokurist (m/w/d)', 'Technischer Großhandel'], ['VERTRIEBSLEITUNG', 'Head of Sales (m/w/d)', 'Gebäudeautomation'],
  ['LEITUNG', 'Werkleiter (m/w/d)', 'Komponentenfertigung Lüftungstechnik'], ['LEITUNG', 'Technischer Leiter (m/w/d)', 'Umwelttechnologie'],
  ['LEITUNG', 'Kaufmännischer Leiter (m/w/d)', 'SHK-Großhandel'], ['LEITUNG', 'Leiter Forschung & Entwicklung (m/w/d)', 'Kältetechnik'],
  ['VERTRIEBSLEITUNG', 'Vertriebsleiter (m/w/d)', 'Kälte- und Klimatechnik'], ['VERTRIEBSLEITUNG', 'Vertriebsleiter (m/w/d)', 'Industriearmaturen'],
  ['VERTRIEBSLEITUNG', 'Exportleiter (m/w/d)', 'Pumpen- und Armaturentechnik'], ['LEITUNG', 'Leiter Kundendienst (m/w/d)', 'Wärmepumpentechnik'],
  ['LEITUNG', 'Leiter Akademie & Schulung (m/w/d)', 'Heizungstechnik'], ['LEITUNG', 'Niederlassungsleiter (m/w/d)', 'Technischer Großhandel'],
  ['LEITUNG', 'Projektleiter Großprojekte (m/w/d)', 'Rohrleitungsbau'], ['LEITUNG', 'Leiter Produktmanagement (m/w/d)', 'MSR-/Elektrotechnik'],
  ['LEITUNG', 'Leiter Qualitätsmanagement (m/w/d)', 'Ventiltechnik'], ['LEITUNG', 'Leiter Einkauf & Supply Chain (m/w/d)', 'Haustechnik'],
  ['FACH', 'Projektingenieur (m/w/d)', 'Tiefbau'], ['FACH', 'Fachplaner (m/w/d)', 'Technische Gebäudeausrüstung'],
  ['VERTRIEB', 'Key Account Manager (m/w/d)', 'Energietechnik'], ['VERTRIEB', 'Key Account Manager Versorger (m/w/d)', 'Wasser- und Gasarmaturen'],
  ['VERTRIEB', 'Gebietsverkaufsleiter (m/w/d)', 'Sanitärtechnik'], ['VERTRIEB', 'Vertriebsingenieur (m/w/d)', 'Lüftungstechnik'],
  ['FACH', 'Anwendungstechniker (m/w/d)', 'Klimatechnik'], ['FACH', 'Produktmanager (m/w/d)', 'Armaturen'],
  ['FACH', 'Entwicklungsingenieur (m/w/d)', 'Gebäudeautomation'], ['VERTRIEB', 'Technischer Berater (m/w/d)', 'Wasseraufbereitung'],
  ['FACH', 'Konstrukteur (m/w/d)', 'Anlagenbau'],
];
// Messen laut Website (Abschnitt „Wo Sie uns treffen“), ohne Stand
export const MESSEN = [['Data Centre World', 'Frankfurt'], ['IFAT', 'München'], ['Intersolar', 'München'], ['FeuerTrutz', 'Nürnberg'], ['Chillventa', 'Nürnberg'], ['gedatec', 'Berlin'],
  ['GET Nord', 'Hamburg'], ['BAU', 'München'], ['Oldenburger Rohrleitungsforum', 'Oldenburg'], ['Elektrotechnik', 'Dortmund'], ['eltefa', 'Stuttgart'], ['ISH', 'Frankfurt'],
  ['Tausendwasser', 'Berlin'], ['Light + Building', 'Frankfurt'], ['MCE', 'Mailand'], ['SHK+E', 'Essen'], ['IFH/Intherm', 'Nürnberg']];
// Durchlauf der Messen: Position in Zeilen, schneller werdend
export const REEL = { u0: 1.6, v0: 0.75, a: 0.95 };
export const reelPos = (u) => { const x = Math.max(0, u - REEL.u0); return REEL.v0 * x + REEL.a * x * x; };

// Jahreszähler 1992 → 2026 in der Marktkenntnis: beschleunigt (Anteil 0…1 abhängig von der Zeit nach Szenenstart)
export const YEARS = { u0: 0.5, len: 2.4, pow: 2 };
export const yearAt = (u) => Math.min(1, Math.max(0, (u - YEARS.u0) / YEARS.len)) ** YEARS.pow;
const r4 = (x) => Math.round(x * 10000) / 10000;
const S0 = SCENES.map((_, i) => sceneStart(i));
const at = (scene, u) => S0[SCENES.indexOf(scene)] + u;
export const CUES = (() => {
  const c = [];
  WIPES.forEach((w) => { c.push({ t: w, sfx: 'whoosh', pan: 0 }); c.push({ t: w + 0.37, sfx: 'thump' }); });
  c.push({ t: 0.25, sfx: 'whoosh', pan: 0 }, { t: 0.45, sfx: 'thump' }, { t: 1.2, sfx: 'tick', pan: 0.3 });
  c.push({ t: at('open', 0.3), sfx: 'pop', pan: -0.5 }, { t: at('open', 1.6), sfx: 'thump' }, { t: at('open', 2.4), sfx: 'thump' }, { t: at('open', 2.9), sfx: 'pop', pan: 0.3 });
  for (let k = 1, last = -1; k <= 34; k++) { const u = YEARS.u0 + YEARS.len * (k / 34) ** (1 / YEARS.pow); if (u - last >= 0.06) { c.push({ t: at('markt', u), sfx: 'tick', pan: 0.3 }); last = u; } }   // ein Tick pro Jahr, solange hörbar getrennt
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
  c.push({ t: at('werte', 3.4), sfx: 'ding', pan: 0 });
  c.push({ t: at('outro', 0.3), sfx: 'pop' }, { t: at('outro', 1.0), sfx: 'thump' }, { t: at('outro', 2.2), sfx: 'whoosh', pan: 0.2 }, { t: at('outro', 2.6), sfx: 'ding', pan: 0 });
  return c.filter((x) => x.t < DUR).sort((a, b) => a.t - b.t).map((x) => ({ ...x, t: r4(x.t) }));
})();
