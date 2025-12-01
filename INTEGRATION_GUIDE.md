# Integration Guide - Neue Components (Build 20)

## Neue Components

### 1. ModelSelector
**Datei**: `src/renderer/components/ModelSelector.tsx`

**Features:**
- Live-Test aller Modelle mit aktuellem API Key
- Zeigt verfügbare vs. nicht-verfügbare Modelle
- Empfehlungs-Badge für beste Modelle
- Preis-Anzeige pro Modell
- "Alle testen" Button mit Rate-Limit Protection

**Integration in Settings:**
```tsx
import { ModelSelector } from './components/ModelSelector';

// In Settings Tab:
<ModelSelector
  provider={apiProvider}  // 'anthropic' oder 'openai'
  apiKey={apiKey}
  currentModel={apiModel}
  onModelChange={(model) => setApiModel(model)}
  language={language}
/>
```

---

### 2. APIKeyValidator
**Datei**: `src/renderer/components/APIKeyValidator.tsx`

**Features:**
- Testet ob API Key gültig ist
- Zeigt verfügbare Modelle für den Key
- Format-Validierung (sk-ant-, sk-)
- Detaillierte Fehlermeldungen
- Tier-Detection

**Integration in Settings:**
```tsx
import { APIKeyValidator } from './components/APIKeyValidator';

// In Settings Tab, unter API Key Input:
<APIKeyValidator
  provider={apiProvider}
  apiKey={apiKey}
  language={language}
/>
```

---

### 3. SimpleTooltip Erweiterungen
**Datei**: `src/renderer/components/SimpleTooltip.tsx`

**Neue Features in Build 20:**
- Auto-Positioning (verhindert Abschneidung)
- z-index 9999 für bessere Sichtbarkeit
- 50+ vordefinierte Tooltip-Texte
- `WithTooltip` Wrapper für <div> Elemente

**Verwendung:**
```tsx
import { SimpleTooltip, WithTooltip, TooltipTexts } from './components/SimpleTooltip';

// Für Buttons:
<SimpleTooltip content={TooltipTexts.de.save} position="top">
  <button onClick={handleSave}>Speichern</button>
</SimpleTooltip>

// Für <div> mit onClick:
<WithTooltip content="Beschreibung" position="top">
  <div onClick={handleClick}>Click me</div>
</WithTooltip>
```

---

## Empfohlene Integration (Build 21)

### Settings Tab erweitern

**Vorher:**
```tsx
<input
  type="password"
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
  placeholder="sk-ant-..."
/>
```

**Nachher:**
```tsx
<div className="space-y-4">
  <input
    type="password"
    value={apiKey}
    onChange={(e) => setApiKey(e.target.value)}
    placeholder="sk-ant-..."
  />

  {/* NEU: API Key Validator */}
  <APIKeyValidator
    provider={apiProvider}
    apiKey={apiKey}
    language={language}
  />

  {/* NEU: Modell-Selektor */}
  {apiKey && (
    <ModelSelector
      provider={apiProvider}
      apiKey={apiKey}
      currentModel={apiModel}
      onModelChange={(model) => setApiModel(model)}
      language={language}
    />
  )}
</div>
```

---

## Tooltip-Texte Datenbank

**Verfügbare Kategorien:**
- Kodierung (startCoding, dynamicCoding, stopCoding, exportCodings)
- AKIH/Thesis (generateBasis, generateExtended, generateUltimate)
- Memos & Reflexivity (addMemo, addReflexivity)
- Visualisierungen (showDashboard, showCodingProgress, showQualityCriteria)
- Export/Import (exportProject, importProject, exportReport)
- Settings (refreshModels, testApiKey, toggleExtension)
- Documents (uploadDocuments, deleteDocument)
- Categories (addCategory, deleteCategory, mergeCategories)
- Navigation (navDashboard, navDocuments, navCoding, etc.)
- Generische Buttons (save, cancel, delete, edit, download, upload, refresh, reset, close)

**Verwendung:**
```tsx
import { TooltipTexts } from './components/SimpleTooltip';

const tooltip = language === 'de'
  ? TooltipTexts.de.startCoding
  : TooltipTexts.en.startCoding;
```

---

## Testing Checkliste

### ModelSelector:
- [ ] "Alle testen" Button funktioniert
- [ ] Grünes Häkchen erscheint bei verfügbaren Modellen
- [ ] Rotes X erscheint bei nicht-verfügbaren Modellen
- [ ] Modell-Auswahl wird gespeichert
- [ ] Empfehlungs-Badge wird angezeigt

### APIKeyValidator:
- [ ] Format-Validierung funktioniert
- [ ] "API Key testen" Button funktioniert
- [ ] Verfügbare Modelle werden angezeigt
- [ ] Fehlermeldungen sind verständlich
- [ ] Ohne API Key wird Warnung angezeigt

### SimpleTooltip:
- [ ] Tooltips erscheinen beim Hover (300ms delay)
- [ ] Tooltips verschwinden beim Wegfahren
- [ ] Auto-Positioning funktioniert (kein Abschneiden am Rand)
- [ ] z-index ist hoch genug (über anderen Elementen)

---

## Performance-Hinweise

### ModelSelector:
- Verwendet Rate-Limiting (500ms zwischen Tests)
- Maximal 4-5 API Calls beim "Alle testen"
- Kosten: ~$0.01 pro kompletten Test

### APIKeyValidator:
- Einzelner Mini-API-Call (~10 tokens)
- Optional: Testet alle Modelle (Rate-Limited)
- Kosten: ~$0.001 pro Test

### SimpleTooltip:
- Leichtgewichtig (kein Performance-Impact)
- useEffect Cleanup verhindert Memory Leaks
- Auto-Positioning nur bei Sichtbarkeit

---

## Nächste Schritte (Build 21+)

1. **Integration in Settings Tab**
   - ModelSelector unter API Key Section
   - APIKeyValidator als "Test" Button

2. **Mehr Tooltips hinzufügen**
   - Systematisch alle Buttons durchgehen
   - AKIH Mode Buttons
   - Export/Import Buttons
   - Navigation Tabs

3. **Provider-Switch Improvements**
   - Auto-Modell-Wechsel beim Provider-Wechsel
   - Speichern des letzten funktionierenden Modells pro Provider

4. **Error Handling**
   - Wenn Modell nicht verfügbar → Auto-Fallback zum nächsten
   - User-Benachrichtigung bei Fallback
