// 🔌 EVIDENRA Claude Bridge - Content Script
// Läuft direkt auf claude.ai und überwacht Interaktionen

console.log('🔌 EVIDENRA Claude Bridge aktiviert');

class EvidenraClaudeBridge {
  constructor() {
    this.isConnected = false;
    this.evidenraData = null;
    this.requestId = null;
    this.init();
  }

  init() {
    this.injectPageScript();
    this.setupMessageListener();
    this.addEvidenraIndicator();
    this.monitorClaudeInterface();
  }

  // Injiziert Script direkt in die Seite
  injectPageScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // Nachrichten zwischen Extension und App
  setupMessageListener() {
    // Von EVIDENRA App
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('📨 Message von EVIDENRA:', message);

      if (message.type === 'EVIDENRA_DATA') {
        this.evidenraData = message.data;
        this.requestId = message.requestId; // Speichere requestId!
        this.isConnected = true;
        this.updateIndicator('connected');
        this.prepareClaudeInput(message.data);
        sendResponse({status: 'success', message: 'Daten empfangen'});
      }

      if (message.type === 'GET_CLAUDE_RESPONSE') {
        const response = this.extractClaudeResponse();
        sendResponse({status: 'success', data: response});
      }

      return true;
    });

    // Von injiziertem Script
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;

      if (event.data.type === 'CLAUDE_RESPONSE_READY') {
        this.handleClaudeResponse(event.data.response);
      }
    });
  }

  // Visueller Indikator für EVIDENRA Verbindung
  addEvidenraIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'evidenra-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #FF6B6B;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    `;
    indicator.textContent = '🔴 EVIDENRA nicht verbunden';
    document.body.appendChild(indicator);
  }

  updateIndicator(status) {
    const indicator = document.getElementById('evidenra-indicator');
    if (!indicator) return;

    if (status === 'connected') {
      indicator.style.background = '#4ECDC4';
      indicator.textContent = '🟢 EVIDENRA verbunden';
    } else if (status === 'processing') {
      indicator.style.background = '#FFE66D';
      indicator.textContent = '🟡 Verarbeitung läuft...';
    }
  }

  // Claude Interface überwachen
  monitorClaudeInterface() {
    // Überwacht neue Nachrichten von Claude
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && this.isClaudeMessage(node)) {
            this.handleNewClaudeMessage(node);
          }
        });
      });
    });

    // Startet Überwachung sobald Chat Container gefunden
    const startObserving = () => {
      const chatContainer = document.querySelector('[data-testid="conversation"]') ||
                          document.querySelector('.conversation') ||
                          document.querySelector('[role="main"]');

      if (chatContainer) {
        observer.observe(chatContainer, {
          childList: true,
          subtree: true
        });
        console.log('📱 Claude Interface Überwachung gestartet');
      } else {
        setTimeout(startObserving, 1000);
      }
    };

    startObserving();
  }

  // Erkennt Claude Antwort-Nachrichten
  isClaudeMessage(node) {
    return node.querySelector && (
      node.querySelector('[data-is-streaming="false"]') ||
      node.classList?.contains('message') ||
      node.getAttribute?.('data-message-author-role') === 'assistant'
    );
  }

  // Neue Claude Nachricht verarbeiten
  handleNewClaudeMessage(messageNode) {
    if (this.isConnected && this.evidenraData) {
      console.log('📝 Neue Claude Antwort erkannt');
      setTimeout(() => {
        const response = this.extractClaudeResponse();
        this.sendToEvidenra(response);
      }, 2000); // Warten bis Nachricht vollständig geladen
    }
  }

  // EVIDENRA Daten in Claude Input vorbereiten
  prepareClaudeInput(data) {
    this.updateIndicator('processing');

    console.log('🔄 Starte NEUEN CHAT für frischen Kontext...');

    // KRITISCH: Starte einen NEUEN CHAT um vorherigen Kontext zu löschen
    // Dies verhindert, dass Claude vorherige Antworten wiederholt
    const newChatButton = document.querySelector('[aria-label*="New"]') ||
                         document.querySelector('button[aria-label*="new"]') ||
                         document.querySelector('a[href="/new"]') ||
                         Array.from(document.querySelectorAll('button')).find(btn =>
                           btn.textContent.toLowerCase().includes('new chat') ||
                           btn.textContent.toLowerCase().includes('neue')
                         );

    if (newChatButton) {
      console.log('✅ New Chat Button gefunden - klicke...');
      newChatButton.click();

      // Warte kurz bis neuer Chat geladen ist
      setTimeout(() => {
        this.insertTextAndSend(data);
      }, 1500);
    } else {
      console.log('⚠️ New Chat Button nicht gefunden - versuche direkt...');
      // Fallback: Versuche direkt zur /new URL zu navigieren
      if (window.location.pathname !== '/new') {
        console.log('🔄 Navigiere zu /new...');
        window.location.href = 'https://claude.ai/new';

        // Warte bis Seite geladen ist
        setTimeout(() => {
          this.insertTextAndSend(data);
        }, 2000);
      } else {
        // Wir sind bereits auf /new
        this.insertTextAndSend(data);
      }
    }
  }

  // Hilfsfunktion: Text einfügen und senden
  insertTextAndSend(data) {
    console.log('📝 Füge Text in neuen Chat ein...');

    // Findet das Eingabefeld
    const inputField = document.querySelector('textarea[placeholder*="Message"]') ||
                      document.querySelector('textarea[data-testid="chat-input"]') ||
                      document.querySelector('.ProseMirror') ||
                      document.querySelector('[contenteditable="true"]');

    if (inputField) {
      // Erstellt Prompt aus den Daten
      const formattedInput = data.projectData?.prompt || data.prompt || this.formatEvidenraData(data);

      // Setzt Text im Eingabefeld
      if (inputField.tagName === 'TEXTAREA') {
        inputField.value = formattedInput;
        inputField.dispatchEvent(new Event('input', {bubbles: true}));
      } else {
        inputField.innerHTML = formattedInput;
        inputField.dispatchEvent(new Event('input', {bubbles: true}));
      }

      // Scrollt zum Eingabefeld
      inputField.scrollIntoView({behavior: 'smooth'});
      inputField.focus();

      console.log('✅ EVIDENRA Daten in Claude Input eingefügt');

      // WICHTIG: Automatisch Send-Button klicken
      setTimeout(() => {
        this.clickSendButton();
        // Starte aktives Polling für Response
        this.startResponsePolling();
      }, 500);
    } else {
      console.error('❌ Eingabefeld nicht gefunden - warte und versuche erneut...');
      // Retry nach kurzer Wartezeit
      setTimeout(() => this.insertTextAndSend(data), 1000);
    }
  }

  // Aktives Polling für Claude Response (statt nur MutationObserver)
  startResponsePolling() {
    let attempts = 0;
    const maxAttempts = 100; // 5 Minuten bei 3 Sekunden Intervall
    let lastResponseLength = 0;
    let stableCount = 0;
    const requiredStableChecks = 2; // Response muss 2x gleich lang sein (6 Sekunden stabil)

    this.pollingInterval = setInterval(() => {
      attempts++;
      console.log(`🔍 Polling für Response... (Versuch ${attempts}/${maxAttempts})`);

      // 🆕 PRÜFE AUF RATE-LIMIT FEHLER
      const rateLimitError = this.detectRateLimitError();
      if (rateLimitError) {
        console.warn('⚠️ Rate-Limit erkannt! Starte automatisch neuen Chat und wiederhole Anfrage...');
        clearInterval(this.pollingInterval);
        this.handleRateLimitRetry();
        return;
      }

      // Prüfe ob Claude fertig ist (kein Streaming mehr)
      const isStreaming = document.querySelector('[data-is-streaming="true"]');
      const stopButton = document.querySelector('button[aria-label*="Stop"]') ||
                        document.querySelector('button[aria-label*="stop"]');

      if (!isStreaming && !stopButton && this.isConnected && this.evidenraData) {
        const response = this.extractClaudeResponse();

        if (response && response.text && response.text.length > 50) {
          const currentLength = response.text.length;

          // Prüfe ob Response stabil ist (gleiche Länge über mehrere Checks)
          if (currentLength === lastResponseLength) {
            stableCount++;
            console.log(`🔄 Response stabil (${stableCount}/${requiredStableChecks} checks, ${currentLength} chars)`);

            if (stableCount >= requiredStableChecks) {
              console.log('✅ Response vollständig und stabil!');
              console.log(`📏 Finale Länge: ${currentLength} Zeichen`);
              clearInterval(this.pollingInterval);
              this.sendToEvidenra(response);
            }
          } else {
            // Response wächst noch
            console.log(`📈 Response wächst: ${lastResponseLength} → ${currentLength} chars`);
            lastResponseLength = currentLength;
            stableCount = 0; // Reset counter
          }
        }
      } else if (isStreaming || stopButton) {
        // Streaming läuft noch - Reset counter
        lastResponseLength = 0;
        stableCount = 0;
        console.log(`⏳ Claude generiert noch... (Streaming: ${!!isStreaming}, Stop-Button: ${!!stopButton})`);
      }

      // Timeout nach maxAttempts
      if (attempts >= maxAttempts) {
        console.warn('⏱️ Polling Timeout - keine Response nach 5 Minuten');
        clearInterval(this.pollingInterval);
        this.isConnected = false;
        this.evidenraData = null;
        this.updateIndicator('disconnected');
      }
    }, 3000); // Alle 3 Sekunden
  }

  // Send-Button automatisch klicken
  clickSendButton() {
    console.log('🔍 Suche Send-Button...');

    // Findet Send-Button (verschiedene Selektoren für unterschiedliche Claude.ai Versionen)
    let sendButton = null;

    // Strategie 1: Direkte Selektoren
    const directSelectors = [
      'button[aria-label*="Send"]',
      'button[aria-label*="send"]',
      'button[data-testid="send-button"]',
      'button[type="submit"]',
      'button.send-button',
      'button[class*="send"]',
      'form button[type="submit"]'
    ];

    for (const selector of directSelectors) {
      sendButton = document.querySelector(selector);
      if (sendButton && !sendButton.disabled) {
        console.log(`✅ Send-Button gefunden mit Selector: ${selector}`);
        break;
      }
    }

    // Strategie 2: Suche nach Button-Text oder SVG-Icons
    if (!sendButton || sendButton.disabled) {
      const buttons = Array.from(document.querySelectorAll('button'));
      console.log(`🔍 Prüfe ${buttons.length} Buttons nach Text/SVG...`);

      sendButton = buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
        const hasSVG = btn.querySelector('svg') !== null;

        return !btn.disabled && (
          text.includes('send') ||
          ariaLabel.includes('send') ||
          (hasSVG && btn.closest('form')) // Button mit SVG in einem Form
        );
      });

      if (sendButton) {
        console.log('✅ Send-Button gefunden via Text/SVG-Suche');
      }
    }

    // Strategie 3: Click-Event ausführen
    if (sendButton && !sendButton.disabled) {
      // Mehrfacher Click-Versuch für bessere Kompatibilität
      sendButton.click();
      sendButton.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      console.log('✅ Send-Button automatisch geklickt');
      return true;
    } else {
      console.warn('⚠️ Send-Button nicht gefunden oder disabled');
      console.log('⚠️ Button Status:', sendButton ? 'gefunden aber disabled' : 'nicht gefunden');

      // Strategie 4: Enter-Taste simulieren (Fallback)
      const inputField = document.querySelector('textarea[placeholder*="Message"]') ||
                        document.querySelector('textarea[data-testid="chat-input"]') ||
                        document.querySelector('.ProseMirror') ||
                        document.querySelector('[contenteditable="true"]');

      if (inputField) {
        // Cmd+Enter (Mac) oder Ctrl+Enter (Windows)
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        inputField.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          [isMac ? 'metaKey' : 'ctrlKey']: true
        }));
        console.log('✅ Cmd/Ctrl+Enter simuliert');
        return true;
      }

      console.error('❌ Konnte Send-Button nicht klicken - MANUELLER CLICK ERFORDERLICH');
      return false;
    }
  }

  // Formatiert EVIDENRA Daten für Claude
  formatEvidenraData(data) {
    return `# 📊 EVIDENRA PROFESSIONAL - ${data.reportType.toUpperCase()} REPORT

${data.prompt}

## 📋 Projekt Information
- **Projekt:** ${data.projectName}
- **Dokumente:** ${data.documentCount}
- **Codierungen:** ${data.codingCount}
- **Kategorien:** ${data.categoryCount}

## 🧠 Smart Data Intelligence
${data.intelligence}

**⚠️ WICHTIG:** Verwende ausschließlich die bereitgestellten Daten. Keine erfundenen Inhalte!`;
  }

  // Extrahiert Claude Antwort - ULTRA ROBUST V3 mit HTML-Attributen
  extractClaudeResponse() {
    console.log('🔍 Extrahiere Claude Response (Ultra-Robust-Modus V3)...');

    // 🎯 STRATEGIE 1: Suche nach ASSISTANT role (zuverlässigste Methode)
    const assistantSelectors = [
      '[data-message-author-role="assistant"]',
      '[data-testid="message-assistant"]',
      '[data-message-type="assistant"]',
      'div[class*="assistant"]',
      'div[class*="claude-message"]'
    ];

    for (const selector of assistantSelectors) {
      const messages = document.querySelectorAll(selector);
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const text = (lastMessage.innerText || lastMessage.textContent || '').trim();

        if (text.length > 50) {
          console.log(`✅ Claude Response gefunden via Selector: ${selector}`);
          console.log(`📏 Länge: ${text.length} Zeichen`);
          console.log(`📝 Vorschau: ${text.substring(0, 200)}`);

          return {
            text: text,
            html: lastMessage.innerHTML || '',
            timestamp: new Date().toISOString()
          };
        }
      }
    }

    console.log('⚠️ Strategie 1 (HTML-Attribute) fehlgeschlagen');

    // 🎯 STRATEGIE 2: Finde die LETZTE Message die NICHT unseren Prompt enthält
    console.log('🔄 Versuche Strategie 2 (Prompt-Filterung)...');

    // Finde alle großen Text-Blöcke im Chat
    const allMessages = [];
    const candidates = document.querySelectorAll('div, article, section');

    // 🚫 UI-Noise Patterns (Werbung, Upgrade-Prompts etc.)
    const uiNoisePatterns = [
      /alles aus pro.*plus/i,
      /wählen sie zwischen.*mehr nutzung/i,
      /upgrade.*claude pro/i,
      /höhere ausgabelimits/i,
      /subscribe.*plan/i,
      /try claude.*for work/i
    ];

    candidates.forEach(el => {
      const text = (el.innerText || el.textContent || '').trim();

      // Filter UI-Noise
      const isUINoise = uiNoisePatterns.some(pattern => pattern.test(text));
      if (isUINoise) {
        console.log('🚫 UI-Noise gefiltert:', text.substring(0, 50));
        return; // Skip this element
      }

      // Nur Elemente mit substanziellem Text
      if (text.length > 100 && text.length < 50000) {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.height > 0 && rect.width > 0;

        if (isVisible) {
          // Ignoriere Sidebar (links <30% der Breite)
          const windowWidth = window.innerWidth;
          const isInLeftSidebar = rect.left < windowWidth * 0.3 && rect.width < windowWidth * 0.4;

          if (!isInLeftSidebar) {
            allMessages.push({
              element: el,
              text: text,
              length: text.length,
              y: rect.top
            });
          }
        }
      }
    });

    // Sortiere nach Y-Position (unten = neueste)
    allMessages.sort((a, b) => b.y - a.y);

    console.log(`📦 Gefunden ${allMessages.length} potenzielle Messages`);

    // Filtere User-Messages raus mit PRÄZISEN Markern
    // Nur SEHR SPEZIFISCHE Marker die eindeutig auf EVIDENRA System-Prompts hinweisen
    const strongUserPromptMarkers = [
      'Du bist ein Experte für wissenschaftliche Forschungsmethodik',
      'Du bist ein Experte für wissenschaftliches Schreiben',
      'You are an expert in qualitative research methodology',
      'EVIDENRA PROFESSIONAL',
      'WICHTIG: Antworte AUSSCHLIESSLICH mit einem',
      'IMPORTANT: Respond ONLY with',
      '📊 EVIDENRA',
      'DOKUMENT-ANALYSE FÜR QUALITATIVE FORSCHUNG',
      'CRITICAL RULES:\n- Be',
      'SECTION-SPEZIFISCHE ANFORDERUNGEN',
      'Zielwortanzahl: MINDESTENS',
      '🎯 **SECTION-SPEZIFISCHE'
    ];

    // Check: User prompts STARTEN oft mit diesen Patterns (nicht nur enthalten!)
    // Der Text kann mit "BS\n" oder anderen kurzen UI-Strings beginnen, daher auch nach den ersten 50 chars prüfen
    const userPromptStartPatterns = [
      /^Du bist ein Experte/,
      /^You are an expert/,
      /^EVIDENRA PROFESSIONAL/,
      /^# ROLE\s*\nYou are an expert/,
      /^System:\s*Du bist/,
      /^System:\s*You are/,
      /^.{0,50}Du bist ein Experte/,  // Erlaubt bis zu 50 chars vor dem Pattern
      /^.{0,50}🎯 \*\*SECTION-SPEZIFISCHE/,
      /^.{0,50}Section \d+ von \d+/
    ];

    const claudeResponses = [];

    for (let i = 0; i < Math.min(10, allMessages.length); i++) {
      const msg = allMessages[i];
      const firstLines = msg.text.substring(0, 500); // Check first 500 chars

      // Check 1: Message STARTET mit User-Prompt-Pattern
      const startsLikeUserPrompt = userPromptStartPatterns.some(pattern => pattern.test(msg.text));

      // Check 2: Message enthält mehrere (>=2) starke EVIDENRA-spezifische Marker
      const markerCount = strongUserPromptMarkers.filter(marker => msg.text.includes(marker)).length;
      const hasMultipleMarkers = markerCount >= 2;

      // Check 3: Ist die Message ein JSON Response? (Dann NICHT filtern!)
      const looksLikeJSON = /^\s*\{[\s\S]*"[a-zA-Z]+"\s*:/.test(msg.text) || msg.text.trim().startsWith('```json');

      // Nur als User-Prompt markieren wenn:
      // - Es STARTET wie ein User-Prompt ODER
      // - Es hat mehrere starke EVIDENRA-Marker
      // - UND es ist KEIN JSON Response
      const isUserPrompt = !looksLikeJSON && (startsLikeUserPrompt || hasMultipleMarkers);

      if (!isUserPrompt) {
        claudeResponses.push(msg);
        console.log(`✅ Claude Response Kandidat #${claudeResponses.length}: ${msg.length} chars`);
      } else {
        console.log(`⏭️ Überspringe Message ${i} (User-Prompt: starts=${startsLikeUserPrompt}, markers=${markerCount})`);
      }
    }

    // Nimm die ERSTE gefilterte Message (= neueste)
    if (claudeResponses.length > 0) {
      const response = claudeResponses[0];

      console.log('✅ Claude Response gefunden via Filterung!');
      console.log(`📏 Länge: ${response.length} Zeichen`);
      console.log(`📝 Vorschau: ${response.text.substring(0, 200)}`);

      // 🔥 FILTER: Entferne Artifacts UI-Elemente
      let cleanedText = response.text;

      // Entferne "Artefakte" Download-Button-Text (erscheint bei Claude Artifacts)
      const artifactsPattern = /Artefakte[\s\S]*?Alles herunterladen[\s\S]*?(Kodierhandbuch|Optimized category|Code|Dokument)[^\n]*\n/gi;
      cleanedText = cleanedText.replace(artifactsPattern, '');

      // Entferne standalone "Artefakte" Zeilen
      cleanedText = cleanedText.replace(/^Artefakte\s*$/gm, '');
      cleanedText = cleanedText.replace(/^Alles herunterladen\s*$/gm, '');

      // Cleanup: Entferne mehrfache Newlines
      cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n').trim();

      console.log(`🧹 Nach Filterung: ${cleanedText.length} Zeichen`);
      console.log(`📝 Cleaned Vorschau: ${cleanedText.substring(0, 200)}`);

      // 🆕 ARTIFACT EXTRACTION
      // Prüfe ob Artifacts vorhanden sind und füge sie zum Response hinzu
      const artifacts = this.extractArtifacts();
      if (artifacts && artifacts.length > 0) {
        console.log(`📎 ${artifacts.length} Artifacts gefunden!`);

        // Füge Artifacts zum Text hinzu
        artifacts.forEach((artifact, index) => {
          console.log(`📎 Artifact ${index + 1}: ${artifact.title || 'Unnamed'} (${artifact.content.length} chars)`);
          cleanedText += `\n\n---ARTIFACT:${artifact.title}---\n${artifact.content}\n---END_ARTIFACT---\n`;
        });

        console.log(`✅ Total nach Artifacts: ${cleanedText.length} Zeichen`);
      }

      return {
        text: cleanedText,
        html: response.element.innerHTML || '',
        timestamp: new Date().toISOString()
      };
    }

    console.log('⚠️ Strategie 2 (Prompt-Filterung) fehlgeschlagen');

    // 🎯 STRATEGIE 3: FALLBACK - Nimm einfach die unterste große Message
    console.log('🔄 Versuche Strategie 3 (Fallback)...');

    const selectors = [
      '[data-message-author-role="assistant"]',
      '[data-testid="message-assistant"]',
      '.font-claude-message',
      'div[class*="message"]',
      '[role="article"]'
    ];

    for (const selector of selectors) {
      try {
        const messages = document.querySelectorAll(selector);
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          const text = (lastMessage.innerText || lastMessage.textContent || '').trim();

          if (text.length > 50) {
            console.log('✅ Response gefunden mit Fallback-Selektor:', selector);
            return {
              text: text,
              html: lastMessage.innerHTML || '',
              timestamp: new Date().toISOString()
            };
          }
        }
      } catch (e) {
        console.warn('⚠️ Selektor-Fehler:', selector, e.message);
      }
    }

    console.error('❌ Keine Claude Response gefunden (alle Strategien fehlgeschlagen)!');
    console.log('💡 TIPP: Stelle sicher dass:');
    console.log('   1. Du bei claude.ai eingeloggt bist');
    console.log('   2. Claude bereits geantwortet hat');
    console.log('   3. Das Streaming abgeschlossen ist');

    return null;
  }

  // Sendet Antwort zurück zu EVIDENRA
  sendToEvidenra(response) {
    if (response) {
      let responseText = response.text || response;

      // 🔥 KRITISCHER FILTER: Prüfe ob Response der Prompt selbst ist (Echo-Problem)
      const promptMarkers = [
        'Du bist ein Experte für wissenschaftliches Schreiben',
        'Du bist ein Experte für wissenschaftliche Forschungsmethodik',
        'SECTION-SPEZIFISCHE ANFORDERUNGEN',
        '🎯 **SECTION-SPEZIFISCHE',
        'Zielwortanzahl: MINDESTENS',
        'EVIDENRA PROFESSIONAL'
      ];

      // Prüfe in den ersten 500 Zeichen ob es ein Prompt-Echo ist
      const first500 = (typeof responseText === 'string' ? responseText : '').substring(0, 500);
      const isPromptEcho = promptMarkers.some(marker => first500.includes(marker));

      if (isPromptEcho) {
        console.error('❌ FEHLER: Response ist ein Prompt-Echo! Suche echte Claude-Antwort...');
        console.log('🔍 Prompt-Echo erkannt:', first500.substring(0, 200));

        // Versuche nochmal mit forcierter Strategie 1 (nur assistant-role)
        const realResponse = this.extractOnlyAssistantMessages();

        if (realResponse && realResponse.text && !promptMarkers.some(m => realResponse.text.substring(0, 500).includes(m))) {
          console.log('✅ Echte Claude-Antwort gefunden!');
          responseText = realResponse.text;
        } else {
          console.error('❌ Konnte keine echte Claude-Antwort finden! Breche ab.');
          // Setze Fehler-Status
          this.updateIndicator('disconnected');
          return; // Sende NICHT den Prompt zurück!
        }
      }

      chrome.runtime.sendMessage({
        type: 'CLAUDE_RESPONSE',
        requestId: this.requestId, // Füge requestId hinzu!
        data: responseText,
        projectData: this.evidenraData
      });
      console.log('📤 Claude Antwort an EVIDENRA gesendet (requestId:', this.requestId, ')');
      console.log('📏 Response-Länge:', typeof responseText === 'string' ? responseText.length : 0);

      // Reset nach erfolgreicher Sendung
      this.isConnected = false;
      this.evidenraData = null;
      this.requestId = null;
      this.updateIndicator('disconnected');
    }
  }

  // 🆕 HELPER: Extrahiert NUR Assistant-Messages (streng)
  extractOnlyAssistantMessages() {
    console.log('🔍 Extrahiere nur Assistant-Messages (strenge Filterung)...');

    const assistantSelectors = [
      '[data-message-author-role="assistant"]',
      '[data-testid="message-assistant"]',
      'div[class*="assistant-message"]',
      'div[class*="claude-response"]'
    ];

    for (const selector of assistantSelectors) {
      const messages = document.querySelectorAll(selector);

      if (messages.length > 0) {
        // Nimm die LETZTE Assistant-Message
        const lastMessage = messages[messages.length - 1];
        const text = (lastMessage.innerText || lastMessage.textContent || '').trim();

        if (text.length > 100) {
          console.log(`✅ Assistant-Message gefunden: ${text.length} chars`);
          console.log(`📝 Vorschau: ${text.substring(0, 200)}`);

          return {
            text: text,
            html: lastMessage.innerHTML || '',
            timestamp: new Date().toISOString()
          };
        }
      }
    }

    console.log('⚠️ Keine Assistant-Messages gefunden');
    return null;
  }

  // Claude Antwort verarbeitet
  handleClaudeResponse(response) {
    this.sendToEvidenra(response);
    this.updateIndicator('connected');
  }

  // 🆕 ARTIFACT EXTRACTION
  extractArtifacts() {
    const artifacts = [];

    try {
      // Strategie 1: Suche nach Code-Blocks die wie JSON aussehen
      const codeBlocks = document.querySelectorAll('pre code, pre, code[class*="language"]');
      console.log(`🔍 Prüfe ${codeBlocks.length} Code-Blöcke auf Artifacts...`);

      codeBlocks.forEach((block, index) => {
        const content = (block.textContent || block.innerText || '').trim();

        // Prüfe ob es JSON ist
        if (content.length > 100 && (content.startsWith('{') || content.startsWith('['))) {
          try {
            // Versuche zu parsen um zu validieren dass es JSON ist
            JSON.parse(content);

            // Versuche Titel zu finden (vorheriges Element oder parent)
            let title = `artifact_${index + 1}.json`;
            const prevElement = block.previousElementSibling;
            if (prevElement && prevElement.innerText) {
              const prevText = prevElement.innerText.trim();
              if (prevText.length < 100) {
                title = prevText.replace(/[^a-zA-Z0-9_-]/g, '_') + '.json';
              }
            }

            artifacts.push({
              title,
              content,
              type: 'json'
            });

            console.log(`📎 JSON Artifact gefunden: ${title} (${content.length} chars)`);
          } catch (e) {
            // Kein valides JSON, ignorieren
          }
        }
      });

      // Strategie 2: Suche nach Download-Links die auf JSON/MD hinweisen
      const downloadLinks = document.querySelectorAll('a[download], a[href^="blob:"]');
      console.log(`🔍 Prüfe ${downloadLinks.length} Download-Links...`);

      downloadLinks.forEach(link => {
        const filename = link.getAttribute('download') || link.textContent || '';
        if (filename.includes('.json') || filename.includes('.md')) {
          console.log(`📎 Download-Link gefunden: ${filename}`);
          // Hinweis: Den Inhalt können wir hier nicht direkt extrahieren,
          // aber wir markieren dass ein Artifact existiert
        }
      });

      // Strategie 3: Suche nach Markdown-Code-Blöcken
      const markdownBlocks = document.querySelectorAll('pre');
      markdownBlocks.forEach((block, index) => {
        const content = (block.textContent || block.innerText || '').trim();

        // Prüfe ob es ein Markdown-Dokument ist (beginnt mit # oder hat viele Markdown-Patterns)
        if (content.length > 200) {
          const hasMarkdown = /^#+\s|\*\*|##|###|\n-\s|\n\d+\.\s/.test(content);
          if (hasMarkdown && !content.startsWith('{') && !content.startsWith('[')) {
            let title = `document_${index + 1}.md`;
            const prevElement = block.previousElementSibling;
            if (prevElement && prevElement.innerText) {
              const prevText = prevElement.innerText.trim();
              if (prevText.length < 100) {
                title = prevText.replace(/[^a-zA-Z0-9_-]/g, '_') + '.md';
              }
            }

            artifacts.push({
              title,
              content,
              type: 'markdown'
            });

            console.log(`📎 Markdown Artifact gefunden: ${title} (${content.length} chars)`);
          }
        }
      });

    } catch (e) {
      console.error('❌ Fehler beim Artifact-Extraction:', e);
    }

    return artifacts;
  }

  // 🆕 RATE-LIMIT DETECTION
  detectRateLimitError() {
    // Suche nach typischen Rate-Limit Fehlermeldungen
    const errorPatterns = [
      /rate limit/i,
      /too many requests/i,
      /message limit/i,
      /limit reached/i,
      /nachrichtenlimit/i,
      /zu viele anfragen/i
    ];

    // Prüfe auf Error-Messages im Chat
    const messageElements = document.querySelectorAll('[role="article"], .message, div[class*="message"]');

    // 🚫 FILTER: UI-Werbungen und Upgrade-Prompts
    const uiNoisePatterns = [
      /alles aus pro.*plus/i,
      /wählen sie zwischen.*mehr nutzung/i,
      /upgrade.*claude pro/i,
      /höhere ausgabelimits/i,
      /subscribe.*plan/i
    ];

    for (const element of messageElements) {
      let text = (element.innerText || element.textContent || '').toLowerCase();

      for (const pattern of errorPatterns) {
        if (pattern.test(text)) {
          console.log('🔍 Rate-Limit Fehler erkannt:', text.substring(0, 100));
          return true;
        }
      }
    }

    // Prüfe auch auf Error-Banner oder Notifications
    const errorBanners = document.querySelectorAll('[role="alert"], .error, .notification, [class*="error"]');
    for (const banner of errorBanners) {
      const text = (banner.innerText || banner.textContent || '').toLowerCase();

      for (const pattern of errorPatterns) {
        if (pattern.test(text)) {
          console.log('🔍 Rate-Limit Banner erkannt:', text.substring(0, 100));
          return true;
        }
      }
    }

    return false;
  }

  // 🆕 HANDLE RATE-LIMIT RETRY
  handleRateLimitRetry() {
    console.log('🔄 Starte Rate-Limit Auto-Retry...');
    console.log('📝 Gespeicherte Daten:', this.evidenraData ? 'vorhanden' : 'fehlen');

    if (!this.evidenraData) {
      console.error('❌ Keine evidenraData zum Retry verfügbar');
      this.updateIndicator('disconnected');
      return;
    }

    // Zeige User-Feedback
    this.updateIndicator('processing');

    // Warte 2 Sekunden bevor wir einen neuen Chat starten
    setTimeout(() => {
      console.log('🔄 Starte neuen Chat wegen Rate-Limit...');

      // Sichere die Daten
      const savedData = JSON.parse(JSON.stringify(this.evidenraData));

      // Starte neuen Chat (triggert prepareClaudeInput)
      this.prepareClaudeInput(savedData);
    }, 2000);
  }
}

// Startet Bridge sobald Seite geladen
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EvidenraClaudeBridge();
  });
} else {
  new EvidenraClaudeBridge();
}