// Fix tree-shaking by adding preservation markers to APIService.ts
const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/services/APIService.ts', 'utf8');

// Add preservation comment before getAvailableModels
content = content.replace(
  /\/\*\*\s+\* Gibt verfügbare Modelle für einen Provider zurück/,
  `/**
   * Gibt verfügbare Modelle für einen Provider zurück
   * @preserve - Critical method, must not be tree-shaken`
);

// Add preservation comment before refreshModels
content = content.replace(
  /\/\*\*\s+\* Manuelles Refresh der Modelle \(ignoriert Cache\)/,
  `/**
   * Manuelles Refresh der Modelle (ignoriert Cache)
   * @preserve - Critical method, must not be tree-shaken`
);

// Add preservation comment before fetchAvailableModels
content = content.replace(
  /\/\*\*\s+\* Lädt verfügbare Modelle dynamisch von der API/,
  `/**
   * Lädt verfügbare Modelle dynamisch von der API
   * @preserve - Critical method, must not be tree-shaken`
);

// Also add a forced reference at the end to prevent removal
const endMarker = 'export const getAvailableModels = APIService.getAvailableModels.bind(APIService);';
if (!content.includes('// Force webpack to preserve these methods')) {
  content = content.replace(
    endMarker,
    `${endMarker}

// Force webpack to preserve these methods by creating a reference
if (typeof window !== 'undefined') {
  (window as any).__EVIDENRA_API_PRESERVE__ = {
    getAvailableModels: APIService.getAvailableModels,
    refreshModels: APIService.refreshModels,
    fetchAvailableModels: APIService.fetchAvailableModels
  };
}`
  );
}

// Write back
fs.writeFileSync('src/services/APIService.ts', content, 'utf8');

console.log('✅ Tree-shaking prevention added!');
