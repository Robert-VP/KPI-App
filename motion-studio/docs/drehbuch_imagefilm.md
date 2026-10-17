# Imagefilm Voß & Partner – für Kunden und potenzielle Kunden (Stand 17.10.2026)

100 s · 60 fps · 16:9 (`out/imagefilm_voss_partner_16x9.mp4`) und 4:5 für LinkedIn (`out/imagefilm_voss_partner_4x5_linkedin.mp4`).
Vorlage `templates/imagefilm/` (Texte, Mandate, Messen, Zeiten in `timeline.mjs`), Render `bash scripts/imagefilm.sh`.
CI der Stellenanzeigen; Hero-Video von voss-partner.de auf Marine, helle Bühne mit Dreiecksmotiv, goldenes Mosaik als Kapitelwechsel.
Zu Beginn das farbige Originallogo (`assets/vp-tools/logo/logo-farbe.png`) als eigenes kurzes Intro. Branchen-Chips einheitlich hell (keine farbliche Hervorhebung).
Ohne Anzahl besetzter Positionen und ohne Besetzungsquote. Keine Stimme.

Quellen: Website-Repository (index, leistungen, ueber-uns, branchenkenntnisse, faq); Auszeichnungsjahre 2024/2025/2026 laut Auftraggeber.
Positionen sind fiktiv (keine konkreten Mandate), angelehnt an die Art der Mandate. Vorgaben des Auftraggebers (Grundsatz, Auszeichnungstext)
sind eigenständig formuliert, nicht im Wortlaut übernommen.

| Zeit | Kapitel | Inhalt | Musik |
|---|---|---|---|
| 0–4 s | Logo-Intro | farbiges Originallogo Voß & Partner auf heller Bühne mit Dreiecksmotiv · goldene Linie · „SEIT 1992“ · goldenes Mosaik in den Hero | Intro, Filter geschlossen |
| 4–12 s | Einstieg | Hero · „PERSONALBERATUNG MIT TECHNISCHER KOMPETENZ“ · „Wir finden die Richtigen.“ · „Seit 1992 besetzen wir Schlüsselpositionen in der Gebäudetechnik, Versorgungstechnik und in industriell geprägten Umfeldern.“ | ruhiges Intro, Filter öffnet sich |
| 12–22 s | Marktkenntnis | Jahreszähler 1992 → 2026 · „Seit über drei Jahrzehnten zuhause in:“ · zwölf Branchen (Website „Wo wir zuhause sind“), einheitliche Chips | leichter Groove |
| 22–32 s | Grundsatz | „Breit in den Positionen. Tief in der Branche.“ · „Jede Ebene – in den Märkten, die wir seit 1992 kennen.“ · Pyramide Fachkräfte (Projektingenieure, Fachplaner, Außendienstmitarbeiter, Servicetechniker) → Leitung → Geschäftsführung (Geschäftsführer, Vorstand, CFO, COO) | voller Groove |
| 32–44 s | Positionen | „Positionen, die wir besetzen“ · „Unterschiedliche Ebenen. Eine Branche.“ · drei laufende Reihen fiktiver Positionen: Geschäftsführer TGA, CFO Versorgungstechnik, Werkleiter, Head of Sales Gebäudeautomation … Vertriebsleiter Kälte/Klima, Leiter Kundendienst, Leiter Akademie & Schulung … Projektingenieur Tiefbau, Fachplaner TGA, Servicetechniker Industriekälte … · „Beispielhafte Positionen – unsere Mandate bleiben vertraulich.“ | + Percussion |
| 44–62 s | Echte Direktansprache | „Wir warten nicht auf Bewerbungen.“ · „Wir identifizieren und gewinnen gezielt Kandidaten, die heute erfolgreich sind – und morgen Ihr Team verstärken.“ · Visualisierung: Markt → die Richtigen leuchten gold auf → Linien zu „Ihr Unternehmen“ · „Wir sprechen die Menschen an, die heute erfolgreich arbeiten.“ · „Vier Schritte. Klar und planbar.“ Bedarfsanalyse · Anforderungsprofil & Strategie · Marktanalyse & Ansprache · Präsentation & Begleitung | treibend |
| 62–70 s | Messen | „Wo Sie uns treffen“ · „Persönlicher Austausch ist durch nichts zu ersetzen.“ · 17 Messen laufen schneller werdend durch (ohne Stand) · „Termin auf einer Messe vereinbaren? Schreiben Sie uns kurz.“ | Aufbau mit Riser und Snare-Wirbel |
| 70–82 s | Auszeichnung | „Beste Personalberater“ · „SZ-Institut der Süddeutschen Zeitung“ · Plaketten 2024 · 2025 · 2026 · „Zum dritten Mal in Folge.“ · „Für uns die Bestätigung: Wer sich spezialisiert, besetzt besser.“ | Höhepunkt mit Melodie |
| 82–90 s | Verlässlichkeit | Seit 1992 (inhabergeführt, zweite Generation) · Ahlen · Stuttgart (Mandate in Deutschland, Österreich, Schweiz) · Diskret (auf Wunsch unter unserem Logo) · Gewährleistung (Nachbesetzung ohne zusätzliche Kosten) · „Was wir tun, tun wir aus Leidenschaft – und mit echter Neugier auf unsere Branche.“ | Groove |
| 90–100 s | Outro | Logo · „Wir finden die Richtigen.“ · „Sprechen wir über Ihre Position.“ · „Erstgespräch vereinbaren – kostenfrei und unverbindlich.“ · 02528 / 9501-77 · voss-partner.de · „Antwort innerhalb von 24 Stunden.“ | warm, filtert aus |

## Alternative Musiken (Bild unverändert)

`bash scripts/imagefilm_musik.sh` legt drei weitere Musiken unter die stummen Renderings (`scripts/music_imagefilm.mjs`, lizenzfrei im Code erzeugt).
Alle mit Klang-Logo: drei Glockentöne beim Logo im Intro, im Outro nach Dur aufgelöst.

| Datei-Endung | Richtung | Verlauf |
|---|---|---|
| `_1_episch` | Episch, Richtung Hans Zimmer, D-Moll; eigenes Hörner-Thema (8 Takte, Dm – Bb – F – C) | Logo mit tiefer Fläche, Klang-Logo und Solostimme · Hero: Schlag, Herzschlag-Trommeln, Thema leise im Horn · Marktkenntnis/Grundsatz: Streicher-Ostinato mit 3-3-2-Akzenten, Hörner schwellen an · Positionen: dunkler (Gm – Dm – A), Blechbläser-Stöße, Chor · Direktansprache: Thema voll in Hörnern und Trompeten, Kriegstrommeln, Chor · Messen: Ostinato wird schneller, endlos steigender Ton, Pauken- und Snare-Wirbel, kurze Stille · Auszeichnung: größter Schlag, Thema-Höhepunkt mit Chor · Verlässlichkeit: Trommeln aus, Solostimme und Klavier · Outro: Thema endet in D-Dur, Schluss D – G – D |
| `_3_melodic_techno` | Melodic Techno, A-Moll | Arpeggio und Klang-Logo im Intro · Kick und rollender Bass ab dem Hero, Arpeggio öffnet sich Kapitel für Kapitel · Messen: Break mit Snare-Wirbel · Auszeichnung: Drop mit großer Supersaw-Melodie · Outro in A-Dur |
| `_4_episch_deephouse` | Mischform | Intro und Hero, Auszeichnung und Outro episch (A-Moll), dazwischen der Deep-House-Groove der Hauptfassung |
