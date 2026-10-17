# Erklärvideo Job-Alarm (Stand 16.10.2026)

Für potenzielle Kandidaten: wo der Job-Alarm ist und wie er funktioniert. Endet auf der Anzeige „Neu: Job-Alarm“.
Zwei Fassungen (am Dateinamen erkennbar):
- `out/jobalarm_instagram_reel_1080x1920.mp4`: Kurzfassung, 28 s, 9:16, ohne „Fast geschafft!“, alles straffer (`?v=kurz`).
- `out/jobalarm_linkedin_1080x1350.mp4`: lange Fassung, 44 s, 4:5.
120 BPM. Musik: Deep House Variante 1 („soulful mit Orgel“),
dynamische Fassung (16tel-Shaker, Oktav-Bass, Snare-Fills und Becken vor jedem Schritt), keine Stimme.
Dreiecksmotiv oben rechts und Fußband wie in den Stellenanzeigen.
Schrittmarke oben im Bild: „1 Suche festlegen“ → „2 E-Mail bestätigen“ → „3 Stellen erhalten“ mit drei Fortschrittspunkten;
darunter ein ruhiger Verlauf in Hintergrundfarbe. Die Stellenseite ist vergrößert, die Kamera fährt über die Filterleiste zum
Knopf „Job-Alarm für diese Suche“.
Vorlage: `templates/jobalarm/` (Zeitplan und Musik-Abschnitte in `timeline.mjs`), Render: `bash scripts/jobalarm.sh`.

Texte und Abläufe stammen aus der Website (Stellenseite, Job-Alarm-Dialog, Bestätigungs-Mail, Bestätigungsseite,
Job-Alarm-Mail; Quelle: Website-Repository, Stand der lokalen Kopie). Vereinfacht: Der Zwischenschritt
„Job-Alarm jetzt aktivieren“ auf der Bestätigungsseite ist weggelassen.

Zeiten der langen Fassung (LinkedIn):

| Zeit | Bild | Musik |
|---|---|---|
| 0–6 s | Logo, „NEU: JOB-ALARM“, „Die passende Stelle / kommt zu Ihnen.“, Erklärzeile, Fachbereiche | Intro, Drop auf „kommt zu Ihnen.“ |
| 6–10 s | Schritt 1 „Suche festlegen,“: Stellenseite mit Suchfeld, Branche → „Kälte- & Klimatechnik“, Region → „Süd“, Aufgabenbereich; Tipp auf „Job-Alarm für diese Suche“ | drive |
| 10–16 s | Schritt 2 „E-Mail bestätigen“: Formular „Job-Alarm einrichten“, E-Mail, Einwilligung, „Job-Alarm aktivieren“ | drive |
| 16–19,5 s | Dialog „Fast geschafft!“ (Text der Website), Tipp auf „Schließen“ | ruhiger |
| 19,5–26 s | Postfach: „Bitte bestätigen: Ihr Job-Alarm bei Voß & Partner“ ploppt auf, Mail öffnen, „Job-Alarm bestätigen“ → „Job-Alarm ist aktiv“ | drive |
| 26–32 s | Schritt 3: neue Stelle ploppt im Posteingang auf, öffnen: Gebietsverkaufsleiter (m/w/d) Kälte- und Klimatechnik, „Diskret & kostenfrei“ | peak (Melodie) |
| 32–36,75 s | Vorteile: Kostenfrei · Diskret · Jede Stelle nur einmal · Abmeldung mit einem Klick (letzter Punkt steht gut 3 s) | drive |
| 36,75–44 s | Anzeige mit Fußband, Schlussbild ab ca. 39 s (Standzeit gut 5 s) | Groove, Ausklang |
