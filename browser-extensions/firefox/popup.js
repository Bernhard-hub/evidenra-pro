// 🔌 EVIDENRA Claude Bridge - Firefox Popup Script

class PopupControllerFirefox {
  constructor() {
    this.status = {
      app: false,
      claude: false,
      lastActivity: null
    };
    this.init();
  }

  init() {
    this.refreshStatus();
    this.setupEventListeners();

    // Auto-refresh alle 5 Sekunden
    setInterval(() => {
      this.refreshStatus();
    }, 5000);
  }

  setupEventListeners() {
    // Event Listener für Buttons sind bereits inline in HTML definiert
    // Hier können zusätzliche Listener hinzugefügt werden
  }

  async refreshStatus() {
    const refreshBtn = document.getElementById('refresh-status');
    const refreshText = document.getElementById('refresh-text');
    const refreshLoading = document.getElementById('refresh-loading');

    // Loading State
    refreshText.style.display = 'none';
    refreshLoading.style.display = 'inline-block';

    try {
      // Status von Background Script abrufen
      const response = await browser.runtime.sendMessage({type: 'GET_STATUS'});

      if (response) {
        this.updateStatus(response);
      }

      // Claude Tabs prüfen
      const claudeTabs = await browser.tabs.query({url: '*://claude.ai/*'});
      this.updateClaudeStatus(claudeTabs.length > 0);

    } catch (error) {
      console.error('Fehler beim Status abrufen:', error);
      this.updateStatus({connected: false, claudeTab: null});
    } finally {
      // Loading State beenden
      refreshText.style.display = 'inline';
      refreshLoading.style.display = 'none';
    }
  }

  updateStatus(status) {
    // EVIDENRA App Status
    const appStatus = document.getElementById('app-status');
    const appIndicator = document.getElementById('app-indicator');

    if (status.connected) {
      appStatus.textContent = 'Verbunden';
      appIndicator.className = 'status-indicator status-connected';
    } else {
      appStatus.textContent = 'Getrennt';
      appIndicator.className = 'status-indicator status-disconnected';
    }

    // Letzte Aktivität
    const lastActivity = document.getElementById('last-activity');
    if (status.timestamp) {
      const time = new Date(status.timestamp);
      lastActivity.textContent = time.toLocaleTimeString('de-DE');
    }

    this.status.app = status.connected;
  }

  updateClaudeStatus(hasClaudeTabs) {
    const claudeStatus = document.getElementById('claude-status');
    const claudeIndicator = document.getElementById('claude-indicator');

    if (hasClaudeTabs) {
      claudeStatus.textContent = 'Aktiv';
      claudeIndicator.className = 'status-indicator status-connected';
    } else {
      claudeStatus.textContent = 'Geschlossen';
      claudeIndicator.className = 'status-indicator status-disconnected';
    }

    this.status.claude = hasClaudeTabs;
  }
}

// Globale Funktionen für Button Clicks
async function openClaude() {
  try {
    // Prüft ob Claude Tab bereits offen
    const claudeTabs = await browser.tabs.query({url: '*://claude.ai/*'});

    if (claudeTabs.length > 0) {
      // Fokussiert existierenden Tab
      await browser.tabs.update(claudeTabs[0].id, {active: true});
      await browser.windows.update(claudeTabs[0].windowId, {focused: true});
    } else {
      // Öffnet neuen Claude Tab
      await browser.tabs.create({
        url: 'https://claude.ai/chat',
        active: true
      });
    }

    // Schließt Popup
    window.close();

  } catch (error) {
    console.error('Fehler beim Öffnen von Claude:', error);
  }
}

async function refreshStatus() {
  if (window.popupController) {
    await window.popupController.refreshStatus();
  }
}

function openEvidenra() {
  // Versucht EVIDENRA App zu öffnen (plattformspezifisch)
  // Da dies eine Electron App ist, könnte sie über protokoll-handler geöffnet werden

  // Für jetzt zeigen wir eine Info-Message
  alert('Bitte öffnen Sie EVIDENRA Professional manuell.\n\nDie App sollte automatisch die Extension erkennen.');
}

// Initialisiert Popup Controller
document.addEventListener('DOMContentLoaded', () => {
  window.popupController = new PopupControllerFirefox();
});

// Extension Icon Badge Update
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'STATUS_UPDATE') {
    // Könnte verwendet werden um Live-Updates im Popup zu zeigen
    if (window.popupController) {
      window.popupController.updateStatus(message.data);
    }
  }
});