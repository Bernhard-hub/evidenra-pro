// Copy CHANGELOG.md to build folder after build
const fs = require('fs');
const path = require('path');

// Read main CHANGELOG
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');

// Write to build folder
const buildPath = 'release/win-unpacked/CHANGELOG.md';
fs.writeFileSync(buildPath, changelog, 'utf8');

console.log(`✅ CHANGELOG.md copied to ${buildPath}`);
