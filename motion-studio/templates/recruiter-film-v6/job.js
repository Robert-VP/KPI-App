// Recruiter (m/w/d) in eigener Sache – Version 6: Stellenanzeigen-Film ohne Wachstumsszene, kurze Übergänge,
// Lesezeiten 3 s (kurz) / 4 s (lang) / 5 s (Schluss), Zeilenabstand 1,2 (siehe docs/drehbuch_recruiter.md)
window.JOB = {
  // Anzeige (Schlussteil) – identisch mit dem Stellenanzeigen-Generator
  jobtitel: 'Recruiter (m/w/d)', branche: 'In eigener Sache · Personalberatung',
  untertitel: 'Inhabergeführt in zweiter Generation · Ahlen (Westfalen)', region: 'Ahlen (Westfalen)', projektnr: '',
  qrUrl: '', web: 'voss-partner.de', telefon: 'Telefon 02528 950177',
  fusszusatz: 'Vertrauliche Kontaktaufnahme garantiert.', claim: true, alarm: false, motiv: 'menschen', seed: 20261015, dichte: 100,
  kickerScale: 100, regionSize: 100, titleScale: 100, textY: 0, duration: 66.5, bpm: 120,
  // Film-Texte (durchgehend Sie-Anrede)
  hook1: 'Sie überzeugen|am Telefon?',                                     // | = Zeilenumbruch
  intro: { a: 'Wir suchen:', job: 'Recruiter', mwd: '(m/w/d)', ort: 'in Ahlen.' },
  story: {
    richtige: ['Die Richtigen werden', 'überall gesucht.'],
  },
  eyebrow2: 'Ihre Aufgaben', worte: ['Suchen.', 'Ansprechen.', 'Überzeugen.'],
  vorteile: {
    eyebrow: 'Was Sie erwartet',
    einarbeitung: ['Strukturierte', 'Einarbeitung.'],
    entwicklung: ['Möglichkeiten zur', 'persönlichen und', 'fachlichen', 'Weiterentwicklung.'],
    etabliert: ['Etablierte', 'Personalberatung', 'seit 1992.'],
  },
  pille: ['Erste Recruiting-Erfahrung', 'Oder Quereinstieg aus Vertrieb und Kundenberatung'],
  ende: {
    eyebrow: 'Recruiter (m/w/d) · Ahlen (Westfalen)',
    q1: ['Interessiert?', 'Melden Sie sich!'],
    q2: ['Wie Sie uns erreichen?', 'Am liebsten natürlich', 'über das Telefon.'],
    q3: ['Unter welcher Rufnummer?', 'Finden Sie es heraus!'],   // dabei wird die Rufnummer im Fußband ausgepixelt
  },
};
