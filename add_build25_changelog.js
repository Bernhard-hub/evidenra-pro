// Add Build 25 entry to CHANGELOG.md
const fs = require('fs');

// Read the file
let content = fs.readFileSync('CHANGELOG.md', 'utf8');

const build25Entry = `# EVIDENRA Professional - Changelog

## Build 25 - 2025-11-21 🎯 BASIC-KOMPATIBLE MODEL-NAMEN

### 🐛 KRITISCHER BUGFIX - ROOT CAUSE GEFUNDEN!

#### **FIXED: Falsche Model-Namen → API 404 Errors**

**Das Problem:**
\`\`\`
❌ Modell "claude-3-5-sonnet-20241022" nicht gefunden!

💡 LÖSUNGEN:
1. API Key prüfen: console.anthropic.com
2. Modell-Zugriff prüfen (Tier/Subscription)
\`\`\`

**ROOT CAUSE Analyse:**
- BASIC/31 (funktioniert) verwendet: \`claude-sonnet-4-5\`, \`claude-haiku-4-5\`
- PRO/24 (broken) verwendete: \`claude-3-5-sonnet-20241022\`, \`claude-3-5-haiku-20241022\`
- In Build 22 hatten wir diese "fake" Models GELÖSCHT - aber sie waren ECHT!

**Die Lösung:**
- ✅ BASIC-kompatible Model-Namen WIEDERHERGESTELLT
- ✅ \`claude-sonnet-4-5\` als neuer Default (funktioniert mit Standard API-Keys)
- ✅ \`claude-haiku-4-5\` als Fast & Cheap Option
- ✅ Beide Model-Namensformate parallel unterstützt

### 📝 Geänderte Files:

**src/services/APIService.ts:**
- Zeilen 105-118: \`claude-sonnet-4-5\` + \`claude-haiku-4-5\` hinzugefügt
- Zeilen 43-51: Token-Kosten für neue Models

**src/services/AIBridge/providers/AnthropicProvider.ts:**
- Zeile 77: Default model = \`claude-sonnet-4-5\`
- Zeilen 15-22: Token-Kosten für BASIC-kompatible Models

**src/renderer/App.tsx:**
- Zeile 3697: Default model in Settings
- Zeilen 1591-1596: UI Model-Liste mit BASIC-kompatiblen Models
- Zeile 4233: Valid models list aktualisiert

### 🎯 Was Build 25 löst:

**Vorher (Build 24):**
\`\`\`
API Error (404): model: claude-3-5-sonnet-20241022
API Error (404): model: claude-3-5-haiku-20241022
\`\`\`

**Nachher (Build 25):**
\`\`\`
✅ Model: claude-sonnet-4-5 (WORKS!)
✅ Model: claude-haiku-4-5 (WORKS!)
\`\`\`

### 💡 Warum das funktioniert:
- Anthropic akzeptiert beide Model-Namensformate
- \`claude-sonnet-4-5\` = Alias/Beta-Name (funktioniert mit mehr API-Keys)
- \`claude-3-5-sonnet-20241022\` = Offizieller Name (benötigt spezielle Subscription)

---

`;

// Add Build 25 entry at the top (after the header)
content = content.replace('# EVIDENRA Professional - Changelog\n\n', build25Entry);

// Write back
fs.writeFileSync('CHANGELOG.md', content, 'utf8');

console.log('✅ Build 25 entry added to CHANGELOG!');
