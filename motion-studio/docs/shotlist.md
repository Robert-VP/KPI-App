# Shot-Liste — „Stellenanzeigengenerator“ (VP-Tools)

**Format:** 1080×1920 (9:16) zuerst, danach 1:1 und 16:9 aus derselben Timeline
**Länge:** 20 s = 40 Beats bei 120 BPM (1 Beat = 0,5 s, 1 Takt = 2 s)
**Musik:** in Code synthetisiert, 120 BPM, UI-Clicks und Whooshes auf dem Grid
**Look:** Style Guide (docs/style_guide.md). Canvas `#F4F5F6`, Marine `#0F3556`, Akzent Gold `#E8C33C`, Inter.
**Regel:** nur echte UI-Crops aus assets/vp-tools/, nichts nachgezeichnet. Letzter Frame = erster Frame (Loop).

| Zeit | Beat | Auf dem Screen | Bewegung | Sound |
|---|---|---|---|---|
| 0:00–0:02 | 1–4 | **Hook.** Vier Wörter riesig in Inter 800 Marine: „NEUE STELLE.“ / „KEINE ZEIT.“ Zeile für Zeile, Goldstrich fährt unter „KEINE ZEIT.“ | Zeilen schlagen von unten ein (Spring 120/17), Goldstrich wischt links→rechts | Thump pro Zeile, Whoosh auf Strich |
| 0:02–0:04 | 5–8 | **Produkt erscheint.** Der Text quetscht sich zur Linie, daraus baut sich das VP-Tools-Dashboard: Logo-Kachel, „Guten Tag.“, die vier Hub-Karten (echte Crops) nacheinander | Karten kommen gestaffelt auf 8teln, Cursor fliegt zu „Kandidaten & Jobs“ und klickt | Thump, Ticks auf Karten, Click |
| 0:04–0:06 | 9–12 | **Hub → Generator.** Hub „Kandidaten & Jobs“ mit Karte „Stellenanzeigengenerator.“ (echter Crop), Cursor klickt „Anzeige gestalten →“. Schnitt auf Hero „Stellenanzeige gestalten.“ | Karte skaliert leicht beim Hover, Hero-Zeile kommt mit dem Punkt zuletzt | Click, Pop |
| 0:06–0:09 | 13–18 | **Feature 1 – Briefing.** Karte „1 Briefing übernehmen“ (Crop). Ein PDF-Blatt fällt in die Drop-Zone. Daneben füllt sich Karte „2 Texte“: Jobtitel tippt sich „Gebietsverkaufsleiter (m/w/d)“ (echte Input-Crops typing_0…29), Bereich und Region springen rein | Blatt fällt mit Spring, Drop-Zone pulst 1×, Tipp-Cursor auf 16teln | Whoosh (Drop), Ticks beim Tippen, Pop pro Feld |
| 0:09–0:12 | 19–24 | **Feature 2 – Live-Vorschau & Formate.** Die echte Anzeige (ad/typing_*.png) wächst von der Vorschau-Karte ins Bild, dann morpht ihr Container durch die 5 Formate: 4:5 → 1:1 → 9:16 → 1200² → 1200×628, Format-Label darunter. Motiv wechselt einmal Dreiecke → Menschen | Ein Container, nie Schnitt: Breite/Höhe per track(), Inhalt swappt hinter 4-Frame-Blur, je ein Format pro Beat | Whoosh pro Morph, Click auf Motiv |
| 0:12–0:15 | 25–30 | **Feature 3 – KI-Begleittext & Export.** Karte „5 LinkedIn-Begleittext“, Cursor klickt „✨ Mit KI formulieren“, drei Textzeilen tippen sich in die Textarea. Dann Cursor auf „Anzeige als PNG exportieren“, Button drückt, darunter „Alle 5 Formate als ZIP exportieren“ | Button-Press 0.9 + Rückfeder, die 5 Format-PNGs fächern als Stapel nach rechts auf | Click, Ticks, Ding auf Export |
| 0:15–0:17 | 31–34 | **Die Zahl.** Riesig: „5 Formate.“ Darunter kleiner „aus einem Briefing. In einem Klick.“ Die fünf echten PNGs liegen als Reihe darunter | Zahl zählt 1→5 auf Beats, PNGs rutschen synchron ein | Thump auf jeder Zahl |
| 0:17–0:20 | 35–40 | **Lockup + CTA.** VP-Tools-Logo (vp-logo.png) und „Voß & Partner“ Wortmarke, Eyebrow „KANDIDATEN & JOBS“, Zeile „Anzeige gestalten →“ als Marine-Pille. Goldpunkt setzt den Schlusspunkt. Ab 19,5 s: alles quetscht sich zur Linie und löst sich auf → Frame 20,0 = Frame 0,0 | Logo kommt per Spring von links, Pille von rechts, Punkt poppt | Thump, Pop, Whoosh am Ende |

## Offene Punkte vor dem Code
1. **Hook-Text:** „NEUE STELLE. KEINE ZEIT.“ – oder lieber eine andere Problemformulierung in max. 5 Wörtern?
2. **Echte Kennzahl (0:15):** Der Guide verlangt eine reale Zahl. „5 Formate aus einem Briefing“ ist belegt. Gibt es eine bessere (z. B. erzeugte Anzeigen pro Monat, Minuten pro Anzeige)?
3. **CTA-Zeile:** „Anzeige gestalten →“ wie im Tool, oder ein Satz wie „Jetzt in den VP-Tools.“?
4. **Zielgruppe:** intern (Team Voß & Partner) oder extern (LinkedIn)? Intern würde ich den Login-Schritt weglassen (so geplant), extern eher das Voß-&-Partner-Logo stärker gewichten als VP-Tools.
