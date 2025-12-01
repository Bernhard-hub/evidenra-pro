// Add BASIC-compatible model names to APIService.ts
const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/services/APIService.ts', 'utf8');

// Replace the model list
const oldPattern = /const knownModels = \[\s+\{\s+id: 'claude-3-5-sonnet-20241022',/;

const newText = `// ⚠️ BASIC-kompatible Model-Namen ZUERST (diese funktionieren mit Standard API-Keys!)
    const knownModels = [
      {
        id: 'claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5 - RECOMMENDED (BASIC Compatible)',
        maxTokens: 8192,
        cost: 0.003
      },
      {
        id: 'claude-haiku-4-5',
        name: 'Claude Haiku 4.5 - Fast & Cheap (BASIC Compatible)',
        maxTokens: 8192,
        cost: 0.001
      },
      {
        id: 'claude-3-5-sonnet-20241022',`;

content = content.replace(oldPattern, newText);

// Write back
fs.writeFileSync('src/services/APIService.ts', content, 'utf8');

console.log('✅ BASIC model names added successfully!');
