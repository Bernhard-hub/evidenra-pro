# 🎓 Master Thesis Generator MVP

**Version**: 1.0.0
**Status**: ✅ Implementiert & Getestet (30/30 Tests)
**Erstellt**: 2025-10-20

---

## 📋 Übersicht

Der **MasterThesisGenerator** ist ein MVP-Service, der **vollständige Kapitel für Masterarbeiten** generiert - **OHNE Platzhalter** wie "hier würde folgen..." oder "etc.".

### 🎯 Hauptziele

1. ✅ **Vollständige Kapitel-Generierung** (3.000+ Wörter)
2. ✅ **Anti-Placeholder-Architektur** (automatische Erkennung & Elimination)
3. ✅ **Qualitätssicherung** (Validierung, Konfidenz-Scores)
4. ✅ **Export-Funktionalität** (Markdown, Plain Text)
5. ✅ **Wissenschaftlicher Standard** (Master/PhD-Niveau)

---

## 🚀 Quick Start

### Installation

Der Service ist bereits Teil von `evidenra-professional-v2`:

```bash
# Tests ausführen
npm test -- MasterThesisGenerator.test.ts

# Alle Tests laufen lassen
npm test
```

### Basis-Verwendung

```typescript
import { MasterThesisGenerator, type ChapterContext } from './services/MasterThesisGenerator';

// 1. Kontext definieren
const context: ChapterContext = {
  thesisTitle: "Die Rolle qualitativer Forschung in der Bildungswissenschaft",
  thesisTopic: "Qualitative Forschungsmethoden",
  chapterNumber: 2,
  chapterTitle: "Theoretischer Rahmen",
  targetWords: 3000,
  researchQuestions: [
    "Welche theoretischen Ansätze prägen qualitative Forschung?",
    "Wie hat sich die Methodologie entwickelt?"
  ],
  methodology: "Grounded Theory",
  theoreticalFramework: "Konstruktivismus, Interpretativismus"
};

// 2. API-Einstellungen
const apiSettings = {
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  apiKey: 'your-api-key'
};

// 3. Kapitel generieren
const chapter = await MasterThesisGenerator.generateCompleteChapter(
  context,
  apiSettings,
  {
    language: 'de',
    academicLevel: 'master',
    citationStyle: 'APA',
    strictMode: true, // MUSS 100% vollständig sein
    maxRetries: 3
  }
);

// 4. Ergebnis prüfen
if (chapter.isComplete) {
  console.log('✅ Kapitel vollständig generiert!');
  console.log(`📊 Wortanzahl: ${chapter.totalWordCount}`);
  console.log(`⭐ Qualität: ${(chapter.qualityScore * 100).toFixed(1)}%`);

  // Export
  const markdown = MasterThesisGenerator.exportAsMarkdown(chapter);
  // Speichern...
}
```

---

## 🏗️ Architektur

### Multi-Stage Generation Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                   STAGE 1: OUTLINE                          │
│  - Erstellt Kapitel-Gliederung                             │
│  - Definiert Abschnitte mit Ziel-Wortanzahl               │
│  - Generiert Abstract                                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              STAGE 2: SECTION GENERATION                    │
│  - Generiert jeden Abschnitt VOLLSTÄNDIG                   │
│  - Verwendet Anti-Placeholder-Prompts                       │
│  - Batch-Verarbeitung (effizient)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              STAGE 3: VALIDATION                            │
│  - Placeholder-Detektion (Pattern-Matching)                │
│  - Wortanzahl-Validierung                                   │
│  - Vollständigkeits-Score berechnen                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│           STAGE 4: RETRY LOOP (optional)                    │
│  - Bei Platzhaltern: Neu generieren                         │
│  - Bis zu 3 Versuche                                        │
│  - Strict Mode: MUSS vollständig sein                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                STAGE 5: EXPORT                              │
│  - Markdown-Export                                          │
│  - Plain-Text-Export                                        │
│  - Strukturierte JSON-Daten                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 Anti-Placeholder-Mechanismus

### Problem

AI-Modelle generieren oft **Platzhalter** statt vollständigem Inhalt:

```
❌ SCHLECHT:
"An dieser Stelle würde eine ausführliche Diskussion folgen..."
"Weitere Aspekte wie X, Y, Z etc. sind zu berücksichtigen."
"[Platzhalter für Literaturübersicht]"
```

### Lösung: 3-Stufen-Ansatz

#### 1. **Präventive Prompts**

Der Service verwendet **explizite Anti-Placeholder-Anweisungen**:

```typescript
🚨 KRITISCH WICHTIG - ABSOLUTE REGELN:

❌ ABSOLUT VERBOTEN:
• "hier würde folgen..."
• "an dieser Stelle könnte..."
• "würde man beschreiben..."
• "[Platzhalter]"
• "etc.", "usw." ohne Ausführung

✅ ERFORDERLICH:
• JEDER Satz vollständig ausformuliert
• ALLE Gedanken zu Ende geführt
• KONKRETE Beispiele, keine abstrakten Andeutungen
• Mindestens die Ziel-Wortanzahl erreichen
```

#### 2. **Pattern-Matching-Detektion**

Nach der Generierung: **Automatische Erkennung** von Platzhaltern:

```typescript
const placeholderPatterns = [
  /hier würde/gi,
  /würde folgen/gi,
  /könnte beschrieben werden/gi,
  /an dieser Stelle/gi,
  /\[.*?\]/g,           // [Platzhalter]
  /\.{3,}/g,            // ...
  /etc\.(?!\s+\w)/gi,   // "etc." am Satzende
];
```

#### 3. **Re-Generation Loop**

Wenn Platzhalter erkannt werden:

```typescript
while (attempt <= maxRetries) {
  const chapter = generateChapter();

  if (hasPlaceholders && strictMode) {
    console.log('⚠️ Platzhalter erkannt - Regeneriere...');
    attempt++;
    continue;
  }

  return chapter; // ✅ Vollständig!
}
```

---

## 📊 Validierung & Qualitätssicherung

### ValidationReport

Jedes generierte Kapitel erhält einen detaillierten Bericht:

```typescript
interface ValidationReport {
  hasPlaceholders: boolean;         // true = enthält Platzhalter
  placeholderCount: number;         // Anzahl betroffener Abschnitte
  placeholderLocations: string[];   // Welche Abschnitte?
  meetsWordCount: boolean;          // Ziel-Wortanzahl erreicht?
  actualWordCount: number;
  targetWordCount: number;
  completenessRate: number;         // 0.0 - 1.0
  recommendations: string[];        // Handlungsempfehlungen
}
```

### Vollständigkeits-Score

```typescript
let completenessRate = 1.0;

if (hasPlaceholders) completenessRate -= 0.3;  // -30%
if (!meetsWordCount) completenessRate -= 0.2;  // -20%

// Ergebnis:
// 1.0 = Perfekt ✅
// 0.8-0.99 = Gut, kleine Mängel ⚠️
// < 0.8 = Unvollständig ❌
```

### Strict Mode vs. Relaxed Mode

| Modus | Verhalten |
|-------|-----------|
| **Strict Mode** (`strictMode: true`) | Kapitel **MUSS** 100% vollständig sein. Bei Platzhaltern: Automatische Re-Generation bis zu `maxRetries`. |
| **Relaxed Mode** (`strictMode: false`) | Kapitel wird auch mit kleinen Mängeln akzeptiert. Nützlich für schnelle Entwürfe. |

---

## 💻 API-Referenz

### `generateCompleteChapter()`

**Hauptfunktion** - Generiert ein vollständiges Kapitel.

```typescript
static async generateCompleteChapter(
  context: ChapterContext,
  apiSettings: { provider: string; model: string; apiKey: string },
  options?: Partial<GenerationOptions>
): Promise<CompleteChapter>
```

**Parameter:**

#### `ChapterContext`
```typescript
interface ChapterContext {
  thesisTitle: string;              // Titel der Masterarbeit
  thesisTopic: string;              // Themengebiet
  chapterNumber: number;            // z.B. 2
  chapterTitle: string;             // z.B. "Theoretischer Rahmen"
  targetWords: number;              // z.B. 3000
  previousChaptersSummary?: string; // Kontext aus vorherigen Kapiteln
  researchQuestions?: string[];     // Forschungsfragen
  methodology?: string;             // z.B. "Grounded Theory"
  theoreticalFramework?: string;    // z.B. "Konstruktivismus"
  keyReferences?: string[];         // Wichtige Quellen (für Kontext)
}
```

#### `GenerationOptions`
```typescript
interface GenerationOptions {
  language: 'de' | 'en';                                    // Sprache
  academicLevel: 'bachelor' | 'master' | 'phd';            // Niveau
  citationStyle: 'APA' | 'Harvard' | 'IEEE' | 'Chicago';   // Zitierweise
  maxRetries: number;                                       // Max. Versuche
  strictMode: boolean;                                      // Vollständigkeitszwang
}
```

**Rückgabe:** `CompleteChapter`

```typescript
interface CompleteChapter {
  chapterNumber: number;
  chapterTitle: string;
  abstract: string;                 // Kurze Zusammenfassung
  sections: ChapterSection[];       // Array von Abschnitten
  totalWordCount: number;
  isComplete: boolean;              // true = keine Platzhalter
  qualityScore: number;             // 0-1
  generatedAt: string;              // ISO Timestamp
  validationReport: ValidationReport;
}
```

---

### Export-Funktionen

#### `exportAsMarkdown()`

```typescript
static exportAsMarkdown(chapter: CompleteChapter): string
```

**Ausgabe:**
```markdown
# 2. Theoretischer Rahmen

**Abstract:** Dies ist die Zusammenfassung...

---

## 2.1 Grundlagen

Vollständiger Text des Abschnitts...

## 2.2 Weiterführende Aspekte

Vollständiger Text des nächsten Abschnitts...

---

*Generiert am: 20.10.2025, 11:30*
*Wortanzahl: 3247 Wörter*
*Qualität: 98.5%*
```

#### `exportAsPlainText()`

```typescript
static exportAsPlainText(chapter: CompleteChapter): string
```

Entfernt alle Markdown-Formatierung für reinen Text.

---

## 🧪 Tests

### Test-Coverage

✅ **30 Tests** - Alle bestehen

| Kategorie | Tests |
|-----------|-------|
| **Placeholder Detection** | 6 Tests |
| **Word Count** | 5 Tests |
| **Validation** | 5 Tests |
| **Export** | 3 Tests |
| **Structure** | 3 Tests |
| **Edge Cases** | 5 Tests |
| **Prompts** | 3 Tests |

### Tests ausführen

```bash
# Alle Tests
npm test

# Nur MasterThesisGenerator
npm test -- MasterThesisGenerator.test.ts

# Mit Coverage
npm run test:coverage
```

---

## 📈 Verwendungsbeispiele

### Beispiel 1: Einfache Kapitel-Generierung

```typescript
import { MasterThesisGenerator } from './services/MasterThesisGenerator';

const context = {
  thesisTitle: "Qualitative Forschung in der Praxis",
  thesisTopic: "Forschungsmethoden",
  chapterNumber: 2,
  chapterTitle: "Methodologie",
  targetWords: 3000
};

const apiSettings = {
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  apiKey: process.env.ANTHROPIC_API_KEY
};

try {
  const chapter = await MasterThesisGenerator.generateCompleteChapter(
    context,
    apiSettings,
    { strictMode: true }
  );

  console.log(`✅ Kapitel generiert: ${chapter.totalWordCount} Wörter`);

  // Export als Markdown
  const markdown = MasterThesisGenerator.exportAsMarkdown(chapter);
  fs.writeFileSync('chapter2.md', markdown);

} catch (error) {
  console.error('❌ Fehler:', error);
}
```

---

### Beispiel 2: Erweiterte Generierung mit Kontext

```typescript
const context: ChapterContext = {
  thesisTitle: "Die Entwicklung qualitativer Forschung",
  thesisTopic: "Methodologie und Epistemologie",
  chapterNumber: 3,
  chapterTitle: "Datenerhebung und -analyse",
  targetWords: 4000,

  // Kontext aus vorherigen Kapiteln
  previousChaptersSummary: `
    Kapitel 1 behandelte die historische Entwicklung.
    Kapitel 2 diskutierte den theoretischen Rahmen des Konstruktivismus.
  `,

  // Forschungsfragen
  researchQuestions: [
    "Welche Erhebungsmethoden eignen sich für qualitative Studien?",
    "Wie erfolgt die Datenanalyse in der Grounded Theory?",
    "Welche Qualitätskriterien sind zu beachten?"
  ],

  // Methodologie
  methodology: "Grounded Theory nach Glaser & Strauss",

  // Theoretischer Rahmen
  theoreticalFramework: `
    - Konstruktivismus (Berger & Luckmann)
    - Interpretatives Paradigma (Geertz)
    - Symbolischer Interaktionismus (Blumer)
  `,

  // Wichtige Quellen (für AI-Kontext)
  keyReferences: [
    "Glaser, B. G., & Strauss, A. L. (1967). The Discovery of Grounded Theory",
    "Flick, U. (2009). Qualitative Sozialforschung",
    "Mayring, P. (2015). Qualitative Inhaltsanalyse"
  ]
};

const chapter = await MasterThesisGenerator.generateCompleteChapter(
  context,
  apiSettings,
  {
    language: 'de',
    academicLevel: 'master',
    citationStyle: 'APA',
    strictMode: true,
    maxRetries: 3
  }
);

// Validierung prüfen
const report = chapter.validationReport;
console.log(`Vollständigkeit: ${(report.completenessRate * 100).toFixed(1)}%`);

if (report.hasPlaceholders) {
  console.warn('⚠️ Platzhalter in folgenden Abschnitten:');
  report.placeholderLocations.forEach(loc => console.log(`  - ${loc}`));
}

if (chapter.isComplete) {
  console.log('✅ Kapitel ist vollständig und bereit zur Verwendung!');

  // Export
  const markdown = MasterThesisGenerator.exportAsMarkdown(chapter);
  fs.writeFileSync(`chapter-${chapter.chapterNumber}.md`, markdown);
}
```

---

### Beispiel 3: Batch-Generierung mehrerer Kapitel

```typescript
async function generateFullThesis() {
  const thesisConfig = {
    title: "Qualitative Forschung in der Bildungswissenschaft",
    topic: "Forschungsmethoden und Anwendung",
    chapters: [
      { number: 1, title: "Einleitung", targetWords: 2000 },
      { number: 2, title: "Theoretischer Rahmen", targetWords: 4000 },
      { number: 3, title: "Methodologie", targetWords: 3500 },
      { number: 4, title: "Ergebnisse", targetWords: 5000 },
      { number: 5, title: "Diskussion", targetWords: 4000 },
      { number: 6, title: "Fazit", targetWords: 2000 }
    ]
  };

  const generatedChapters: CompleteChapter[] = [];
  let previousSummaries = "";

  for (const chapterConfig of thesisConfig.chapters) {
    console.log(`\n🔄 Generiere Kapitel ${chapterConfig.number}: ${chapterConfig.title}`);

    const context: ChapterContext = {
      thesisTitle: thesisConfig.title,
      thesisTopic: thesisConfig.topic,
      chapterNumber: chapterConfig.number,
      chapterTitle: chapterConfig.title,
      targetWords: chapterConfig.targetWords,
      previousChaptersSummary: previousSummaries
    };

    try {
      const chapter = await MasterThesisGenerator.generateCompleteChapter(
        context,
        apiSettings,
        { strictMode: true, maxRetries: 3 }
      );

      if (chapter.isComplete) {
        generatedChapters.push(chapter);

        // Update Kontext für nächstes Kapitel
        previousSummaries += `\nKapitel ${chapter.chapterNumber}: ${chapter.abstract}`;

        console.log(`✅ Kapitel ${chapter.chapterNumber} abgeschlossen (${chapter.totalWordCount} Wörter)`);
      } else {
        console.error(`❌ Kapitel ${chapter.chapterNumber} unvollständig`);
      }

    } catch (error) {
      console.error(`❌ Fehler bei Kapitel ${chapterConfig.number}:`, error);
    }
  }

  // Gesamte Masterarbeit exportieren
  const fullThesisMarkdown = generatedChapters
    .map(ch => MasterThesisGenerator.exportAsMarkdown(ch))
    .join('\n\n---\n\n');

  fs.writeFileSync('full-thesis.md', fullThesisMarkdown);

  console.log(`\n✅ FERTIG! ${generatedChapters.length}/${thesisConfig.chapters.length} Kapitel generiert`);
  console.log(`📊 Gesamt-Wortanzahl: ${generatedChapters.reduce((sum, ch) => sum + ch.totalWordCount, 0)}`);
}
```

---

## ⚠️ Limitationen & Best Practices

### Limitationen

1. **Token-Limits**: Einzelne Abschnitte sollten 5.000 Wörter nicht überschreiten
2. **API-Kosten**: Vollständige Kapitel-Generierung kann teuer sein (Claude API)
3. **Qualität**: AI-generierter Text benötigt manuelle Überarbeitung (20-40%)
4. **Aktualität**: Basiert auf AI-Trainingsdaten (kein direkter Datenbankzugriff)
5. **Originalität**: Plagiats-Check empfohlen

### Best Practices

#### 1. **Kontext ist King**

Je mehr Kontext, desto besser:

```typescript
✅ GUT:
{
  previousChaptersSummary: "Detaillierte Zusammenfassung...",
  researchQuestions: ["Konkrete Frage 1", "Konkrete Frage 2"],
  theoreticalFramework: "Ausführliche Beschreibung..."
}

❌ SCHLECHT:
{
  // Minimaler Kontext
}
```

#### 2. **Iterative Verfeinerung**

Generiere zuerst mit `strictMode: false` für schnelle Entwürfe:

```typescript
// Phase 1: Schneller Entwurf
const draft = await generateCompleteChapter(context, api, {
  strictMode: false
});

// Phase 2: Review & Verbesserung
// ... manuelles Review ...

// Phase 3: Finale Version
const final = await generateCompleteChapter(improvedContext, api, {
  strictMode: true
});
```

#### 3. **Validierung ernst nehmen**

```typescript
if (!chapter.isComplete) {
  console.warn('Kapitel unvollständig:');
  chapter.validationReport.recommendations.forEach(r => console.log(r));

  // Entscheide: Akzeptieren oder neu generieren?
}
```

#### 4. **Export für Review**

```typescript
// Export für manuelle Überarbeitung
const markdown = MasterThesisGenerator.exportAsMarkdown(chapter);
fs.writeFileSync('chapter-draft.md', markdown);

// Nutzer kann dann manuell editieren in Markdown-Editor
```

---

## 🔮 Roadmap & Erweiterungen

### Geplante Features

- [ ] **Multi-Pass Editing**: Automatische Überarbeitung für Stil & Kohärenz
- [ ] **Citation Integration**: Automatische Literaturverweise einfügen
- [ ] **Plagiarism Check**: Integration mit Turnitin/iThenticate API
- [ ] **LaTeX Export**: Direkte Konvertierung zu LaTeX-Format
- [ ] **Interactive Review UI**: Web-Interface für manuelle Verbesserungen
- [ ] **Version Control**: Git-ähnliches Tracking von Änderungen
- [ ] **Multi-Language Support**: Vollständige EN/DE/ES/FR Unterstützung
- [ ] **Academic Database Integration**: Tatsächlicher Zugriff auf PubMed, etc.

---

## 🤝 Integration in EVIDENRA Professional

### Schritt 1: UI-Integration

Erstelle neuen Tab in `src/renderer/App.tsx`:

```typescript
import { MasterThesisGenerator } from './services/MasterThesisGenerator';

function ThesisWritingTab() {
  const [chapter, setChapter] = useState<CompleteChapter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    const context = {
      // ... aus UI-Formular
    };

    const result = await MasterThesisGenerator.generateCompleteChapter(
      context,
      apiSettings
    );

    setChapter(result);
    setIsGenerating(false);
  };

  return (
    <div>
      <h1>Wissenschaftliche Arbeit schreiben</h1>
      {/* UI-Formular für ChapterContext */}
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generiere...' : 'Kapitel generieren'}
      </button>

      {chapter && (
        <div>
          <h2>{chapter.chapterTitle}</h2>
          <p>Wortanzahl: {chapter.totalWordCount}</p>
          <p>Qualität: {(chapter.qualityScore * 100).toFixed(1)}%</p>
          {/* Anzeige der Abschnitte */}
        </div>
      )}
    </div>
  );
}
```

---

## 📚 Weiterführende Dokumentation

- [MASTERARBEITS_FEATURE_KONZEPT.md](./MASTERARBEITS_FEATURE_KONZEPT.md) - Ursprüngliches Konzept
- [SEMANTIC_CODING_IMPROVEMENTS.md](./SEMANTIC_CODING_IMPROVEMENTS.md) - Semantische Kodierung
- [README.md](./README.md) - Projekt-Übersicht

---

## 📝 Changelog

### Version 1.0.0 (2025-10-20)

- ✅ Initiale Implementierung
- ✅ Anti-Placeholder-Architektur
- ✅ Validierungs-System
- ✅ Export-Funktionen (Markdown, Plain Text)
- ✅ 30 Unit-Tests (100% Pass)
- ✅ TypeScript-Typdefinitionen
- ✅ Umfassende Dokumentation

---

**Erstellt**: 2025-10-20
**Autor**: Claude Code Assistant
**Status**: ✅ Production-Ready MVP
