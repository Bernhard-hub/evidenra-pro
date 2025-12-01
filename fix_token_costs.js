// Add BASIC model token costs to APIService.ts
const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/services/APIService.ts', 'utf8');

// Replace token costs
content = content.replace(
  /private static tokenCosts: Record<string, \{ input: number; output: number \}> = \{\s+'claude-3-5-sonnet-20241022'/,
  `private static tokenCosts: Record<string, { input: number; output: number }> = {
    'claude-sonnet-4-5': { input: 3.00, output: 15.00 },
    'claude-haiku-4-5': { input: 0.25, output: 1.25 },
    'claude-3-5-sonnet-20241022'`
);

// Write back
fs.writeFileSync('src/services/APIService.ts', content, 'utf8');

console.log('✅ Token costs updated in APIService.ts!');
