// Update App.tsx to use BASIC-compatible model names
const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/renderer/App.tsx', 'utf8');

// 1. Update model list in API providers
content = content.replace(
  /models: \[\s+\{ id: 'claude-3-5-sonnet-20241022', name: 'Claude 3\.5 Sonnet \(Oct 2024\) - RECOMMENDED'/,
  `models: [
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5 - RECOMMENDED (BASIC Compatible)', cost: 0.003, maxTokens: 200000 },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5 - Fast & Cheap (BASIC Compatible)', cost: 0.001, maxTokens: 200000 },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Oct 2024'`
);

// 2. Update default model in useState
content = content.replace(
  /model: 'claude-3-5-sonnet-20241022',\s+apiKey: '',/,
  `model: 'claude-sonnet-4-5',
    apiKey: '',`
);

// 3. Update valid models list
content = content.replace(
  /const validModels = \['claude-3-5-sonnet-20241022', 'claude-3-5-sonnet-20241022', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'\];/,
  `const validModels = ['claude-sonnet-4-5', 'claude-haiku-4-5', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'];`
);

// 4. Update fallback model
content = content.replace(
  /return \{ \.\.\.prev, model: 'claude-3-5-sonnet-20241022' \};/g,
  `return { ...prev, model: 'claude-sonnet-4-5' };`
);

// Write back
fs.writeFileSync('src/renderer/App.tsx', content, 'utf8');

console.log('✅ App.tsx updated with BASIC-compatible models!');
