# Visualisierungen Integration Guide

Alle Visualisierungskomponenten wurden erfolgreich erstellt! Hier ist die Anleitung zur Integration in die App.tsx.

## ✅ Bereits erledigt:

1. ✅ Dependencies installiert (recharts, d3, framer-motion, html2canvas, jspdf)
2. ✅ BaseChart Komponente erstellt
3. ✅ DataQualityDashboard Komponente erstellt
4. ✅ CodingDashboard Komponente erstellt
5. ✅ PatternNetwork Komponente erstellt
6. ✅ Export-Utilities erstellt (PNG, SVG, PDF)
7. ✅ Import in App.tsx hinzugefügt

## 📍 Integration in App.tsx

### 1. Analysis Tab (Zeile ~16550)

Füge **vor dem schließenden `</div>`** des Analysis Tabs folgendes hinzu:

```tsx
{/* Data Quality Visualizations */}
<div className="mt-8">
  <h3 className="text-2xl font-bold mb-6 flex items-center">
    <BarChart3 className="w-7 h-7 mr-2 text-green-400" />
    {language === 'de' ? 'Datenqualität Visualisierung' : 'Data Quality Visualization'}
  </h3>
  <DataQualityDashboard
    documents={project.documents || []}
    categories={project.categories || []}
    codings={project.codings || []}
  />
</div>
```

**Wo genau:** Suche nach dem letzten Element im Analysis Tab (z.B. nach den "Recommendations") und füge es vor dem schließenden `</div>` des `tab-content` ein.

### 2. Coding Tab (Zeile ~14046)

Ändere die Struktur des Coding Tabs zu einem 2-Spalten-Layout:

```tsx
{activeTab === 'coding' && (
  <div className="tab-content h-full flex flex-col">
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
      {language === 'de' ? '3-Persona Kodierung' : '3-Persona Coding'}
    </h2>

    {/* 2-Spalten Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
      {/* Linke Seite: Bestehende Coding-Interface (2 Spalten) */}
      <div className="lg:col-span-2 space-y-6 overflow-y-auto">
        {/* ... Alle bestehenden Coding-Elemente hier ... */}
      </div>

      {/* Rechte Seite: Dashboard (1 Spalte) */}
      <div className="lg:col-span-1 overflow-y-auto">
        <div className="sticky top-0 space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Activity className="w-6 h-6 mr-2 text-cyan-400" />
            {language === 'de' ? 'Live Dashboard' : 'Live Dashboard'}
          </h3>
          <CodingDashboard
            totalSegments={project.documents.reduce((sum, d) => sum + (d.segments?.length || 0), 0)}
            codedSegments={project.codings?.length || 0}
            categories={project.categories || []}
            codings={project.codings || []}
            personaAgreement={{}}
            recentCodings={(project.codings || []).slice(-20)}
          />
        </div>
      </div>
    </div>
  </div>
)}
```

### 3. Patterns Tab (Zeile ~14682)

Füge nach der Patterns-Tab-Überschrift hinzu:

```tsx
{activeTab === 'patterns' && (
  <div className="tab-content space-y-6 h-full flex flex-col">
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
      {language === 'de' ? 'Mustererkennung' : 'Pattern Recognition'}
    </h2>

    {/* Pattern Network Visualization */}
    <PatternNetwork
      patterns={project.patterns?.map(p => p.name || p.pattern) || []}
      cooccurrences={
        (() => {
          const cooc: {[key: string]: number} = {};
          const patterns = project.patterns || [];
          patterns.forEach((p1, i) => {
            patterns.slice(i + 1).forEach(p2 => {
              const key = `${p1.name}-${p2.name}`;
              cooc[key] = Math.random() * 10; // Ersetze mit echten Daten
            });
          });
          return cooc;
        })()
      }
    />

    {/* ... Restliche Pattern Tab Elemente ... */}
  </div>
)}
```

## 🎨 Styling-Hinweise

Die Komponenten verwenden bereits:
- Tailwind CSS Klassen (konsistent mit deiner App)
- Dark Theme (bg-gray-900/40, etc.)
- Hover-Effekte und Transitions
- Responsive Design (md:grid-cols-2, etc.)

## 🚀 Features

### DataQualityDashboard
- KPI Cards (Documents, Words, Categories, Codings)
- Document Type Distribution (Pie Chart)
- Word Count Distribution (Bar Chart)
- Research Quality Metrics (Horizontal Bar Chart)
- Overall Quality Score (0-10 Scale)

### CodingDashboard
- Progress Bar mit Prozentanzeige
- Consistency Metrics (3 Cards)
- Category Distribution (Bar Chart)
- Consistency Trend (Line Chart)
- Quality Warnings
- Quick Stats

### PatternNetwork
- D3 Force-Directed Graph
- Interaktive Nodes (Drag & Drop)
- Zoom & Pan
- Node Size = Frequency
- Node Color = Significance
- Line Thickness = Co-occurrence Strength

## 📤 Export-Funktionalität

Alle Charts haben Export-Buttons (PNG, SVG, PDF) unten rechts.

Für Gesamtreports:

```tsx
import { exportAllChartsAsReport } from '../utils/chartExport';

// Export all charts
await exportAllChartsAsReport(
  [
    'chart-document-type-distribution',
    'chart-word-count-distribution',
    'chart-research-quality-metrics'
  ],
  'data-quality-report.pdf'
);
```

## 🔧 Customization

### Farben ändern

In BaseChart.tsx oder den individuellen Komponenten:

```tsx
const COLORS = ['#3B82F6', '#A855F7', '#10B981', '#F97316', '#EF4444', '#F59E0B'];
```

### Chart-Höhe anpassen

```tsx
<BaseChart height={400}> {/* Standard: 300 */}
```

### Export deaktivieren

```tsx
<BaseChart exportable={false}>
```

## 📊 Datenstruktur

### Für DataQualityDashboard:

```typescript
documents: Array<{
  id: string;
  title: string;
  content: string;
  type?: string; // 'technical', 'qualitative', 'case', 'literature'
  wordCount?: number;
}>

categories: Array<{
  id: string;
  name: string;
  description: string;
}>

codings: Array<{
  id: string;
  segmentId: string;
  categoryId: string;
  category: string;
}>
```

### Für CodingDashboard:

```typescript
totalSegments: number;
codedSegments: number;
categories: Category[];
codings: Coding[];
personaAgreement?: {[codingId: string]: number}; // 0-1 Score
recentCodings?: Coding[];
```

### Für PatternNetwork:

```typescript
patterns: string[]; // Array of pattern names
cooccurrences: {
  'pattern1-pattern2': number, // Strength/Frequency
  'pattern2-pattern3': number,
  // ...
};
```

## 🐛 Troubleshooting

### Recharts nicht gefunden
```bash
npm install recharts
```

### D3 Types fehlen
```bash
npm install --save-dev @types/d3
```

### Charts werden nicht angezeigt
- Prüfe ob `data` nicht leer ist
- Prüfe Browser-Console für Fehler
- Stelle sicher, dass Parent-Container eine Höhe hat

### Export funktioniert nicht
- Prüfe ob html2canvas und jspdf installiert sind
- Stelle sicher, dass Chart eine eindeutige ID hat

## 📝 Nächste Schritte

1. ✅ Integration in App.tsx (siehe oben)
2. ⏳ Echte Co-occurrence-Daten für PatternNetwork berechnen
3. ⏳ Persona Agreement Tracking implementieren
4. ⏳ Weitere Charts hinzufügen (z.B. Sankey für Coding-Flow)
5. ⏳ Dark/Light Mode Toggle (optional)

## 🎯 Quick Win Vorschläge

### Mini-Dashboard für Sidebar

```tsx
// In der Sidebar
<div className="p-3 bg-gray-900/60 rounded-lg">
  <p className="text-xs text-gray-400 mb-1">Quality Score</p>
  <div className="flex items-baseline gap-2">
    <span className="text-2xl font-bold text-green-400">
      {calculateQualityScore().toFixed(1)}
    </span>
    <span className="text-xs text-gray-400">/10</span>
  </div>
</div>
```

### Real-time Progress während Coding

```tsx
// Update nach jedem Coding
useEffect(() => {
  const progress = (codedSegments / totalSegments) * 100;
  // Zeige Toast bei Meilensteinen
  if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
    showToast(`${progress}% Complete! 🎉`);
  }
}, [codedSegments]);
```

## 💡 Best Practices

1. **Performance**: Für große Datasets (>1000 items), nutze Pagination oder Virtualization
2. **Accessibility**: Alle Charts haben Tooltips und ARIA-Labels
3. **Mobile**: Charts sind responsive, aber optimal auf Desktop (>1024px)
4. **Export**: Nutze PNG für Präsentationen, SVG für Papers, PDF für Reports

---

Bei Fragen oder Problemen, siehe die Beispiele in den Komponenten-Dateien!
