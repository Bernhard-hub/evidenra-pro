# EVIDENRA Professional v2.0

> AKI Method Research Tool - Improved & Secured Edition

EVIDENRA Professional ist eine Desktop-Anwendung für wissenschaftliche Forschungsanalyse basierend auf der **AKIH-Methodik** (Artificial Knowledge Intelligence Height).

## 🆕 Was ist neu in v2?

Diese Version enthält wichtige **Sicherheits-** und **Code-Qualität-Verbesserungen**:

- 🔒 **Verbesserte Sicherheit** (Web Security aktiviert, Sandbox-Modus)
- 🛠️ **Code-Qualitäts-Tools** (ESLint, Prettier, TypeScript)
- 🧹 **Saubere Code-Struktur** (Backup-Dateien archiviert)
- 📦 **Aktualisierte Dependencies**
- 📝 **Dokumentation & Best Practices**

👉 Siehe [CHANGELOG-V2.md](./CHANGELOG-V2.md) für Details

---

## 🚀 Schnellstart

### Voraussetzungen
- Node.js >= 16
- npm >= 8

### Installation

```bash
cd evidenra-professional-v2
npm install
```

### Entwicklung

```bash
# Webpack Dev Server starten
npm run dev

# Electron im Development-Modus starten
npm run electron-dev
```

### Production Build

```bash
# Production Build erstellen
npm run build-prod

# Distributable erstellen
npm run dist
```

---

## 📋 Verfügbare Scripts

| Script | Beschreibung |
|--------|--------------|
| `npm start` | Startet Electron mit aktuellem Build |
| `npm run dev` | Startet Webpack Dev Server (Port 8080) |
| `npm run build` | Development Build |
| `npm run build-prod` | Production Build (optimiert) |
| `npm run electron-dev` | Electron im Development-Modus |
| `npm run lint` | Code-Qualität prüfen |
| `npm run lint:fix` | Automatische Fehlerkorrektur |
| `npm run format` | Code formatieren |
| `npm run format:check` | Format-Prüfung |
| `npm run type-check` | TypeScript Type-Check |
| `npm run pack` | Electron-Builder (ohne Distribution) |
| `npm run dist` | Vollständige Distribution erstellen |

---

## 🏗️ Technologie-Stack

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript 5.9.2** - Type Safety
- **Tailwind CSS 3.4.17** - Styling
- **Tabler Icons** - Icon Library

### Desktop
- **Electron 37.4.0** - Desktop Framework
- **Electron Builder** - Packaging

### Build Tools
- **Webpack 5** - Module Bundler
- **Babel 7** - JavaScript Transpiler
- **PostCSS** - CSS Processing

### AI/ML
- **TensorFlow.js 4.22.0** - Machine Learning
- **ml-matrix** - Matrix Operations
- **ml-pca** - Principal Component Analysis
- **density-clustering** - Clustering Algorithms

### Dokumente
- **jsPDF 2.5.2** - PDF Generation
- **PDF.js 5.4.149** - PDF Parsing

### Code Quality
- **ESLint** - Linting
- **Prettier** - Code Formatting
- **TypeScript** - Type Checking

---

## 📁 Projektstruktur

```
evidenra-professional-v2/
├── src/
│   ├── main/                    # Electron Main Process
│   │   ├── main.js             # App Entry Point
│   │   └── licenseValidator.js # License Management
│   ├── renderer/                # React Frontend
│   │   ├── App.tsx             # Main App Component
│   │   ├── components/         # React Components
│   │   ├── services/           # Business Logic
│   │   └── utils/              # Utilities
│   ├── services/                # Core Services
│   │   ├── APIService.ts       # Multi-Provider API
│   │   ├── QuantumCodingEngine.ts
│   │   └── ...
│   ├── preload/                 # Preload Scripts
│   └── types/                   # TypeScript Types
├── browser-extensions/          # Chrome & Firefox Extensions
├── public/                      # Static Assets
├── assets/                      # Application Assets
├── .backup-archive/             # Archived Backup Files
├── dist/                        # Build Output
├── release/                     # Distribution Output
├── .eslintrc.json              # ESLint Config
├── .prettierrc.json            # Prettier Config
├── .gitignore                  # Git Ignore
├── package.json                # Dependencies & Scripts
├── tsconfig.json               # TypeScript Config
├── webpack.config.js           # Webpack Config
└── tailwind.config.js          # Tailwind Config
```

---

## 🔧 Konfiguration

### TypeScript

Die TypeScript-Konfiguration befindet sich in `tsconfig.json`.

**Hinweis**: Aktuell ist `strict: false` gesetzt. Für bessere Type-Safety wird empfohlen, dies schrittweise auf `true` zu setzen.

### ESLint

ESLint ist konfiguriert für:
- TypeScript
- React & React Hooks
- Best Practices

Konfiguration: `.eslintrc.json`

### Prettier

Prettier ist konfiguriert mit:
- Single Quotes
- Semicolons
- 100 Zeichen Line Width
- 2 Spaces Indentation

Konfiguration: `.prettierrc.json`

---

## ⚠️ Wichtige Hinweise

### API-Aufrufe & CORS

Mit aktivierter Web Security (`webSecurity: true`) müssen externe API-Endpunkte **CORS-Header** setzen:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

Falls API-Calls fehlschlagen, überprüfen Sie die CORS-Konfiguration Ihrer Endpunkte.

### DevTools

In Production öffnen sich die DevTools **nicht automatisch**.

Für Debugging in Production:
1. Kommentieren Sie Zeile 65 in `src/main/main.js` aus
2. Oder verwenden Sie `Ctrl+Shift+I` in der App

---

## 🧪 Testing (Geplant für Phase 2)

Aktuell sind **keine Tests** vorhanden. Geplant:

### Phase 2
- Vitest/Jest Setup
- Unit Tests für Services
- React Testing Library für Components
- Mindestens 60% Code Coverage

### Phase 4
- E2E Tests mit Playwright/Cypress
- Integration Tests

---

## 🎯 Roadmap

### Phase 1 ✅ (Abgeschlossen)
- [x] Sicherheits-Verbesserungen
- [x] ESLint & Prettier
- [x] .gitignore & Git
- [x] Backup-Cleanup
- [x] Dependencies Update

### Phase 2 (2-3 Wochen)
- [ ] TypeScript strict mode
- [ ] Test-Framework Setup
- [ ] Unit Tests (60-80% Coverage)
- [ ] Type-Error Fixes

### Phase 3 (3-4 Wochen)
- [ ] App.tsx Refactoring
- [ ] Code Splitting
- [ ] State Management (Context/Zustand)
- [ ] Error Boundaries

### Phase 4 (2-3 Wochen)
- [ ] Bundle Size Optimization
- [ ] Performance Optimizations
- [ ] E2E Tests
- [ ] CI/CD Pipeline

---

## 🤝 Entwicklung

### Code-Qualität sicherstellen

Vor jedem Commit:

```bash
npm run lint:fix     # Lint-Fehler beheben
npm run format       # Code formatieren
npm run type-check   # TypeScript prüfen
```

### Git Workflow

```bash
# Git initialisieren (falls noch nicht geschehen)
git init
git add .
git commit -m "Initial commit - EVIDENRA Professional v2"

# Branch für Feature erstellen
git checkout -b feature/your-feature-name
```

---

## 📄 Lizenz

ISC

---

## 🔗 Links

- [CHANGELOG-V2.md](./CHANGELOG-V2.md) - Vollständige Änderungen
- Original: `../evidenra-professional` (Basis-Version)

---

**Version**: 2.0.0
**Erstellt**: 2025-10-20
**Basierend auf**: EVIDENRA Professional 1.0.0
