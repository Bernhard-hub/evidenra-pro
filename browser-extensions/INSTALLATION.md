# 🔌 EVIDENRA Claude Bridge - Installation Guide

## Übersicht

Die EVIDENRA Claude Bridge ermöglicht es Ihnen, Ihr Claude Pro/Max Abonnement direkt mit der EVIDENRA Professional App zu nutzen, ohne einen separaten API-Schlüssel zu benötigen.

## 📋 Voraussetzungen

- **Claude Pro/Max Abonnement** bei Anthropic
- **EVIDENRA Professional v3.0** installiert
- **Firefox** oder **Chrome** Browser

## 🚀 Installation

### Chrome Extension

1. **Developer Mode aktivieren:**
   - Öffnen Sie Chrome und gehen Sie zu `chrome://extensions/`
   - Aktivieren Sie "Entwicklermodus" (oben rechts)

2. **Extension laden:**
   - Klicken Sie "Entpackte Erweiterung laden"
   - Wählen Sie den Ordner: `browser-extensions/chrome/`
   - Die Extension wird installiert und aktiviert

3. **Permissions bestätigen:**
   - Bestätigen Sie die Berechtigung für `claude.ai`
   - Die Extension ist jetzt einsatzbereit

### Firefox Extension

1. **about:debugging öffnen:**
   - Öffnen Sie Firefox und gehen Sie zu `about:debugging`
   - Klicken Sie "Dieser Firefox"

2. **Temporäres Add-on laden:**
   - Klicken Sie "Temporäres Add-on laden..."
   - Wählen Sie die Datei: `browser-extensions/firefox/manifest.json`
   - Die Extension wird installiert und aktiviert

3. **Für permanente Installation:**
   - Signieren Sie die Extension über [addons.mozilla.org](https://addons.mozilla.org/developers/)
   - Oder nutzen Sie Firefox Developer Edition für unsigned Extensions

## 🔧 Einrichtung

### 1. Claude.ai öffnen

- Öffnen Sie [claude.ai](https://claude.ai) in Ihrem Browser
- Melden Sie sich mit Ihrem Claude Pro/Max Account an
- Die Extension erkennt automatisch die Claude Seite

### 2. EVIDENRA App starten

- Starten Sie EVIDENRA Professional
- Die App erkennt automatisch die installierte Extension
- Ein grüner Indikator zeigt die erfolgreiche Verbindung

### 3. Erste Verwendung

1. **Projekt laden:** Öffnen Sie ein Projekt in EVIDENRA
2. **Report wählen:** Wählen Sie BASIS, EXTENDED oder ULTIMATE Report
3. **Generierung starten:** Klicken Sie "Report generieren"
4. **Automatischer Prozess:**
   - EVIDENRA sendet Daten an die Extension
   - Extension fügt formatierte Daten in Claude ein
   - Claude generiert den Report
   - Extension sendet Antwort zurück an EVIDENRA

## 🎛️ Extension Controls

### Popup Interface

Klicken Sie auf das Extension Icon für:
- **Status anzeigen:** EVIDENRA App & Claude Tab Verbindung
- **Claude öffnen:** Direkter Link zu claude.ai
- **Status aktualisieren:** Verbindung neu prüfen

### Keyboard Shortcuts

- **Ctrl+Shift+E:** Claude Antwort manuell extrahieren
- **Ctrl+Shift+R:** Extension-Verbindung zurücksetzen

### Visual Indicators

- **🟢 Grün:** Verbindung aktiv
- **🔴 Rot:** Nicht verbunden
- **🟡 Gelb:** Verarbeitung läuft

## 🔍 Troubleshooting

### Extension funktioniert nicht

1. **Browser neu starten**
2. **Extension neu laden** (in Browser Extensions-Seite)
3. **Claude Tab aktualisieren** (F5)
4. **EVIDENRA App neu starten**

### Keine Verbindung zu EVIDENRA

1. **Prüfen Sie:** Extension installiert und aktiviert
2. **Prüfen Sie:** EVIDENRA App läuft
3. **Versuchen Sie:** Extension Popup → "Status aktualisieren"

### Claude Antwort nicht erkannt

1. **Warten Sie:** Bis Claude Antwort vollständig geladen
2. **Verwenden Sie:** Ctrl+Shift+E für manuelle Extraktion
3. **Prüfen Sie:** Claude Tab ist aktiv und sichtbar

### Rate Limits

- Die Extension nutzt Ihr persönliches Claude Abonnement
- Respektieren Sie die Claude Pro/Max Rate Limits
- Bei Limits warten Sie oder upgraden Ihr Abonnement

## 🔒 Sicherheit & Datenschutz

### Was wird übertragen?

- **Nur Projektdaten:** Dokumente, Codierungen, Kategorien
- **Keine persönlichen Daten:** Keine Zugangsdaten oder private Informationen
- **Lokale Verarbeitung:** Smart Data Intelligence läuft lokal

### Berechtigungen

- **claude.ai:** Für Interaktion mit Claude Interface
- **activeTab:** Für Tab-Management
- **storage:** Für Extension-Einstellungen

### Legal & Compliance

- ✅ **Keine API-Umgehung:** Nutzt reguläres Web-Interface
- ✅ **Benutzer-kontrolliert:** Sie steuern alle Interaktionen
- ✅ **Terms of Service:** Konform mit Claude Terms
- ✅ **No Account Risk:** Keine Gefahr für Ihr Claude Konto

## 📞 Support

Bei Problemen:

1. **Console öffnen:** F12 → Console Tab
2. **Fehler kopieren:** Alle rot markierten Nachrichten
3. **Support kontaktieren:** Mit Fehlermeldungen und Beschreibung

## 🔄 Updates

Die Extension wird automatisch über den Browser aktualisiert, sobald neue Versionen verfügbar sind.

---

**🎉 Viel Erfolg mit EVIDENRA Claude Bridge!**

Nutzen Sie die volle Power Ihres Claude Pro/Max Abonnements direkt in EVIDENRA Professional.