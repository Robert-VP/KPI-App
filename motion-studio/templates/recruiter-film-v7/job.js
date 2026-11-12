// Recruiter (m/w/d) in eigener Sache – Version 7: komplett im Anzeigen-CI, lebendiges Dreieck-Motiv,
// goldene Mosaik-Übergänge, 128 BPM. Texte stehen ruhig (3 s kurz / 4 s lang / 5 s Schluss), das CI bewegt sich.
window.JOB = {
  // Anzeige (Schlussteil) – identisch mit dem Stellenanzeigen-Generator, Motiv Dreiecke wie die CI-Referenz
  jobtitel: 'Recruiter (m/w/d)', branche: 'In eigener Sache · Personalberatung',
  untertitel: 'Inhabergeführt in zweiter Generation · Ahlen (Westfalen)', region: 'Ahlen (Westfalen)', projektnr: '',
  qrUrl: '', web: 'voss-partner.de', telefon: 'Telefon 02528 950177',
  fusszusatz: 'Vertrauliche Kontaktaufnahme garantiert.', claim: true, alarm: false, motiv: 'dreiecke', seed: 20260714, dichte: 110,
  kickerScale: 100, regionSize: 100, titleScale: 100, textY: 0, duration: 71, bpm: 128,
  // Film-Texte (durchgehend Sie)
  hook1: 'Sie überzeugen|am Telefon?',                                   // | = Zeilenumbruch
  intro: { eyebrow: 'In eigener Sache', job: 'Recruiter', mwd: '(m/w/d)', gesucht: 'gesucht!' },
  aufgaben: { eyebrow: 'Ihre Aufgaben', worte: ['Suchen.', 'Ansprechen.', 'Überzeugen.'] },
  profil: { eyebrow: 'Ihr Profil', worte: ['Kommunikativ.', 'Agil.', 'Motiviert.'] },
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
