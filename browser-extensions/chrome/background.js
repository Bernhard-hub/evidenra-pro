// 🔌 EVIDENRA Claude Bridge - Background Service Worker
// Verwaltet WebSocket-Kommunikation zwischen EVIDENRA App und Extension

console.log('🚀 EVIDENRA Claude Bridge Background Worker gestartet');

class EvidenraBackgroundService {
  constructor() {
    this.websocket = null;
    this.claudeTabId = null;
    this.pendingRequests = new Map();
    this.messageQueue = []; // Queue für Nachrichten wenn WebSocket nicht connected
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = Infinity; // Unbegrenzte Reconnects
    this.reconnectDelay = 2000;
    this.baseReconnectDelay = 2000;
    this.init();
  }

  init() {
    this.setupMessageHandlers();
    this.setupTabHandlers();
    this.setupRuntimeHandlers();
    this.connectToEvidenra();
  }

  // Verbindet sich mit EVIDENRA App via WebSocket
  connectToEvidenra() {
    // Probiere mehrere Ports (18642-18645)
    const ports = [18642, 18643, 18644, 18645];
    const port = ports[this.reconnectAttempts % ports.length];
    const wsUrl = `ws://localhost:${port}`;

    console.log(`🔌 Verbinde mit EVIDENRA App: ${wsUrl} (Versuch ${this.reconnectAttempts + 1})`);

    try {
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('✅ Mit EVIDENRA App verbunden');
        this.reconnectAttempts = 0;
        this.reconnectDelay = this.baseReconnectDelay; // Reset delay
        this.updateBadge('connected');

        // Sende alle gepufferten Nachrichten
        this.flushMessageQueue();
      };

      this.websocket.onmessage = (event) => {
        this.handleEvidenraMessage(event.data);
      };

      this.websocket.onclose = () => {
        console.log('🔌 Verbindung zu EVIDENRA App geschlossen');
        this.websocket = null;
        this.updateBadge('disconnected');
        this.attemptReconnect();
      };

      this.websocket.onerror = (error) => {
        console.error('❌ WebSocket Fehler:', error);
      };

    } catch (error) {
      console.error('❌ Konnte WebSocket nicht erstellen:', error);
      this.attemptReconnect();
    }
  }

  // Versucht Reconnect (unbegrenzt)
  attemptReconnect() {
    this.reconnectAttempts++;

    // Nach 10 Versuchen zu langsamerem Polling wechseln (alle 10 Sekunden)
    let delay = this.reconnectDelay;
    if (this.reconnectAttempts > 10) {
      delay = 10000; // 10 Sekunden für spätere Versuche
      if (this.reconnectAttempts % 6 === 0) { // Alle 60 Sekunden loggen
        console.log(`🔄 Warte auf EVIDENRA App... (Versuch ${this.reconnectAttempts})`);
      }
    } else {
      console.log(`🔄 Reconnect Versuch ${this.reconnectAttempts} in ${delay}ms`);
      // Exponentielles Backoff bis 10 Sekunden
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 10000);
    }

    setTimeout(() => {
      this.connectToEvidenra();
    }, delay);

    // Badge auf disconnected (nicht error)
    this.updateBadge('disconnected');
  }

  // Verarbeitet Messages von EVIDENRA App
  handleEvidenraMessage(data) {
    try {
      const message = JSON.parse(data);
      console.log('📨 Message von EVIDENRA:', message.type);

      switch (message.type) {
        case 'CONNECTION_ESTABLISHED':
          console.log('🎉 Verbindung bestätigt:', message.clientId);
          break;

        case 'GENERATE_REPORT':
          this.handleGenerateReport(message.data, message.requestId);
          break;

        case 'PING':
          this.sendToEvidenra({
            type: 'PONG',
            timestamp: new Date().toISOString()
          });
          break;

        case 'GET_CLAUDE_TABS':
          this.sendClaudeTabs();
          break;

        default:
          console.warn('⚠️ Unbekannter Message Type:', message.type);
      }
    } catch (error) {
      console.error('❌ Fehler beim Parsen der Message:', error);
    }
  }

  // Sendet Nachricht an EVIDENRA App
  sendToEvidenra(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
      console.log('📤 Nachricht gesendet:', message.type);
    } else {
      console.warn('⚠️ WebSocket nicht verbunden, puffere Nachricht:', message.type);

      // Füge Nachricht zur Queue hinzu mit Timestamp
      this.messageQueue.push({
        message: message,
        timestamp: Date.now()
      });

      // Limitiere Queue-Größe auf 50 Nachrichten
      if (this.messageQueue.length > 50) {
        const removed = this.messageQueue.shift();
        console.warn('⚠️ Queue voll, älteste Nachricht entfernt:', removed.message.type);
      }

      // Versuche sofort zu reconnecten wenn nicht bereits aktiv
      if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
        console.log('🔄 Starte sofortigen Reconnect-Versuch...');
        this.connectToEvidenra();
      }
    }
  }

  // Sendet alle gepufferten Nachrichten
  flushMessageQueue() {
    if (this.messageQueue.length === 0) {
      return;
    }

    console.log(`📨 Sende ${this.messageQueue.length} gepufferte Nachricht(en)...`);

    const now = Date.now();
    const MAX_MESSAGE_AGE = 5 * 60 * 1000; // 5 Minuten

    while (this.messageQueue.length > 0) {
      const item = this.messageQueue.shift();

      // Überspringe zu alte Nachrichten
      if (now - item.timestamp > MAX_MESSAGE_AGE) {
        console.warn('⚠️ Nachricht zu alt, überspringe:', item.message.type,
                     `(${Math.round((now - item.timestamp) / 1000)}s alt)`);
        continue;
      }

      // Sende Nachricht
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify(item.message));
        console.log('✅ Gepufferte Nachricht gesendet:', item.message.type);
      } else {
        // WebSocket wurde wieder geschlossen, packe zurück in Queue
        this.messageQueue.unshift(item);
        console.warn('⚠️ WebSocket wieder geschlossen während Flush');
        break;
      }
    }
  }

  // Message Handler für Content Scripts
  setupMessageHandlers() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('📨 Message empfangen:', message.type, 'von Tab:', sender.tab?.id);

      switch (message.type) {
        case 'CLAUDE_RESPONSE':
          this.handleClaudeResponse(message, sender);
          sendResponse({status: 'success'});
          break;

        case 'TAB_READY':
          this.handleTabReady(sender);
          sendResponse({status: 'success'});
          break;

        case 'GET_STATUS':
          sendResponse({
            connected: this.websocket?.readyState === WebSocket.OPEN,
            claudeTab: this.claudeTabId,
            timestamp: new Date().toISOString()
          });
          break;
      }

      return true;
    });
  }

  // Tab Management
  setupTabHandlers() {
    // Neue Tabs überwachen
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url?.includes('claude.ai')) {
        console.log('🌐 Claude Tab erkannt:', tabId);
        this.claudeTabId = tabId;
        this.notifyEvidenraApp('CLAUDE_TAB_READY', {tabId, url: tab.url});
      }
    });

    // Tab Schließung überwachen
    chrome.tabs.onRemoved.addListener((tabId) => {
      if (tabId === this.claudeTabId) {
        console.log('❌ Claude Tab geschlossen');
        this.claudeTabId = null;
        this.notifyEvidenraApp('CLAUDE_TAB_CLOSED', {tabId});
      }
    });
  }

  // Runtime Handler
  setupRuntimeHandlers() {
    // Extension Start
    chrome.runtime.onStartup.addListener(() => {
      console.log('🚀 Extension gestartet');
      this.connectToEvidenra();
    });

    // Extension Install
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('📦 Extension installiert:', details.reason);

      if (details.reason === 'install') {
        this.openWelcomePage();
      }

      // Verbinde bei Update
      if (details.reason === 'update') {
        this.connectToEvidenra();
      }
    });
  }

  // Report Generation von EVIDENRA App
  async handleGenerateReport(data, requestId) {
    console.log('📊 Report Generation angefordert:', data.reportType);

    try {
      // Findet oder öffnet Claude Tab
      const claudeTab = await this.ensureClaudeTab();

      if (!claudeTab) {
        throw new Error('Claude Tab konnte nicht geöffnet werden');
      }

      // Sendet Daten an Content Script
      await chrome.tabs.sendMessage(claudeTab.id, {
        type: 'EVIDENRA_DATA',
        requestId: requestId,
        data: data
      });

      console.log('✅ Daten an Claude Tab gesendet');

    } catch (error) {
      console.error('❌ Fehler bei Report Generation:', error);
      this.sendToEvidenra({
        type: 'ERROR',
        data: {
          error: error.message,
          requestId: requestId,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  // Claude Tab sicherstellen
  async ensureClaudeTab() {
    // Prüft existierenden Tab
    if (this.claudeTabId) {
      try {
        const tab = await chrome.tabs.get(this.claudeTabId);
        if (tab && tab.url?.includes('claude.ai')) {
          await chrome.tabs.update(tab.id, { active: true });
          return tab;
        }
      } catch (error) {
        this.claudeTabId = null;
      }
    }

    // Sucht nach Claude Tabs
    const claudeTabs = await chrome.tabs.query({url: '*://claude.ai/*'});

    if (claudeTabs.length > 0) {
      this.claudeTabId = claudeTabs[0].id;
      await chrome.tabs.update(claudeTabs[0].id, { active: true });
      return claudeTabs[0];
    }

    // Öffnet neuen Claude Tab
    const newTab = await chrome.tabs.create({
      url: 'https://claude.ai/chat',
      active: true
    });

    this.claudeTabId = newTab.id;

    // Wartet bis Tab geladen
    return new Promise((resolve) => {
      const checkTab = () => {
        chrome.tabs.get(newTab.id, (tab) => {
          if (tab.status === 'complete') {
            resolve(tab);
          } else {
            setTimeout(checkTab, 1000);
          }
        });
      };
      checkTab();
    });
  }

  // Claude Antwort verarbeiten
  handleClaudeResponse(message, sender) {
    console.log('📝 Claude Antwort verarbeitet:', message.data?.length || 0, 'Zeichen');

    this.sendToEvidenra({
      type: 'CLAUDE_RESPONSE',
      data: {
        requestId: message.requestId,
        response: message.data,
        tabId: sender.tab.id,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Tab Ready Handler
  handleTabReady(sender) {
    console.log('✅ Tab bereit:', sender.tab.id);

    if (sender.tab.url?.includes('claude.ai')) {
      this.claudeTabId = sender.tab.id;
    }
  }

  // Benachrichtigt EVIDENRA App
  notifyEvidenraApp(type, data) {
    this.sendToEvidenra({
      type: type,
      data: data,
      timestamp: new Date().toISOString()
    });
  }

  // Sendet Claude Tabs Liste
  async sendClaudeTabs() {
    const claudeTabs = await chrome.tabs.query({url: '*://claude.ai/*'});

    this.sendToEvidenra({
      type: 'CLAUDE_TABS_LIST',
      data: {
        tabs: claudeTabs.map(tab => ({
          id: tab.id,
          url: tab.url,
          title: tab.title,
          active: tab.active
        })),
        current: this.claudeTabId
      }
    });
  }

  // Öffnet Welcome Page
  openWelcomePage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
  }

  // Badge Update (zeigt Status im Extension Icon)
  updateBadge(status) {
    const badges = {
      connected: { text: '✓', color: '#4ECDC4' },
      disconnected: { text: '✗', color: '#FF6B6B' },
      error: { text: '!', color: '#FFA500' }
    };

    const badge = badges[status] || badges.disconnected;

    chrome.action.setBadgeText({ text: badge.text });
    chrome.action.setBadgeBackgroundColor({ color: badge.color });
  }
}

// Startet Background Service
const backgroundService = new EvidenraBackgroundService();

// Globale Service Referenz für Debugging
self.EVIDENRA_SERVICE = backgroundService;
