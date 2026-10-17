# Style Guide — VP-Tools / Voß & Partner (CI 2026)

Quelle: Deploy der VP-Tools v4.67 (index.html, fn-src/assets) und voss-partner.de. Alle Werte gemessen, nicht erfunden.

## Palette (hex)
| Rolle | Wert | Herkunft |
|---|---|---|
| Marine (Primär, Buttons, Headlines in der Anzeige) | `#0F3556` | `--navy` |
| Marine tief (Fußband, dunkle Flächen) | `#0B1D33` | `--navy-deep`; Fußband läuft `#0A1626 → #0E2A45 → #0F3D63` |
| Gold (einziger Akzent: Eyebrow-Strich, Punkt hinter „Richtigen.“) | `#E8C33C` | `--gold` |
| Gold hell (Job-Alarm-Pille) | `#FBF3D6` | Website `.job-row-ref` |
| Stahlblau (Links, Jobtitel-Verlauf, QR) | `#2E6FB2` | `--steel`, `--link` |
| Hintergrund App | `#F4F5F6` | `--bg` |
| Karte / Panel | `#FFFFFF`, Radius 28 px, weicher Schatten | `--card`, `--radius` |
| Linie | `#E7E9EC` | `--line` |
| Ink (Fließtext, Hero) | `#111418` | `--ink` |
| Sub (Beschreibungen) | `#5B6472` | `--sub` |
| Faint (Hinweise) | `#9AA2AD` | `--faint` |
| Logo-Farben (nur im Logo!) | Grün `#0B7A3B`-ish, Rot `#B5133F`-ish, Gelb `#F2C318`-ish | vp-logo.png, logo-farbe.png |

Regel aus CLAUDE.md: ein Akzent. Für dieses Video ist der Akzent **Gold `#E8C33C`** auf Marine. Grün/Rot/Gelb des Logos erscheinen ausschließlich im Logo selbst.

## Typografie
- **Display und UI: Inter** (assets/vp-tools/font/inter-400/600/700/800.ttf). Die App nutzt `-apple-system … Inter`, die Anzeige rendert Inter 800 für den Jobtitel.
- Hero-Headlines der App: Inter 800, ca. 2.3 rem, enge Laufweite, immer mit Punkt am Ende („Stellenanzeige gestalten.“, „Guten Tag.“).
- Eyebrow: Inter 700, Versalien, Letter-Spacing ~0.2 em, Marine, in der Anzeige mit kurzem Goldstrich davor.
- Jobtitel in der Anzeige: Inter 800, Marine mit leichtem Verlauf nach Stahlblau, „(m/w/d)“ in Grau 600.
- Mono wird in der App nicht verwendet. Im Video nur Inter; für Zahlen Inter 700 mit `font-variant-numeric: tabular-nums`.

## UI-Grammatik (für echte Crops)
- Karten: weiß, Radius 28 px, Schatten `0 10px 30px rgba(15,53,86,.08)`, Nummern-Badge Marine rund mit weißer Ziffer, Kartentitel als Versalien-Eyebrow.
- Inputs: `#FAFBFC`, Rand `#E7E9EC`, Radius 14 px, Inter 400 ~1.05 rem.
- Primär-Button: Marine Pille, weißer Text Inter 700 („Anzeige als PNG exportieren“).
- Topbar: Logo-Kachel links (weiß, Radius 18), User-Chip rechts.
- Drop-Zone: gestrichelte Linie, zentriert „Briefing auswählen oder hierher ziehen“.

## Die Anzeige selbst (Produkt-Output)
- Heller Hintergrund `#F4F5F6`, oben rechts Dreieck-Muster in Marine/Stahlblau mit einzelnen Gold/Rot/Grün-Dreiecken (Option 1) oder Menschen-Motiv (Option 2).
- Logo Voß & Partner oben links. Unten: Goldstrich + Eyebrow, Jobtitel, Untertitel, Region-Pille (weiß, Marine-Rand), gelbe Job-Alarm-Pille.
- Fußband Marine-Verlauf: voss-partner.de / Ahlen · Stuttgart / Telefon, „Wir finden die Richtigen.“ mit goldenem Punkt, QR-Karte weiß „Direkt zum Job“.
- Fünf Exportformate: 1080×1350, 1080×1080, 1080×1920, 1200×1200, 1200×628 (alle real als PNG in assets/vp-tools/ad/).

## Bewegungssprache für das Video
- Springs mit minimalem Overshoot auf UI, keiner auf Type. Karten bauen sich aus Teilen zusammen (Badge → Titel → Felder), nie als Ganzes einfaden.
- Schnitte auf dem Beat (120 BPM), Formatwechsel der Anzeige als Morph des Containers (Breite/Höhe), Inhalt swappt hinter kurzem Blur.
- Cursor: echter Pfeil, führt jede Änderung an. Klick = kurze Skalierung 0.85 + Click-SFX.
- Verboten (CLAUDE.md und Marke): Gradient-Titelkarten, Glow, Partikel, Corner-Labels, alles gleichzeitig einfaden, Logo-Farben als Flächen.
