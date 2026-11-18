// Recruiter (m/w/d) in eigener Sache – Version 10: wie Version 9, dazu 2 Niederlassungen (Ahlen, Stuttgart),
// Vermittlung in Festanstellung (keine Arbeitnehmerüberlassung) und der vollständige Direktansprache-Satz der Website.
// Elemente von voss-partner.de:
// Hero-Video (Drohnenflug über TGA-Dachzentrale) als Marine-Bühne, „Echte Direktansprache“, Glas-Karte mit Kennzahlen + SZ-Siegel.
// Video-Einzelbilder vorher erzeugen: bash scripts/prep_web_video.sh
window.JOB = {
  // Anzeige (Schlussteil) – identisch mit dem Stellenanzeigen-Generator, Motiv Dreiecke wie die CI-Referenz
  jobtitel: 'Recruiter (m/w/d)', branche: 'In eigener Sache · Personalberatung',
  untertitel: 'Inhabergeführt in zweiter Generation · Ahlen (Westfalen)', region: 'Ahlen (Westfalen)', projektnr: '',
  qrUrl: '', web: 'voss-partner.de', telefon: 'Telefon 02528 950177',
  fusszusatz: 'Vertrauliche Kontaktaufnahme garantiert.', claim: true, alarm: false, motiv: 'dreiecke', seed: 20260714, dichte: 110,
  kickerScale: 100, regionSize: 100, titleScale: 100, textY: 0, duration: 79.5, bpm: 128,
  // Film-Texte (durchgehend Sie)
  hook1: 'Sie überzeugen|am Telefon?',                                   // | = Zeilenumbruch
  intro: { eyebrow: 'In eigener Sache', job: 'Recruiter', mwd: '(m/w/d)', gesucht: 'gesucht!' },
  direkt: { eyebrow: 'Echte Direktansprache', lines: ['Wir warten nicht', 'auf Bewerbungen.'], lines2: ['Wir identifizieren', 'und gewinnen gezielt', 'Kandidaten.'] },   // voss-partner.de
  aufgaben: { eyebrow: 'Ihre Aufgaben', worte: ['Suchen.', 'Ansprechen.', 'Überzeugen.'] },
  vorteile: {
    eyebrow: 'Was Sie erwartet',
    einarbeitung: ['Strukturierte', 'Einarbeitung.'],
    entwicklung: ['Möglichkeiten zur', 'persönlichen und', 'fachlichen', 'Weiterentwicklung.'],
    etabliert: ['Etablierte', 'Personalberatung', 'seit 1992.'],
  },
  // Kennzahlen und Auszeichnung wie auf voss-partner.de (Startseite)
  award: 'Beste Personalberater 2026 — SZ-Institut',
  stats: [{ v: 33, label: ['Jahre', 'Marktkenntnis'] }, { v: 2, label: ['Niederlassungen', 'Ahlen · Stuttgart'] }],
  // Geschäftsmodell: Personalvermittlung in Festanstellung. „Zeitarbeit“ = umgangssprachlich, „Arbeitnehmerüberlassung“ = Begriff aus dem AÜG.
  ueberUns: { eyebrow: 'Über uns', fest: ['Vermittlung in', 'Festanstellung.'], keine: ['Keine Zeitarbeit', '(Arbeitnehmerüberlassung).'] },
  pille: ['Erste Recruiting-Erfahrung', 'Oder Quereinstieg aus Vertrieb und Kundenberatung'],
  ende: {
    eyebrow: 'Recruiter (m/w/d) · Ahlen (Westfalen)',
    q1: ['Interessiert?', 'Melden Sie sich!'],
    q2: ['Wie Sie uns erreichen?', 'Am liebsten natürlich', 'über das Telefon.'],
    q3: ['Unter welcher Rufnummer?', 'Finden Sie es heraus!'],   // dabei wird die Rufnummer im Fußband ausgepixelt
  },
};
