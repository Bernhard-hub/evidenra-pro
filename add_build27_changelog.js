// Add Build 27 entry to CHANGELOG.md
const fs = require('fs');

// Read the file
let content = fs.readFileSync('CHANGELOG.md', 'utf8');

const build27Entry = `# EVIDENRA Professional - Changelog

## Build 27 - 2025-11-21 🔧 TREE-SHAKING FIX + STORAGE FIX

### 🐛 Kritische Bugfixes

#### **FIXED: Tree-Shaking entfernt Methoden (APIService)**
- **Problem**:
  \`\`\`
  ❌ Modell-Update fehlgeschlagen: APIService.getAvailableModels is not a function
  ❌ Model refresh failed: APIService.refreshModels is not a function
  \`\`\`
- **Root Cause**: Webpack entfernt static methods trotz named exports
- **Lösung**: Import-Strategie geändert
  - **Vorher**: \`APIService.refreshModels()\` → Webpack entfernt Methode
  - **Nachher**: \`import { refreshModels } from APIService\` → Webpack behält Methode

**Geänderte Files:**
- \`src/renderer/App.tsx\` Line 69: Import erweitert um \`refreshModels\`, \`getAvailableModels\`
- \`src/renderer/App.tsx\` Line 3803, 11250: Aufrufe auf named exports umgestellt

#### **FIXED: localStorage Quota Exceeded (Silent Handling)**
- **Problem**:
  \`\`\`
  ❌ Failed to save project: QuotaExceededError: Setting the value of 'evidenra_project' exceeded the quota
  \`\`\`
- **Root Cause**: Projekt mit 32 PDFs zu groß für localStorage (5-10MB limit)
- **Lösung**: QuotaExceededError wird jetzt silent abgefangen
  - ⚠️ Warnung in Console statt Error-Popup
  - User kann weiter arbeiten
  - Manuelles Speichern (File > Save) funktioniert weiterhin

**Geänderte Files:**
- \`src/renderer/App.tsx\`: QuotaExceededError Handling hinzugefügt

### 📝 Neue Features

#### **NEW: CHANGELOG.md im Build-Ordner**
- ✅ CHANGELOG.md wird automatisch in \`release/win-unpacked/\` kopiert
- ✅ User kann Änderungen direkt im App-Ordner sehen

### 🎯 Was Build 27 löst:

**Vorher (Build 26):**
- ❌ Model Refresh funktioniert nicht
- ❌ getAvailableModels gibt Error
- ❌ localStorage Error bei großen Projekten

**Nachher (Build 27):**
- ✅ Model Refresh funktioniert
- ✅ Alle APIService Methoden funktionieren
- ✅ Keine localStorage Error-Popups mehr
- ✅ CHANGELOG im Build-Ordner verfügbar

### 💡 Technische Details:

**Tree-Shaking Fix Strategie:**
\`\`\`typescript
// ❌ Old (Webpack removes method):
const result = await APIService.refreshModels(provider, key);

// ✅ New (Webpack keeps method):
import { refreshModels } from '../services/APIService';
const result = await refreshModels(provider, key);
\`\`\`

**localStorage Fix Strategie:**
\`\`\`typescript
catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.warn('⚠️ Project too large for auto-save');
    // Silent fail - user can still work
  } else {
    console.error('Failed to save project:', error);
  }
}
\`\`\`

---

`;

// Add Build 27 entry at the top (after the header)
content = content.replace('# EVIDENRA Professional - Changelog\n\n', build27Entry);

// Write back
fs.writeFileSync('CHANGELOG.md', content, 'utf8');

console.log('✅ Build 27 entry added to CHANGELOG!');
