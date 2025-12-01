// 🔌 EVIDENRA Claude Bridge - Injected Script
// Läuft direkt im claude.ai Kontext für erweiterte DOM Zugriffe

(function() {
  'use strict';

  console.log('🚀 EVIDENRA Claude Bridge Injection aktiv');

  class ClaudePageMonitor {
    constructor() {
      this.lastResponseTime = 0;
      this.init();
    }

    init() {
      this.monitorClaudeResponses();
      this.addKeyboardShortcuts();
    }

    // Überwacht Claude Antworten mit erweiterten Selektoren
    monitorClaudeResponses() {
      const observeTarget = document.body;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              this.checkForNewResponse(node);
            }
          });
        });
      });

      observer.observe(observeTarget, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-is-streaming']
      });
    }

    // Prüft auf neue Claude Antworten
    checkForNewResponse(node) {
      // Verschiedene Selektoren für Claude Interface Versionen
      const responseSelectors = [
        '[data-is-streaming="false"]',
        '[data-message-author-role="assistant"]',
        '.font-claude-message',
        '.prose',
        '.markdown-body'
      ];

      const isResponse = responseSelectors.some(selector => {
        return node.matches && node.matches(selector) ||
               node.querySelector && node.querySelector(selector);
      });

      if (isResponse) {
        const now = Date.now();
        if (now - this.lastResponseTime > 2000) { // Verhindert Duplikate
          this.lastResponseTime = now;
          setTimeout(() => this.extractAndSendResponse(), 1500);
        }
      }
    }

    // Extrahiert Claude Antwort und sendet sie
    extractAndSendResponse() {
      const responseElement = this.findLatestResponse();

      if (responseElement) {
        const response = {
          text: this.extractText(responseElement),
          html: responseElement.innerHTML,
          wordCount: this.countWords(this.extractText(responseElement)),
          timestamp: new Date().toISOString(),
          isComplete: !responseElement.querySelector('[data-is-streaming="true"]')
        };

        // Sendet an Content Script
        window.postMessage({
          type: 'CLAUDE_RESPONSE_READY',
          response: response
        }, '*');

        console.log('📨 Claude Antwort extrahiert:', response.wordCount, 'Wörter');
      }
    }

    // Findet die neueste Claude Antwort
    findLatestResponse() {
      const selectors = [
        '[data-message-author-role="assistant"]:last-of-type .prose',
        '[data-message-author-role="assistant"]:last-of-type',
        '[data-is-streaming="false"]:last-of-type',
        '.font-claude-message:last-of-type',
        '.markdown-body:last-of-type'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && this.extractText(element).trim().length > 10) {
          return element;
        }
      }

      return null;
    }

    // Extrahiert reinen Text
    extractText(element) {
      // Klont Element um Originale nicht zu verändern
      const clone = element.cloneNode(true);

      // Entfernt Code-Blöcke und andere Elemente die nicht zum Haupttext gehören
      const codeBlocks = clone.querySelectorAll('pre, code');
      codeBlocks.forEach(block => {
        if (block.textContent.length > 100) {
          block.textContent = '[CODE BLOCK REMOVED]';
        }
      });

      return clone.textContent || clone.innerText || '';
    }

    // Zählt Wörter
    countWords(text) {
      return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    // Keyboard Shortcuts für EVIDENRA
    addKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+E: Extrahiert aktuelle Antwort manuell
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
          e.preventDefault();
          this.extractAndSendResponse();
          this.showNotification('🔄 Claude Antwort manuell extrahiert');
        }

        // Ctrl+Shift+R: Reset EVIDENRA Verbindung
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
          e.preventDefault();
          window.postMessage({
            type: 'EVIDENRA_RESET'
          }, '*');
          this.showNotification('🔄 EVIDENRA Verbindung zurückgesetzt');
        }
      });
    }

    // Zeigt Notification
    showNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: #4ECDC4;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
      `;

      // CSS Animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      notification.textContent = message;
      document.body.appendChild(notification);

      // Auto-remove nach 3 Sekunden
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          notification.remove();
          style.remove();
        }, 300);
      }, 3000);
    }
  }

  // Wartet bis Seite vollständig geladen
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ClaudePageMonitor();
    });
  } else {
    new ClaudePageMonitor();
  }

  // Globale Hilfsfunktionen für Extension
  window.EVIDENRA_HELPERS = {
    extractCurrentResponse: function() {
      const monitor = new ClaudePageMonitor();
      monitor.extractAndSendResponse();
    },

    getClaudeVersion: function() {
      return {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };
    }
  };

})();