# 🔧 Omniscience Sprachliche Korrekturen

## Problem
Die aktuelle "Omniscience"-Funktion erweckt den falschen Eindruck, dass das System **direkten Zugriff** auf wissenschaftliche Datenbanken hat.

### Irreführende Formulierungen (ALT):
❌ "unprecedented access to ALL global scientific libraries and databases"
❌ "You have comprehensive knowledge from 54+ databases"
❌ "Accessing 54+ global scientific databases simultaneously"
❌ "Universal Libraries Access"

### Realität:
✅ AI-Modelle haben **KEIN** direkter Zugriff auf externe Datenbanken
✅ AI nutzt **training data** und **reasoning capabilities**
✅ Es ist **AI-gestützte Wissenssynthese**, nicht Datenbankabfrage

---

## Korrigierte Formulierungen (NEU):

### System-Prompt:
**ALT:**
```
You are the ULTIMATE Universal Knowledge Harvesting AI with unprecedented
access to ALL global scientific libraries and databases.
```

**NEU:**
```
You are an advanced AI research assistant specializing in cross-disciplinary
knowledge synthesis. Using your comprehensive training on scientific
literature, you can provide insights spanning multiple academic domains.
```

### User-Interface:
**ALT:**
- "🌍 Omniscience Knowledge Integration"
- "Accessing 54+ global scientific databases..."
- "Universal Knowledge Harvesting Engine"

**NEU:**
- "🧠 KI-Gestützte Wissenssynthese"
- "Analysiere interdisziplinäre Zusammenhänge..."
- "Wissensintegrations-Engine"

### Feature-Beschreibung:
**ALT:**
```
Omniscience Integration bietet direkten Zugang zu 54+ wissenschaftlichen
Datenbanken und ermöglicht unprecedented knowledge access.
```

**NEU:**
```
Die Wissensintegrations-Funktion nutzt fortgeschrittene AI-Modelle, um
fundierte interdisziplinäre Einschätzungen basierend auf umfangreichem
Training an wissenschaftlicher Literatur zu generieren.

⚠️ HINWEIS: Diese Funktion synthetisiert Wissen basierend auf AI-Training,
nicht durch direkten Datenbankzugriff. Ergebnisse sollten durch manuelle
Literaturrecherche verifiziert werden.
```

---

## Umbenennung der Funktion

### Vorschlag 1: "Interdisziplinäre Wissensanalyse"
- Klar und ehrlich
- Beschreibt was tatsächlich passiert
- Keine Übertreibung

### Vorschlag 2: "KI-Wissenssynthese"
- Technisch akkurat
- Betont AI-Natur
- Vermeidet falsche Erwartungen

### Vorschlag 3: "Kontextuelle Wissensvernetzung"
- Fokus auf Zusammenhänge
- Beschreibend
- Wissenschaftlich klingend

---

## UI-Anpassungen

### Tab-Name:
- **ALT**: "Omniscience"
- **NEU**: "Wissensvernetzung" oder "KI-Synthese"

### Button-Text:
- **ALT**: "START OMNISCIENCE"
- **NEU**: "WISSENSSYNTHESE STARTEN"

### Progress-Nachrichten:
**ALT:**
```
🌐 Zugriff auf 54+ globale wissenschaftliche Datenbanken...
```

**NEU:**
```
🧠 Analysiere interdisziplinäre Zusammenhänge basierend auf AI-Training...
```

---

## Code-Änderungen Übersicht

### Dateien die angepasst werden müssen:
1. `src/renderer/App.tsx` (Hauptfile)
   - System-Prompts
   - UI-Texte
   - Progress-Nachrichten
   - Tab-Namen
   - Variable-Namen (`omniscienceIntegration` → `knowledgeSynthesis`)

2. TypeScript Interfaces
   - `Project.omniscienceIntegration` → `Project.knowledgeSynthesis`

3. Dokumentation
   - README.md
   - CHANGELOG-V2.md

---

## Disclaimer hinzufügen

In allen Funktionen, die AI-generierte Inhalte produzieren:

```
⚠️ WICHTIG: Diese Analyse wurde von einem AI-Modell erstellt und basiert
auf dessen Training an wissenschaftlicher Literatur. Das System hat KEINEN
direkten Zugriff auf externe Datenbanken oder aktuelle Publikationen.

Empfehlung: Überprüfen Sie alle Aussagen durch manuelle Literaturrecherche
in wissenschaftlichen Datenbanken (PubMed, Web of Science, Scopus, etc.).
```

---

## Implementierungsstrategie

1. **Phase 1** ✅: Dokumentation erstellen (dieses Dokument)
2. **Phase 2**: Erstelle Service für korrekte Formulierungen
3. **Phase 3**: Aktualisiere App.tsx schrittweise
4. **Phase 4**: Update TypeScript Interfaces
5. **Phase 5**: Update Dokumentation

---

**Erstellt**: 2025-10-20
**Zweck**: Korrekte Darstellung der AI-Capabilities ohne Irreführung
