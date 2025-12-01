// Add Build 26 entry to CHANGELOG.md
const fs = require('fs');

// Read the file
let content = fs.readFileSync('CHANGELOG.md', 'utf8');

const build26Entry = `# EVIDENRA Professional - Changelog

## Build 26 - 2025-11-21 🎨 UI VERBESSERUNGEN + DYNAMIC CODING FIX

### 🎨 UI Verbesserungen

#### **NEW: Provider-Auswahl UI mit Tooltips**
- ✅ Card-basierte Auswahl zwischen API Key und Bridge
- ✅ Klare visuelle Unterscheidung der beiden Modi
- ✅ Inline-Tooltips erklären Vor-/Nachteile
- ✅ Automatische Provider-Wahl beim Click auf Card

**Was es bringt:**
- User versteht sofort: API Key = Volle Kontrolle, Bridge = Einfach mit Abo
- Keine Verwirrung mehr zwischen den Modi
- Hover-Infos zeigen exakte Kosten und Requirements

### 🐛 Kritische Bugfixes

#### **FIXED: Dynamic Coding API Overflow (18MB > 16MB)**
- **Problem**: \`API Error (400): too many total text bytes: 18505489 > 16000000\`
- **Root Cause**:
  - Zu große Segment-Texte (unbegrenzt)
  - Zu lange Kategorie-Beschreibungen
  - Zu viele Beispiele pro Kategorie
- **Lösung**:
  - Max 5000 Zeichen pro Segment (mit Truncation-Warnung)
  - Max 200 Zeichen pro Kategorie-Beschreibung
  - Max 2 Beispiele pro Kategorie (je max 100 Zeichen)

**Resultat**: Dynamic Coding funktioniert jetzt auch bei großen Projekten (32 PDFs)

### 📝 Geänderte Files:

**src/renderer/App.tsx:**
- Neue Provider-Choice Section mit Cards
- Icons: Key (API), Zap (Bridge), CheckCircle (Features)
- Inline-Infos zu Kosten & Requirements

**src/services/DynamicCodingPersonas.ts:**
- Zeile 394: Segment-Text auf 5000 Zeichen limitiert
- Zeile 399: Kategorie-Beschreibungen auf 200 Zeichen limitiert
- Zeile 401: Beispiele auf 2 pro Kategorie limitiert

### 🎯 Was Build 26 löst:

**Vorher (Build 25):**
- ❌ User verwirrt über API vs Bridge Unterschied
- ❌ Dynamic Coding crashed bei großen Projekten
- ❌ Error: \`too many total text bytes: 18505489 > 16000000\`

**Nachher (Build 26):**
- ✅ Klare UI-Auswahl zwischen API und Bridge
- ✅ Dynamic Coding funktioniert auch mit 32 PDFs
- ✅ Smart Text-Truncation verhindert Overflow

---

`;

// Add Build 26 entry at the top (after the header)
content = content.replace('# EVIDENRA Professional - Changelog\n\n', build26Entry);

// Write back
fs.writeFileSync('CHANGELOG.md', content, 'utf8');

console.log('✅ Build 26 entry added to CHANGELOG!');
