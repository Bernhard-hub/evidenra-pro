# 🚀 AKIH Quick-Start Guide

## Willkommen bei EVIDENRA Professional mit AKIH-Methodik!

Diese Anleitung zeigt dir, wie du die neuen AKIH-Features in der App nutzt.

---

## 📍 Wo finde ich die AKIH-Features?

### 1. **AKIH Score Dashboard**
**Location:** Tab "Analyse Dashboard" (Analysis)

**Was kannst du hier machen:**
- ✅ Gesamtscore sehen (0-100)
- ✅ 8 Detail-Metriken visualisiert
- ✅ Qualitätsstufe ablesen (Exzellent/Gut/Akzeptabel/Unzureichend)
- ✅ Verbesserungsvorschläge erhalten
- ✅ Trend sehen (Vergleich zu früherem Score)

**So verwendest du es:**
1. Öffne den Tab "Analyse Dashboard"
2. Scrolle nach oben
3. Das AKIH Dashboard wird automatisch angezeigt
4. Klicke auf die Detail-Metriken für mehr Infos

---

### 2. **Kodierungs-Validierung**
**Location:** Tab "Kodierungen" → Bei jeder Kodierung

**Was kannst du hier machen:**
- ✅ Kodierungen mit einem Klick validieren
- ✅ Validierungs-Status sehen (grüner Haken = validiert)
- ✅ Konfidenz-Prozentsatz sehen
- ✅ Verbesserungsvorschläge bei niedriger Konfidenz erhalten

**So verwendest du es:**
1. Gehe zum Tab "Kodierungen"
2. Fahre mit der Maus über eine Kodierung
3. Klicke auf den **blauen Validierungs-Button** (CheckCircle-Icon)
4. Die Kodierung wird validiert und der Button wird **grün**
5. Hover über den grünen Button zeigt Konfidenz-% an

**Vorher:**
```
❌ Nur Löschen-Button verfügbar
```

**Nachher:**
```
✅ Validierungs-Button (blau) + Löschen-Button (rot)
🟢 Validiert = Grüner Button (immer sichtbar)
🔵 Nicht validiert = Blauer Button (bei Hover)
```

---

### 3. **Enhanced Report Generation**

#### Option A: Ultimate Report (AKIH-Enhanced)

**Neue Features:**
- ✅ **6,1x mehr Tokens** (8.192 → 50.000)
- ✅ **ALLE Dokumente** verwenden (nicht nur Top 8!)
- ✅ **Meta-Prompts** für bessere Qualität
- ✅ **AKIH-Score** im Bericht

**Code-Beispiel (für Entwickler):**
```typescript
import { UltimateReportService_AKIH } from './services/UltimateReportService_AKIH';

const result = await UltimateReportService_AKIH.generateReport(
  project,
  apiSettings,
  {
    language: 'de',
    mode: 'ULTIMATE',
    includeAKIHScore: true,
    targetWordCount: 8000,
    useMetaPrompts: true,      // ⭐ 2-Stufen-Generierung
    useAllDocuments: true       // ⭐ ALLE Daten!
  }
);
```

#### Option B: Scientific Article (AKIH-Enhanced)

**Zwei Modi:**
1. **AI-Powered** (langsam, kostet API-Credits, höchste Qualität)
2. **Template-Based** (schnell, kostenlos, datengetrieben)

**Code-Beispiel:**
```typescript
import { ScientificArticleService_AKIH } from './services/ScientificArticleService_AKIH';

// Template-Based (schnell & kostenlos)
const result = await ScientificArticleService_AKIH.generateArticle(
  project,
  apiSettings,
  {
    language: 'de',
    mode: 'ENHANCED',
    includeAKIHReport: true,
    targetWordCount: 3000,
    useAIGeneration: false,     // ⭐ Template = kostenlos!
    includeMethodology: true,
    includeVisualizations: false
  }
);

console.log(`Cost: ${result.cost}`); // 0 (kostenlos!)
```

---

## 🎯 Typischer Workflow mit AKIH

### Schritt 1: Projekt aufsetzen
1. Erstelle neues Projekt
2. Lade Dokumente hoch
3. Definiere Kategorien

### Schritt 2: Kodierung durchführen
1. Gehe zu "Kodierungen"
2. Erstelle Kodierungen (manuell oder AI-assisted)
3. **NEU:** Validiere wichtige Kodierungen mit dem Validierungs-Button

### Schritt 3: AKIH Score überprüfen
1. Gehe zu "Analyse Dashboard"
2. Schaue dir den AKIH Score an
3. Lies die Verbesserungsvorschläge
4. Verbessere dein Projekt basierend auf Suggestions

### Schritt 4: Qualität verbessern
**Wenn Score < 70:**
- Mehr Kodierungen validieren
- Mehr Dokumente analysieren
- Reflexivitäts-Statements hinzufügen

**Ziel: Score ≥ 85 (Exzellent)**

### Schritt 5: Report generieren
1. Gehe zu "Berichte"
2. Wähle "Ultimate Report" oder "Scientific Article"
3. **Aktiviere "Use AKIH-Enhanced Services"** (wenn verfügbar)
4. Generiere Report
5. AKIH-Score wird automatisch im Bericht enthalten sein

---

## 📊 AKIH Score verstehen

### Komponenten (8 Metriken)

#### 1. **Precision** (Genauigkeit)
- **Was:** Validierte Kodierungen / Gesamt
- **Gut:** ≥ 80%
- **Verbesserung:** Mehr Kodierungen validieren

#### 2. **Recall** (Vollständigkeit)
- **Was:** Kodierte Segmente / Potentiell relevante Segmente
- **Gut:** ≥ 70%
- **Verbesserung:** Mehr Kodierungen hinzufügen

#### 3. **Consistency** (Konsistenz)
- **Was:** Inter-Rater-Reliabilität (Cohen's Kappa adaptiert)
- **Gut:** ≥ 70%
- **Verbesserung:** Konsistente Kodierung sicherstellen

#### 4. **Saturation** (Theoretische Sättigung)
- **Was:** 1 - (Neue Codes in letzten 20% / Gesamt)
- **Gut:** ≥ 60%
- **Verbesserung:** Mehr Dokumente analysieren

#### 5. **Coverage** (Abdeckung)
- **Was:** Analysierte Dokumente / Gesamt
- **Gut:** ≥ 80%
- **Verbesserung:** Mehr Dokumente kodieren

#### 6. **Integration** (Vernetzung)
- **Was:** Verbundene Entitäten / Gesamt
- **Gut:** ≥ 60%
- **Verbesserung:** Musteranalysen durchführen

#### 7. **Traceability** (Nachvollziehbarkeit)
- **Was:** Dokumentierte Kodierungen & Kategorien / Gesamt
- **Gut:** ≥ 70%
- **Verbesserung:** Beschreibungen hinzufügen

#### 8. **Reflexivity** (Reflexivität)
- **Was:** Reflexivitäts-Statements / Erwartete
- **Gut:** ≥ 50%
- **Verbesserung:** Forscher-Positionierung dokumentieren

---

## 🏅 Qualitätsstufen

| Score | Stufe | Bedeutung | Symbol |
|-------|-------|-----------|--------|
| **85-100** | ⭐ **Exzellent** | Publikationsreif, höchste wissenschaftliche Standards | 🟢 |
| **70-84** | ✅ **Gut** | Solide wissenschaftliche Standards, kleine Verbesserungen möglich | 🔵 |
| **55-69** | ⚠️ **Akzeptabel** | Grundlegende Standards erfüllt, Verbesserungen empfohlen | 🟡 |
| **0-54** | ❌ **Unzureichend** | Minimale Standards nicht erfüllt, dringend überarbeiten | 🔴 |

---

## 💡 Tipps für hohen AKIH Score

### Schnelle Wins:
1. **Kodierungen validieren** (+10-20 Punkte)
   - Gehe zu "Kodierungen"
   - Validiere 50%+ deiner Kodierungen
   - Instant Precision-Boost!

2. **Alle Dokumente analysieren** (+15-25 Punkte)
   - Coverage = 100%
   - Verwende alle hochgeladenen Dokumente

3. **Reflexivität dokumentieren** (+5-10 Punkte)
   - Gehe zu "Wissenschaft & Reflexivität"
   - Erstelle Reflexivitäts-Statement
   - Forscher-Positionierung zeigen

### Langfristige Verbesserungen:
4. **Kategorien-Beschreibungen hinzufügen**
   - Erhöht Traceability

5. **Musteranalysen durchführen**
   - Erhöht Integration

6. **Konsistente Kodierung**
   - Erhöht Consistency

---

## 🎓 AKIH vs. Traditionelle Software

| Feature | Atlas.ti | MAXQDA | **EVIDENRA (AKIH)** |
|---------|----------|--------|---------------------|
| **Mathematischer Quality-Score** | ❌ | ❌ | ✅ **8 Komponenten** |
| **AI-gestützte Kodierung** | ❌ | Basis | ✅ **Vollständig** |
| **Auto-Validierung** | ❌ | ❌ | ✅ **1-Klick** |
| **Report-Generierung (8000+ Wörter)** | ❌ | ❌ | ✅ **Automatisch** |
| **Theoretische Sättigungs-Erkennung** | Manuell | Manuell | ✅ **Automatisch** |
| **Alle Daten in Reports** | Begrenzt | Begrenzt | ✅ **100%** |
| **Meta-Prompts** | N/A | N/A | ✅ **2-Stufen** |
| **Anti-Hallucination** | N/A | N/A | ✅ **Protokoll** |

---

## 📝 Checkliste: Projekt mit AKIH optimieren

### Vor der Analyse:
- [ ] Alle relevanten Dokumente hochgeladen
- [ ] Kategorien-System definiert
- [ ] Forschungsfragen formuliert

### Während der Analyse:
- [ ] Mindestens 50% der Kodierungen validieren
- [ ] Alle Dokumente kodieren (Coverage ≥ 80%)
- [ ] Kategorienbeschreibungen hinzufügen
- [ ] Reflexivitäts-Statement erstellen

### Nach der Analyse:
- [ ] AKIH Score ≥ 70 erreichen
- [ ] Verbesserungsvorschläge umsetzen
- [ ] Report mit AKIH-Enhanced Services generieren
- [ ] AKIH-Methodologie-Bericht ins Dokument aufnehmen

### Vor Publikation:
- [ ] AKIH Score ≥ 85 (Exzellent) anstreben
- [ ] Alle Metriken ≥ 70%
- [ ] Vollständige Reflexivität dokumentiert
- [ ] Reports generiert und geprüft

---

## 🔧 Troubleshooting

### Problem: Score zu niedrig (< 55)
**Lösung:**
1. Schaue dir die Verbesserungsvorschläge an
2. Fokus auf die schwächsten Komponenten
3. Validiere mehr Kodierungen
4. Analysiere mehr Dokumente

### Problem: Precision niedrig (< 50%)
**Lösung:**
- Validiere Kodierungen mit dem Validierungs-Button
- Lösche ungenaue Kodierungen
- Überprüfe Kategorienzuordnungen

### Problem: Coverage niedrig (< 60%)
**Lösung:**
- Kodiere mehr Dokumente
- Verwende AI-Assisted Coding
- Stelle sicher, dass alle Dokumente relevant sind

### Problem: Saturation niedrig (< 40%)
**Lösung:**
- Analysiere mehr Dokumente
- Neue Kategorien nur wenn wirklich nötig
- Fokus auf Vertiefung statt Erweiterung

---

## 🚀 Nächste Schritte

1. **Teste das AKIH Dashboard**
   - Gehe zu "Analyse Dashboard"
   - Schaue dir deinen aktuellen Score an

2. **Validiere einige Kodierungen**
   - Gehe zu "Kodierungen"
   - Teste den neuen Validierungs-Button

3. **Verbessere deinen Score**
   - Folge den Verbesserungsvorschlägen
   - Ziel: Score ≥ 70

4. **Generiere einen Report**
   - Verwende die AKIH-Enhanced Services
   - Schaue dir den AKIH-Score im Bericht an

5. **Teile deine Ergebnisse**
   - AKIH-Score in Publikationen erwähnen
   - Methodologie-Bericht als Appendix

---

## 📚 Weitere Ressourcen

- **Vollständige Dokumentation:** `AKIH_TRANSFORMATION_SUMMARY.md`
- **Technische Details:** `AKIH_IMPLEMENTATION_COMPLETE.md`
- **Wissenschaftliche Grundlagen:** Siehe AKIH-Methodologie-Bericht im Dashboard

---

## ❓ FAQ

**Q: Kostet die AKIH-Funktionalität extra?**
A: Nein! AKIH-Score-Berechnung ist kostenlos. Nur AI-generierte Reports kosten API-Credits.

**Q: Muss ich alle Kodierungen validieren?**
A: Nein, aber mindestens 50% für guten Precision-Score. Fokus auf wichtige Kodierungen.

**Q: Kann ich AKIH für meine Publikation verwenden?**
A: Ja! AKIH ist wissenschaftlich fundiert und kann in Methodologie-Abschnitt zitiert werden.

**Q: Was bedeutet "Meta-Prompts"?**
A: 2-Stufen-Generierung: Erst Analyse & Planung, dann optimierte Content-Generierung.

**Q: Unterschied zwischen Template-Based und AI-Powered Reports?**
A:
- **Template**: Schnell, kostenlos, datengetrieben, strukturiert
- **AI-Powered**: Langsamer, kostet API-Credits, höchste Qualität, fließend geschrieben

---

**Viel Erfolg mit EVIDENRA Professional und der AKIH-Methodik!** 🎉

**Version:** AKIH v1.0.0
**Datum:** 2025-01-XX
