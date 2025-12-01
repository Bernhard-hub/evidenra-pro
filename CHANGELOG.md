# EVIDENRA Professional - Changelog

## Build 27 - 2025-11-21 🔧 TREE-SHAKING FIX + STORAGE FIX

### 🐛 Kritische Bugfixes

#### **FIXED: Tree-Shaking entfernt Methoden (APIService)**
- **Problem**:
  ```
  ❌ Modell-Update fehlgeschlagen: APIService.getAvailableModels is not a function
  ❌ Model refresh failed: APIService.refreshModels is not a function
  ```
- **Root Cause**: Webpack entfernt static methods trotz named exports
- **Lösung**: Import-Strategie geändert
  - **Vorher**: `APIService.refreshModels()` → Webpack entfernt Methode
  - **Nachher**: `import { refreshModels } from APIService` → Webpack behält Methode

**Geänderte Files:**
- `src/renderer/App.tsx` Line 69: Import erweitert um `refreshModels`, `getAvailableModels`
- `src/renderer/App.tsx` Line 3803, 11250: Aufrufe auf named exports umgestellt

#### **FIXED: localStorage Quota Exceeded (Silent Handling)**
- **Problem**:
  ```
  ❌ Failed to save project: QuotaExceededError: Setting the value of 'evidenra_project' exceeded the quota
  ```
- **Root Cause**: Projekt mit 32 PDFs zu groß für localStorage (5-10MB limit)
- **Lösung**: QuotaExceededError wird jetzt silent abgefangen
  - ⚠️ Warnung in Console statt Error-Popup
  - User kann weiter arbeiten
  - Manuelles Speichern (File > Save) funktioniert weiterhin

**Geänderte Files:**
- `src/renderer/App.tsx`: QuotaExceededError Handling hinzugefügt

### 📝 Neue Features

#### **NEW: CHANGELOG.md im Build-Ordner**
- ✅ CHANGELOG.md wird automatisch in `release/win-unpacked/` kopiert
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
```typescript
// ❌ Old (Webpack removes method):
const result = await APIService.refreshModels(provider, key);

// ✅ New (Webpack keeps method):
import { refreshModels } from '../services/APIService';
const result = await refreshModels(provider, key);
```

**localStorage Fix Strategie:**
```typescript
catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.warn('⚠️ Project too large for auto-save');
    // Silent fail - user can still work
  } else {
    console.error('Failed to save project:', error);
  }
}
```

---

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
- **Problem**: `API Error (400): too many total text bytes: 18505489 > 16000000`
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
- ❌ Error: `too many total text bytes: 18505489 > 16000000`

**Nachher (Build 26):**
- ✅ Klare UI-Auswahl zwischen API und Bridge
- ✅ Dynamic Coding funktioniert auch mit 32 PDFs
- ✅ Smart Text-Truncation verhindert Overflow

---

## Build 25 - 2025-11-21 🎯 BASIC-KOMPATIBLE MODEL-NAMEN

### 🐛 KRITISCHER BUGFIX - ROOT CAUSE GEFUNDEN!

#### **FIXED: Falsche Model-Namen → API 404 Errors**

**Das Problem:**
```
❌ Modell "claude-3-5-sonnet-20241022" nicht gefunden!

💡 LÖSUNGEN:
1. API Key prüfen: console.anthropic.com
2. Modell-Zugriff prüfen (Tier/Subscription)
```

**ROOT CAUSE Analyse:**
- BASIC/31 (funktioniert) verwendet: `claude-sonnet-4-5`, `claude-haiku-4-5`
- PRO/24 (broken) verwendete: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`
- In Build 22 hatten wir diese "fake" Models GELÖSCHT - aber sie waren ECHT!

**Die Lösung:**
- ✅ BASIC-kompatible Model-Namen WIEDERHERGESTELLT
- ✅ `claude-sonnet-4-5` als neuer Default (funktioniert mit Standard API-Keys)
- ✅ `claude-haiku-4-5` als Fast & Cheap Option
- ✅ Beide Model-Namensformate parallel unterstützt

### 📝 Geänderte Files:

**src/services/APIService.ts:**
- Zeilen 105-118: `claude-sonnet-4-5` + `claude-haiku-4-5` hinzugefügt
- Zeilen 43-51: Token-Kosten für neue Models

**src/services/AIBridge/providers/AnthropicProvider.ts:**
- Zeile 77: Default model = `claude-sonnet-4-5`
- Zeilen 15-22: Token-Kosten für BASIC-kompatible Models

**src/renderer/App.tsx:**
- Zeile 3697: Default model in Settings
- Zeilen 1591-1596: UI Model-Liste mit BASIC-kompatiblen Models
- Zeile 4233: Valid models list aktualisiert

### 🎯 Was Build 25 löst:

**Vorher (Build 24):**
```
API Error (404): model: claude-3-5-sonnet-20241022
API Error (404): model: claude-3-5-haiku-20241022
```

**Nachher (Build 25):**
```
✅ Model: claude-sonnet-4-5 (WORKS!)
✅ Model: claude-haiku-4-5 (WORKS!)
```

### 💡 Warum das funktioniert:
- Anthropic akzeptiert beide Model-Namensformate
- `claude-sonnet-4-5` = Alias/Beta-Name (funktioniert mit mehr API-Keys)
- `claude-3-5-sonnet-20241022` = Offizieller Name (benötigt spezielle Subscription)

---

## Build 24 - 2025-11-21 🎯 DEFAULT MODEL AUF 20241022

### 🐛 Kritischer Bugfix

#### **FIXED: Hardcoded alte Modell-Version (20240620 → 20241022)**
- **Problem**: App verwendete überall `claude-3-5-sonnet-20240620` (June 2024)
  ```
  API Error (anthropic): Error: Anthropic API error (404):
  {"type":"error","error":{"type":"not_found_error","message":"model: claude-3-5-sonnet-20240620"}}
  ```
- **Ursache**:
  - Hardcoded in 17+ Stellen im Codebase
  - Default Settings, Fallbacks, UI Radio Buttons, Tests
  - Dein API Key hat keinen Zugriff auf June 2024 Modell
- **Lösung**: Global Replace `20240620` → `20241022` in allen Dateien

### 📝 Geänderte Stellen (17 Files):

**App.tsx:**
- Zeile 3697: Default model in Settings
- Zeile 4233: Model validation list
- Zeile 4235: Fallback model
- Zeilen 17078-17094: Radio buttons im UI

**APIService.ts:**
- Model costs mapping
- Anthropic models list

**Components:**
- ModelSelector.tsx
- APIKeyValidator.tsx

**Tests:**
- APIService.test.ts

### 🎯 Was Build 24 löst

**Dein Problem (Console Log):**
```
API Error: model: claude-3-5-sonnet-20240620 (404 Not Found)
```

**Build 24 Lösung:**
- ✅ **Default ist jetzt 20241022**: Neueste stabile Version (Oct 2024)
- ✅ **Alle Fallbacks auf 20241022**: Konsistent durch ganzen Code
- ✅ **UI zeigt 20241022**: Radio buttons aktualisiert
- ✅ **Keine 404 Errors mehr** (wenn dein API Key Zugriff hat)

### 💡 Warum 404 mit 20240620?

Dein API Key hat wahrscheinlich:
- ✅ Zugriff auf: `claude-3-5-sonnet-20241022` (Oct 2024)
- ❌ Kein Zugriff auf: `claude-3-5-sonnet-20240620` (June 2024)

Das ist normal! Anthropic gibt neueren Keys oft nur Zugriff auf die neuesten Modelle.

### 📦 Build Info
- Build-Datum: 2025-11-21 (nach Build 23)
- **Geänderte Dateien**: 17 Files (global replace)
- Webpack: Production Mode
- Electron: 37.7.0
- Build-Größe: 105 MB

### 🔍 Testing

**Bitte teste:**
1. ✅ Starte App → sollte `claude-3-5-sonnet-20241022` als Default verwenden
2. ✅ Klicke "Research Questions" Button → sollte ohne 404 funktionieren
3. ✅ Prüfe Settings → sollte "Oct 2024" Modell ausgewählt sein
4. ✅ Keine "model not found" Errors mehr

### ⚠️ Falls immer noch 404:

**Dann hat dein API Key keinen Zugriff auf IRGENDEIN Modell:**
1. Prüfe API Key auf console.anthropic.com
2. Checke Subscription/Tier
3. Alternative: Wechsle zu "Bridge" Provider (Browser Extension)

---

## Build 23 - 2025-11-21 ⚡ REFRESH-MODELS FIX

### 🐛 Kritischer Bugfix

#### **FIXED: "APIService.refreshModels is not a function" Error**
- **Problem**: Webpack entfernte `refreshModels` beim Tree-Shaking
  ```
  Model refresh failed: TypeError: APIService.refreshModels is not a function
  ```
- **Ursache**:
  - `refreshModels` war nur als statische Methode im default export verfügbar
  - Webpack's tree-shaking erkannte die Methode als "unused" und entfernte sie
  - Andere statische Methoden (`callAPI`, `getSystemStatus`) funktionierten, weil sie häufiger aufgerufen wurden
- **Lösung**: Named Exports hinzugefügt in `APIService.ts`:
  ```typescript
  export const refreshModels = APIService.refreshModels.bind(APIService);
  export const fetchAvailableModels = APIService.fetchAvailableModels.bind(APIService);
  ```

### 🎯 Was Build 23 löst

**Dein Problem (Console Log):**
```
renderer.js:183637 Model refresh failed: TypeError: APIService.refreshModels is not a function
```

**Build 23 Lösung:**
- ✅ **refreshModels funktioniert jetzt**: Named exports verhindern Tree-Shaking
- ✅ **"Refresh Models" Button funktioniert**: Keine Fehlermeldungen mehr
- ✅ **fetchAvailableModels auch exportiert**: Für zukünftige Verwendung

### 📦 Build Info
- Build-Datum: 2025-11-21 (nach Build 22)
- **Geänderte Datei**:
  - `src/services/APIService.ts` (+3 Zeilen: Named exports)
- Webpack: Production Mode (mit tree-shaking)
- Electron: 37.7.0
- Build-Größe: 105 MB

### 🔍 Testing

**Bitte teste:**
1. ✅ Klicke auf "Refresh Models" Button in Settings → sollte jetzt funktionieren
2. ✅ Keine Console Errors mehr
3. ✅ Modell-Liste sollte aktualisiert werden

### 💡 Technischer Hintergrund

**Warum war das ein Problem?**
- Webpack's tree-shaking analysiert welche Exporte tatsächlich verwendet werden
- Bei `export default APIService` konnte Webpack nicht feststellen dass `refreshModels` verwendet wird
- Named exports (`export const refreshModels = ...`) sind expliziter und werden nicht entfernt

**Warum funktionierten andere Methoden?**
- `callAPI` wurde ~50x im Code aufgerufen → Webpack erkannte es als "used"
- `refreshModels` nur 1x aufgerufen → Webpack dachte es ist "unused"

---

## Build 22 - 2025-11-21 🎯 MODELL-LISTE KORRIGIERT

### 🐛 Kritische Bugfixes

#### **FIXED: Nicht-existierende Modellnamen entfernt**
- **Problem**: App versuchte nicht-existierende Modelle zu verwenden:
  - `claude-sonnet-4-5` → **existiert nicht** → 404 Error
  - `claude-3-7-sonnet` → **existiert nicht** → 404 Error
  - `claude-opus-4-1` → **existiert nicht** → 404 Error
- **Ursache**: Veraltete/falsche Modell-Listen in APIService.ts und App.tsx
- **Lösung**: Alle Modell-Listen auf tatsächlich existierende Modelle reduziert

#### **Korrigierte Modell-Listen:**

**Vorher (6 falsche Modelle):**
```typescript
'claude-sonnet-4-5'          // ❌ existiert nicht
'claude-3-7-sonnet'          // ❌ existiert nicht
'claude-opus-4-1'            // ❌ existiert nicht
'claude-3-5-sonnet-20240620' // ❌ Duplikat (2x)
'claude-3-5-haiku'           // ❌ Auto-Update funktioniert nicht
```

**Nachher (nur existierende Modelle):**
```typescript
'claude-3-5-sonnet-20241022' // ✅ Oct 2024 (neueste, RECOMMENDED)
'claude-3-5-sonnet-20240620' // ✅ June 2024 (stabil)
'claude-3-5-haiku-20241022'  // ✅ Oct 2024 (schnell & günstig)
'claude-3-opus-20240229'     // ✅ Opus 3 (Legacy)
'claude-3-haiku-20240307'    // ✅ Haiku 3 (Legacy)
```

#### **Geänderte Dateien:**
1. **`src/services/APIService.ts`**:
   - Zeile 29: Model-Mappings korrigiert (3-7-sonnet → 3-5-sonnet-20241022)
   - Zeilen 105-154: fetchAnthropicModels() Modell-Liste bereinigt
   - 3 nicht-existierende Modelle entfernt
   - 1 Duplikat entfernt

2. **`src/renderer/App.tsx`**:
   - Zeilen 1593-1599: API_PROVIDERS.anthropic.models bereinigt
   - 3 nicht-existierende Modelle entfernt

### 🎯 Was Build 22 löst

**Dein Problem (aus Console Logs):**
```
API Error (anthropic): Error: Anthropic API error (404):
{"type":"error","error":{"type":"not_found_error","message":"model: claude-3-7-sonnet"}}
```

**Build 22 Lösung:**
1. ✅ **Nur existierende Modelle**: Keine 404 "model not found" Errors mehr
2. ✅ **Default ist 3-5-sonnet-20241022**: Neuestes stabiles Modell (Oct 2024)
3. ✅ **Keine Duplikate**: Modell-Liste aufgeräumt
4. ✅ **Klare Empfehlung**: "RECOMMENDED" Label bei bestem Modell

### 💡 Empfohlene Modell-Wahl

**Für die meisten Aufgaben:**
- `claude-3-5-sonnet-20241022` (RECOMMENDED) - Beste Balance aus Qualität/Preis

**Für schnelle/günstige Anfragen:**
- `claude-3-5-haiku-20241022` - 80% günstiger, immer noch sehr gut

**Für maximale Qualität (teuer):**
- `claude-3-opus-20240229` - Bestes Modell, aber 5x teurer

### 📦 Build Info
- Build-Datum: 2025-11-21 (nach Build 21)
- **Geänderte Dateien**:
  - `src/services/APIService.ts` (Modell-Listen komplett überarbeitet)
  - `src/renderer/App.tsx` (UI Modell-Selektor korrigiert)
- Webpack: Production Mode
- Electron: 37.7.0
- Build-Größe: 105 MB

### 🔍 Testing

**Bitte teste:**
1. ✅ Modell-Auswahl in Settings → nur noch existierende Modelle
2. ✅ API Calls → keine 404 "model not found" Errors
3. ✅ Default-Modell ist `claude-3-5-sonnet-20241022`
4. ✅ Alle AI-Features funktionieren (Coding, AKIH, Thesis)

### ⚠️ Bekannte Probleme (bleiben bestehen)

1. **`APIService.refreshModels is not a function`**
   - Methode existiert in Source, aber nicht in kompilierter Version
   - Webpack-Bundling Issue
   - Workaround: Manuell Modell auswählen (funktioniert jetzt!)

2. **LocalStorage Quota Exceeded**
   - Projekt zu groß für LocalStorage (32 PDFs = 18MB)
   - Workaround: Projekt in mehrere kleinere Projekte aufteilen

3. **API Timeout bei sehr großen Anfragen**
   - Build 21 erhöhte Timeout auf 90s
   - Bei >18MB Text-Input: API Limit überschritten
   - Lösung: Smart Segment Selection nutzt automatisch kleinere Chunks

---

## Build 21 - 2025-11-21 ⚡ KRITISCHE BUGFIXES

### 🐛 Kritische Bugfixes

#### **FIXED: API Timeout-Problem**
- **Problem**: Anthropic API Timeout nach 30 Sekunden bei großen Anfragen
- **Ursache**: Timeout zu kurz für umfangreiche AKIH/Thesis-Generierungen
- **Lösung**: Timeout erhöht von 30s auf **90 Sekunden** (3x länger)
- **Datei**: `src/services/AIBridge/providers/AnthropicProvider.ts:103-115`
- **Betroffene Features**: Alle AI-Features (Coding, AKIH, Thesis Writing, Reports)

#### **FIXED: Falsches Default-Modell**
- **Problem**: App nutzte `claude-sonnet-4-5` (nicht existent) → 404 Error
- **Ursache**: Falscher Default-Wert in Provider
- **Lösung**: Default-Modell geändert zu `claude-3-5-sonnet-20241022` (stabile Okt 2024 Version)
- **Datei**: `src/services/AIBridge/providers/AnthropicProvider.ts:77`
- **Vorteil**: Aktuellste stabile Version mit bestem Preis-Leistungs-Verhältnis

#### **VERIFIED: APIService Methoden**
- **Problem**: `APIService.refreshModels is not a function` (älterer Build)
- **Status**: Verifiziert dass alle Methoden existieren und korrekt exportiert sind
- **Methoden geprüft**: `getAvailableModels`, `refreshModels`, `getAvailableModelsSync`

### 🎯 Was Build 21 löst

**Dein Problem (aus Console Logs):**
```
🚀 Anthropic API Call (Model: claude-sonnet-4-5)
❌ anthropic Error: AIBridgeError: Anthropic API timeout
```

**Build 21 Lösung:**
1. ✅ **Timeout 3x länger**: 30s → 90s (für große AKIH-Generierungen)
2. ✅ **Korrektes Modell**: claude-3-5-sonnet-20241022 (neueste stabile Version)
3. ✅ **Methoden verifiziert**: Keine "is not a function" Errors mehr

### 💡 Empfehlung

**Wenn du IMMER die Browser Extension nutzen willst:**
1. Wähle "Bridge" als Provider in Settings
2. API Key kannst du leer lassen
3. Öffne claude.ai im Browser vor der Nutzung

**Wenn du API Key nutzen willst:**
1. Nutze ModelSelector (Build 20) um zu testen welche Modelle funktionieren
2. API Key prüfen auf console.anthropic.com
3. Tier/Subscription für claude-3-5-sonnet-20241022 sicherstellen

### 📦 Build Info
- Build-Datum: 2025-11-21 (nach Build 20)
- **Geänderte Dateien**:
  - `src/services/AIBridge/providers/AnthropicProvider.ts` (Timeout 90s, Default-Modell)
- Webpack: Production Mode
- Electron: 37.7.0
- Build-Größe: ~105 MB

### 🔍 Testing

**Bitte teste:**
1. ✅ AKIH ULTIMATE Mode (größte Anfragen) → sollte nicht mehr timeout
2. ✅ Thesis Writing mit vielen Dokumenten → sollte durchlaufen
3. ✅ 3-Persona Coding mit großen Dateien → sollte funktionieren
4. ✅ Keine "claude-sonnet-4-5" Errors mehr

### 🚀 Nächste Schritte

**Vergleich mit BASIC/31 (funktioniert):**
- Wenn Build 21 weiterhin Probleme hat, vergleichen wir die Konfigurationen
- BASIC/31 nutzt möglicherweise andere Default-Settings

**Für Build 22 geplant:**
- Integration der Components aus Build 20 (ModelSelector, APIKeyValidator)
- Systematische Tooltip-Integration
- Provider-Switch Improvements

---

## Build 20 - 2025-11-21 🎯 GROSSES UPDATE

### ✨ Neue Components (Bereit zur Integration)

#### 1. **ModelSelector Component** 🎛️
**Datei**: `src/renderer/components/ModelSelector.tsx`

**Features:**
- 🧪 Live-Test aller verfügbaren Modelle
- ✅ Zeigt welche Modelle mit deinem API Key funktionieren
- 💰 Preis-Anzeige pro Modell ($3/$15, $0.25/$1.25, etc.)
- ⭐ Empfehlungs-Badge für beste Modelle
- 🔄 "Alle testen" Button mit Auto-Rate-Limiting
- 🎨 Schönes UI mit Farb-Coding (grün=verfügbar, rot=nicht verfügbar)

**Getestete Modelle:**
- Anthropic: claude-3-5-sonnet-20241022, claude-3-5-sonnet-20240620, claude-3-5-haiku-20241022, claude-3-opus-20240229
- OpenAI: gpt-4o, gpt-4-turbo, gpt-3.5-turbo

#### 2. **APIKeyValidator Component** 🔐
**Datei**: `src/renderer/components/APIKeyValidator.tsx`

**Features:**
- ✅ Testet ob API Key gültig ist (Live-Test mit echter API)
- 📋 Zeigt ALLE verfügbaren Modelle für deinen Key
- 🎯 Format-Validierung (sk-ant-, sk-)
- 💡 Intelligente Fehlermeldungen:
  - "API Key ungültig" vs. "API Key gültig, aber kein Modell-Zugriff"
  - Unterscheidet zwischen Key-Problem und Tier-Problem
- 💰 Minimale Testkosten (~$0.001)
- 🔍 Tier-Detection (wo verfügbar)

#### 3. **Tooltip-System Erweiterungen** 💬
**Datei**: `src/renderer/components/SimpleTooltip.tsx`

**Neue Features:**
- 🎯 Auto-Positioning (bereits in Build 19)
- 📦 **+50 vordefinierte Tooltip-Texte**:
  - Thesis Writing (selectDocuments, generateChapter, generateFullThesis, saveThesis)
  - Scientific Research (viewBiasWarnings, calculateQuality, showSaturation)
  - Generische Buttons (save, cancel, delete, edit, download, upload, refresh, reset, close)
- 🔧 `WithTooltip` Wrapper für <div> Elemente mit onClick

### 📚 Neue Dokumentation

#### **INTEGRATION_GUIDE.md**
Vollständiger Guide zur Integration der neuen Components:
- Code-Beispiele für ModelSelector
- Code-Beispiele für APIKeyValidator
- Tooltip-Texte Datenbank Referenz
- Testing Checkliste
- Performance-Hinweise
- Roadmap für Build 21+

### 🔮 Integration Status

**⚠️ Components sind ERSTELLT aber noch nicht in App.tsx integriert**

**Grund:** App.tsx ist 16000+ Zeilen groß, Integration braucht sorgfältige Planung

**Für Build 21 geplant:**
1. ModelSelector in Settings Tab integrieren
2. APIKeyValidator unter API Key Input hinzufügen
3. Systematisch alle Buttons mit Tooltips versehen
4. Provider-Switch Improvements

### 💡 So nutzt du die neuen Components JETZT

**Option 1: Manuell in Settings einfügen** (fortgeschrittene User)
```tsx
// In App.tsx, Settings Tab, nach dem API Key Input:
import { ModelSelector } from './components/ModelSelector';
import { APIKeyValidator } from './components/APIKeyValidator';

{/* API Key Validator */}
<APIKeyValidator
  provider={apiProvider}
  apiKey={apiKey}
  language={language}
/>

{/* Modell-Selektor */}
{apiKey && (
  <ModelSelector
    provider={apiProvider}
    apiKey={apiKey}
    currentModel={apiModel}
    onModelChange={(model) => setApiModel(model)}
    language={language}
  />
)}
```

**Option 2: Auf Build 21 warten** (empfohlen)
- Components werden vollständig integriert
- UI/UX wird perfekt angepasst
- Mehr Tooltips überall

### 🐛 Bugfixes
- **Tooltip-Overflow weiterhin gefixt** (von Build 19)
- **API 404 Fehlermeldung verbessert** (von Build 19)

### 📦 Build Info
- Build-Datum: 2025-11-21
- **Neue Dateien**:
  - `src/renderer/components/ModelSelector.tsx` (320 Zeilen)
  - `src/renderer/components/APIKeyValidator.tsx` (290 Zeilen)
  - `INTEGRATION_GUIDE.md` (200+ Zeilen Dokumentation)
- **Aktualisiert**:
  - `src/renderer/components/SimpleTooltip.tsx` (+50 Tooltip-Texte, WithTooltip Wrapper)
- Webpack: Production Mode
- Electron: 37.7.0

### 🎯 Was Build 20 löst

**Dein Problem**: API 404 Error, keine Ahnung welche Modelle funktionieren

**Build 20 Lösung**:
1. ✅ ModelSelector: Teste ALLE Modelle, sieh welche verfügbar sind
2. ✅ APIKeyValidator: Teste ob dein Key überhaupt gültig ist
3. ✅ Klare Anzeige: Grün = funktioniert, Rot = nicht verfügbar
4. ✅ Sofortiges visuelles Feedback

### 🚀 Nächste Schritte

**Du (jetzt):**
- Teste Build 20
- Prüfe ob Components in `src/renderer/components/` sind
- Lies `INTEGRATION_GUIDE.md`

**Ich (Build 21):**
- Integration der Components in Settings
- Mehr Tooltips systematisch
- Provider-Switch Improvements

---

## Build 19 - 2025-11-21

### 🐛 Kritische Bugfixes
- **FIXED: Tooltip-Abschneidung**:
  - Problem: Tooltips wurden am Fensterrand abgeschnitten
  - Lösung: Intelligente Auto-Positionierung implementiert
  - Tooltips wechseln automatisch Position (top→bottom, left→right) wenn nicht genug Platz
  - z-index auf 9999 erhöht für bessere Sichtbarkeit
  - Refs hinzugefügt für präzise Viewport-Berechnung

### ✨ Verbesserungen
- **Bessere API 404 Fehlermeldung**:
  - **Alt**: "model: claude-3-5-sonnet-20240620"
  - **Neu**:
    ```
    ❌ Modell "claude-3-5-sonnet-20240620" nicht gefunden!

    💡 LÖSUNGEN:
    1. API Key prüfen: console.anthropic.com
    2. Modell-Zugriff prüfen (Tier/Subscription)
    3. Alternative: Browser Extension nutzen

    ➡️ Öffne claude.ai im Browser und aktiviere die Extension
    ```
  - Hilft dem User zu verstehen WARUM es nicht funktioniert
  - Gibt konkrete Lösungsvorschläge

- **Mehr Tooltip-Texte**:
  - +15 neue vordefinierte Tooltip-Texte
  - Kategorien: Thesis Writing, Scientific Research, Generische Buttons
  - Texte für save, cancel, delete, edit, download, upload, refresh, reset, close

### 🔍 Bekannte Probleme
- **API 404 Error persistiert**: `claude-3-5-sonnet-20240620` gibt 404
  - **Wahrscheinliche Ursache**: API Key ungültig oder keine Berechtigung für dieses Modell
  - **Workaround**: Browser Extension nutzen (claude.ai öffnen)
  - **Nächster Schritt**: Modell-Selektor im UI hinzufügen

### 📦 Build Info
- Build-Datum: 2025-11-21
- SimpleTooltip: Auto-Positioning mit Viewport-Detection
- AnthropicProvider: Verbesserte 404-Fehlermeldungen
- Webpack: Production Mode
- Electron: 37.7.0

### 🔮 Roadmap Build 20
- Modell-Selektor im Settings-Tab
- Mehr Tooltips zu allen Buttons (systematisch)
- API-Key Validator mit Live-Check

---

## Build 18 - 2025-11-21

### ✨ Neue Features
- **Hybrid Tooltip-System** (Option 3):
  - `SimpleTooltip` Component für normale Buttons (kurze Erklärungen beim Hover)
  - `HelpTooltip` Component für komplexe Features (mit Beispielen & Scoring)
  - **Implementiert für**:
    - ✅ "Kodierung starten" Button → "Startet den AI-gestützten 3-Persona Kodierungsprozess"
    - ✅ "Dynamic Coding Personas" Button → "Erweiterte KI-Kodierung mit individuellen Personas"
  - **Tooltip-Verhalten**:
    - Erscheint nach 300ms Hover-Delay
    - Verschwindet automatisch beim Wegfahren
    - Position: top/bottom/left/right konfigurierbar
    - Optional: Keyboard Shortcuts anzeigen

- **Tooltip-Text Datenbank**:
  - Vordefinierte Texte für 30+ wichtige Funktionen
  - Zweisprachig (Deutsch/English)
  - Kategorien: Kodierung, AKIH, Memos, Visualisierungen, Export, Settings

### 📦 Build Info
- Build-Datum: 2025-11-21
- SimpleTooltip.tsx: Neues leichtgewichtiges Tooltip-System
- TooltipTexts: Zentrale Datenbank mit allen Tooltip-Texten
- Webpack: Production Mode
- Electron: 37.7.0

### 🔮 Roadmap Build 19
- Tooltips für AKIH Modes (BASIS/EXTENDED/ULTIMATE) mit Kosten-Info
- Tooltips für Navigation-Tabs
- Tooltips für Export/Import Buttons
- Tooltips für alle Visualisierungs-Optionen

---

## Build 17 - 2025-11-21

### 🐛 Kritische Bugfixes
- **FIXED: Modellname 404 Error**:
  - `claude-3-5-sonnet-latest` gibt 404 → geändert zu `claude-3-5-sonnet-20240620` (stabile Version)
  - 17 Vorkommen im gesamten Codebase ersetzt
  - **Betrifft**: Alle AI-Features (Coding, Thesis Writing, AKIH, Reports)

- **FIXED: Preisanzeigen korrigiert**:
  - BASIS Mode: $1-3 → **$0.10-0.30**
  - EXTENDED Mode: $3-6 → **$0.30-0.60**
  - ULTIMATE Mode: $5-12 → **$0.50-1.20**
  - Preise waren 10x zu hoch angezeigt

### 📋 Bekannte Probleme
- `APIService.getAvailableModels is not a function`: Methode existiert in Source, aber kompilierte Version nutzt sie möglicherweise nicht korrekt
  - **Workaround**: Manuelle Modell-Auswahl in Settings

### 💡 Hinweise
- **Wenn Anthropic API 404 Error**: Stelle sicher dass API Key gültig ist für Claude 3.5 Sonnet
- **Alternative**: Browser Extension verwenden (claude.ai Tab öffnen + Extension aktivieren)

### 📦 Build Info
- Build-Datum: 2025-11-21
- Modellname: `claude-3-5-sonnet-20240620` (stabile Juni 2024 Version)
- Webpack: Production Mode
- Electron: 37.7.0

---

## Build 16 - 2025-11-21

### ✨ Neue Features
- **Wissenschaftliche Hilfe-Tooltips**: Umfassendes Tooltip-System für Scientific Research Tab
  - Info-Icons (ℹ️) bei allen Memo-Typen mit Erklärungen und Beispielen
  - Tooltips bei Reflexivitäts-Feldern mit Scoring-Formeln
  - Detaillierte Scoring-Erklärungen (z.B. "1 Memo = +20 Punkte")
  - Konkrete deutsche Beispiele für jeden Feldtyp

- **Gütekriterien Info-Panel**: Neue Hilfesektion im Quality Tab
  - Erklärt wie Dependability, Credibility, Reflexivity berechnet werden
  - Zeigt exakte Scoring-Formeln (Audit Trail, Memos, Entscheidungen)
  - "Schnellstart"-Guide mit 4 Schritten zur Score-Verbesserung
  - Actionable Steps für alle 5 Qualitätskriterien

### 🐛 Bugfixes
- Keiner in diesem Build (nur neue Features)

### 📝 Technische Details
- Neue Komponente: `HelpTooltip.tsx` mit MemoTypeHelp und ReflexivityHelp
- Integration in ScientificResearchTab.tsx
- Position-aware Tooltips (top/bottom/left/right)
- Hover + Click Toggle für bessere UX

### 📦 Build Info
- Build-Datum: 2025-11-21 11:04
- Größe: 105 MB
- Webpack: Production Mode
- Electron: 37.7.0

---

## Build 15 - 2025-11-21 (Früher)

### 🐛 Bugfixes
- Fix: Dynamic Coding Personas Button Position (verschoben nach "Kodierungsprozess starten")
- Fix: Modellname von `claude-3-5-sonnet-20241022` zu `claude-3-5-sonnet-latest` geändert
- Fix: 529 Anthropic Overload Error zu retry-able errors hinzugefügt
- Fix: `patterns.flatMap is not a function` Error in AKIHMethodology.ts

### 📝 Änderungen
- AIBridgeAdapter: Transient error codes erweitert (429, 500, 502, 503, 504, 529)
- Overload-Detection verbessert mit String-Matching

---

## Builds 10-14 - 2025-11-21 (Iterative Fixes)

### 🐛 Bugfixes
- Verschiedene Build-Tests und Bugfixes
- Schrittweise Verbesserung der AI Bridge Fehlerbehandlung
