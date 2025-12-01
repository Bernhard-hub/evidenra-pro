/**
 * Robuster Feature-Vergleich von BASIC und PRO App.tsx
 * Verwendet AST-Parsing für Struktur + Regex für robuste Extraktion
 */

const fs = require('fs');
const parser = require('@babel/parser');

const BASIC_PATH = 'C:/Users/Bernhard/Desktop/Portable_APPS_fertig/BASIC/FINAL/evidenra-basic/src/renderer/App.tsx';
const PRO_PATH = 'C:/Users/Bernhard/evidenra-professional-v2/src/renderer/App.tsx';

function extractFeatures(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');

  const features = {
    imports: new Map(),
    useStates: new Map(),
    useEffects: [],
    functions: new Set(),
    handlers: new Set(),
    featureComments: [],
  };

  // 1. Extract imports with regex (robust against duplicates)
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
  const defaultImportRegex = /import\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g;

  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const names = match[1].split(',').map(n => n.trim().split(' as ')[0].trim());
    const source = match[2];
    names.forEach(name => {
      if (name && !features.imports.has(name)) {
        features.imports.set(name, source);
      }
    });
  }

  while ((match = defaultImportRegex.exec(code)) !== null) {
    const name = match[1];
    const source = match[2];
    if (!features.imports.has(name)) {
      features.imports.set(name, source);
    }
  }

  // 2. Extract useState declarations
  const useStateRegex = /const\s*\[\s*(\w+)\s*,\s*set\w+\s*\]\s*=\s*useState[<\w>]*\s*\(([^)]*)\)/g;
  while ((match = useStateRegex.exec(code)) !== null) {
    const stateName = match[1];
    let initValue = match[2].trim().substring(0, 30);
    if (initValue.length === 30) initValue += '...';
    features.useStates.set(stateName, initValue || 'undefined');
  }

  // 3. Extract useEffect count and dependencies
  const useEffectRegex = /useEffect\s*\(\s*(?:async\s*)?\(\s*\)\s*=>/g;
  const useEffectMatches = code.match(useEffectRegex);
  features.useEffects = useEffectMatches ? useEffectMatches.length : 0;

  // 4. Extract function declarations
  const functionRegex = /(?:const|let|var|function)\s+(\w+)\s*=?\s*(?:async\s*)?\(?[^)]*\)?\s*(?:=>|{)/g;
  while ((match = functionRegex.exec(code)) !== null) {
    const funcName = match[1];
    // Skip React hooks and common patterns
    if (funcName.startsWith('use') || funcName === 'App' || funcName === 'useState' || funcName === 'useEffect') continue;

    if (funcName.startsWith('handle') || funcName.startsWith('on') ||
        funcName.includes('Handler') || funcName.includes('Click') || funcName.includes('Change')) {
      features.handlers.add(funcName);
    } else if (/^[a-z]/.test(funcName)) {
      features.functions.add(funcName);
    }
  }

  // 5. Extract feature comments
  const featureCommentRegex = /\/\/\s*(🧬|🚀|V\d+[.:][^\n]*|✨|💡|⚡|🔥|✅|🎯|💎|🛡️|📊|🔧)[^\n]*/g;
  while ((match = featureCommentRegex.exec(code)) !== null) {
    features.featureComments.push(match[0].trim());
  }

  // 6. Extract JSX components used (unique component names)
  const jsxComponentRegex = /<([A-Z][a-zA-Z0-9]*)/g;
  features.jsxComponents = new Set();
  while ((match = jsxComponentRegex.exec(code)) !== null) {
    features.jsxComponents.add(match[1]);
  }

  return features;
}

function compareFeatures(basicFeatures, proFeatures) {
  const report = {
    imports: { onlyInBasic: [], onlyInPro: [], both: [] },
    useStates: { onlyInBasic: [], onlyInPro: [], both: [] },
    useEffects: { basic: basicFeatures.useEffects, pro: proFeatures.useEffects },
    functions: { onlyInBasic: [], onlyInPro: [], both: [] },
    handlers: { onlyInBasic: [], onlyInPro: [], both: [] },
    jsxComponents: { onlyInBasic: [], onlyInPro: [], both: [] },
    featureComments: { onlyInBasic: [], onlyInPro: [] },
  };

  // Compare imports
  for (const [name, source] of basicFeatures.imports) {
    if (proFeatures.imports.has(name)) {
      report.imports.both.push({ name, source });
    } else {
      report.imports.onlyInBasic.push({ name, source });
    }
  }
  for (const [name, source] of proFeatures.imports) {
    if (!basicFeatures.imports.has(name)) {
      report.imports.onlyInPro.push({ name, source });
    }
  }

  // Compare useStates
  for (const [name, init] of basicFeatures.useStates) {
    if (proFeatures.useStates.has(name)) {
      report.useStates.both.push({ name, init });
    } else {
      report.useStates.onlyInBasic.push({ name, init });
    }
  }
  for (const [name, init] of proFeatures.useStates) {
    if (!basicFeatures.useStates.has(name)) {
      report.useStates.onlyInPro.push({ name, init });
    }
  }

  // Compare functions
  for (const name of basicFeatures.functions) {
    if (proFeatures.functions.has(name)) {
      report.functions.both.push(name);
    } else {
      report.functions.onlyInBasic.push(name);
    }
  }
  for (const name of proFeatures.functions) {
    if (!basicFeatures.functions.has(name)) {
      report.functions.onlyInPro.push(name);
    }
  }

  // Compare handlers
  for (const name of basicFeatures.handlers) {
    if (proFeatures.handlers.has(name)) {
      report.handlers.both.push(name);
    } else {
      report.handlers.onlyInBasic.push(name);
    }
  }
  for (const name of proFeatures.handlers) {
    if (!basicFeatures.handlers.has(name)) {
      report.handlers.onlyInPro.push(name);
    }
  }

  // Compare JSX components
  for (const name of basicFeatures.jsxComponents) {
    if (proFeatures.jsxComponents.has(name)) {
      report.jsxComponents.both.push(name);
    } else {
      report.jsxComponents.onlyInBasic.push(name);
    }
  }
  for (const name of proFeatures.jsxComponents) {
    if (!basicFeatures.jsxComponents.has(name)) {
      report.jsxComponents.onlyInPro.push(name);
    }
  }

  // Compare feature comments (unique based on first 60 chars)
  const basicCommentKeys = new Set(basicFeatures.featureComments.map(c => c.substring(0, 60)));
  const proCommentKeys = new Set(proFeatures.featureComments.map(c => c.substring(0, 60)));

  const uniqueBasicComments = new Set();
  for (const comment of basicFeatures.featureComments) {
    const key = comment.substring(0, 60);
    if (!proCommentKeys.has(key) && !uniqueBasicComments.has(key)) {
      uniqueBasicComments.add(key);
      report.featureComments.onlyInBasic.push(comment);
    }
  }

  const uniqueProComments = new Set();
  for (const comment of proFeatures.featureComments) {
    const key = comment.substring(0, 60);
    if (!basicCommentKeys.has(key) && !uniqueProComments.has(key)) {
      uniqueProComments.add(key);
      report.featureComments.onlyInPro.push(comment);
    }
  }

  return report;
}

function printReport(report) {
  console.log('\n' + '='.repeat(100));
  console.log('📊 FEATURE-VERGLEICH: BASIC vs PRO (App.tsx)');
  console.log('='.repeat(100));

  // IMPORTS
  console.log('\n\n📦 IMPORTS');
  console.log('-'.repeat(60));
  if (report.imports.onlyInBasic.length > 0) {
    console.log('\n🔴 NUR IN BASIC (fehlt in PRO):');
    report.imports.onlyInBasic
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(i => console.log(`   - ${i.name.padEnd(30)} from "${i.source}"`));
  } else {
    console.log('\n✅ Alle BASIC-Imports sind in PRO vorhanden');
  }
  if (report.imports.onlyInPro.length > 0) {
    console.log('\n🟢 NUR IN PRO (zusätzlich):');
    report.imports.onlyInPro
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(i => console.log(`   - ${i.name.padEnd(30)} from "${i.source}"`));
  }
  console.log(`\n📊 Gemeinsame Imports: ${report.imports.both.length}`);

  // USE STATES
  console.log('\n\n📊 useState VARIABLEN');
  console.log('-'.repeat(60));
  if (report.useStates.onlyInBasic.length > 0) {
    console.log('\n🔴 NUR IN BASIC (State fehlt in PRO):');
    report.useStates.onlyInBasic
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(s => console.log(`   - ${s.name.padEnd(35)} = ${s.init}`));
  } else {
    console.log('\n✅ Alle BASIC-States sind in PRO vorhanden');
  }
  if (report.useStates.onlyInPro.length > 0) {
    console.log('\n🟢 NUR IN PRO (zusätzlicher State):');
    report.useStates.onlyInPro
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(s => console.log(`   - ${s.name.padEnd(35)} = ${s.init}`));
  }
  console.log(`\n📊 Gemeinsame States: ${report.useStates.both.length}`);

  // USE EFFECTS
  console.log('\n\n⚡ useEffect HOOKS');
  console.log('-'.repeat(60));
  console.log(`   BASIC: ${report.useEffects.basic} useEffects`);
  console.log(`   PRO:   ${report.useEffects.pro} useEffects`);
  if (report.useEffects.basic > report.useEffects.pro) {
    console.log(`   ⚠️ PRO hat ${report.useEffects.basic - report.useEffects.pro} useEffects weniger!`);
  }

  // FUNCTIONS
  console.log('\n\n🔧 FUNKTIONEN');
  console.log('-'.repeat(60));
  if (report.functions.onlyInBasic.length > 0) {
    console.log('\n🔴 NUR IN BASIC (Funktion fehlt in PRO):');
    report.functions.onlyInBasic.sort().forEach(f => console.log(`   - ${f}()`));
  } else {
    console.log('\n✅ Alle BASIC-Funktionen sind in PRO vorhanden');
  }
  if (report.functions.onlyInPro.length > 0) {
    console.log('\n🟢 NUR IN PRO (zusätzliche Funktion):');
    report.functions.onlyInPro.sort().forEach(f => console.log(`   - ${f}()`));
  }
  console.log(`\n📊 Gemeinsame Funktionen: ${report.functions.both.length}`);

  // HANDLERS
  console.log('\n\n🎯 EVENT HANDLERS');
  console.log('-'.repeat(60));
  if (report.handlers.onlyInBasic.length > 0) {
    console.log('\n🔴 NUR IN BASIC (Handler fehlt in PRO):');
    report.handlers.onlyInBasic.sort().forEach(h => console.log(`   - ${h}()`));
  } else {
    console.log('\n✅ Alle BASIC-Handler sind in PRO vorhanden');
  }
  if (report.handlers.onlyInPro.length > 0) {
    console.log('\n🟢 NUR IN PRO (zusätzlicher Handler):');
    report.handlers.onlyInPro.sort().forEach(h => console.log(`   - ${h}()`));
  }
  console.log(`\n📊 Gemeinsame Handlers: ${report.handlers.both.length}`);

  // JSX COMPONENTS
  console.log('\n\n🧩 JSX KOMPONENTEN');
  console.log('-'.repeat(60));
  if (report.jsxComponents.onlyInBasic.length > 0) {
    console.log('\n🔴 NUR IN BASIC (Komponente fehlt in PRO):');
    report.jsxComponents.onlyInBasic.sort().forEach(c => console.log(`   - <${c} />`));
  } else {
    console.log('\n✅ Alle BASIC-Komponenten sind in PRO vorhanden');
  }
  if (report.jsxComponents.onlyInPro.length > 0) {
    console.log('\n🟢 NUR IN PRO (zusätzliche Komponente):');
    report.jsxComponents.onlyInPro.sort().forEach(c => console.log(`   - <${c} />`));
  }
  console.log(`\n📊 Gemeinsame Komponenten: ${report.jsxComponents.both.length}`);

  // FEATURE COMMENTS
  if (report.featureComments.onlyInBasic.length > 0) {
    console.log('\n\n🏷️ FEATURE-MARKIERUNGEN (nur in BASIC)');
    console.log('-'.repeat(60));

    // Group by emoji/version prefix
    const grouped = {};
    report.featureComments.onlyInBasic.forEach(c => {
      const match = c.match(/\/\/\s*(🧬|🚀|V\d+|✨|💡|⚡|🔥|✅|🎯|💎|🛡️|📊|🔧)/);
      const prefix = match ? match[1] : 'Other';
      if (!grouped[prefix]) grouped[prefix] = [];
      if (grouped[prefix].length < 15) { // Limit per group
        grouped[prefix].push(c.substring(0, 90));
      }
    });

    Object.entries(grouped).sort().forEach(([prefix, comments]) => {
      console.log(`\n   ${prefix}:`);
      [...new Set(comments)].forEach(c => console.log(`     ${c}`));
    });
  }

  // SUMMARY
  console.log('\n\n' + '='.repeat(100));
  console.log('📋 ZUSAMMENFASSUNG');
  console.log('='.repeat(100));

  const missingInPro = {
    imports: report.imports.onlyInBasic.length,
    states: report.useStates.onlyInBasic.length,
    functions: report.functions.onlyInBasic.length,
    handlers: report.handlers.onlyInBasic.length,
    components: report.jsxComponents.onlyInBasic.length,
  };

  const totalMissing = Object.values(missingInPro).reduce((a, b) => a + b, 0);

  if (totalMissing === 0) {
    console.log('\n✅ PRO enthält alle Features aus BASIC!');
  } else {
    console.log('\n⚠️ FEATURES AUS BASIC DIE IN PRO FEHLEN:');
    console.log(`   📦 Imports:      ${missingInPro.imports}`);
    console.log(`   📊 States:       ${missingInPro.states}`);
    console.log(`   🔧 Funktionen:   ${missingInPro.functions}`);
    console.log(`   🎯 Handlers:     ${missingInPro.handlers}`);
    console.log(`   🧩 Komponenten:  ${missingInPro.components}`);
    console.log(`   ─────────────────`);
    console.log(`   📊 TOTAL:        ${totalMissing}`);
  }

  const extraInPro = {
    imports: report.imports.onlyInPro.length,
    states: report.useStates.onlyInPro.length,
    functions: report.functions.onlyInPro.length,
    handlers: report.handlers.onlyInPro.length,
    components: report.jsxComponents.onlyInPro.length,
  };

  const totalExtra = Object.values(extraInPro).reduce((a, b) => a + b, 0);

  if (totalExtra > 0) {
    console.log('\n\n🟢 ZUSÄTZLICHE FEATURES IN PRO:');
    console.log(`   📦 Imports:      ${extraInPro.imports}`);
    console.log(`   📊 States:       ${extraInPro.states}`);
    console.log(`   🔧 Funktionen:   ${extraInPro.functions}`);
    console.log(`   🎯 Handlers:     ${extraInPro.handlers}`);
    console.log(`   🧩 Komponenten:  ${extraInPro.components}`);
    console.log(`   ─────────────────`);
    console.log(`   📊 TOTAL:        ${totalExtra}`);
  }

  console.log('\n');
}

// Main execution
console.log('🔍 Analysiere BASIC App.tsx...');
const basicFeatures = extractFeatures(BASIC_PATH);
console.log(`   ✓ ${basicFeatures.imports.size} Imports, ${basicFeatures.useStates.size} States, ${basicFeatures.functions.size} Funktionen`);

console.log('🔍 Analysiere PRO App.tsx...');
const proFeatures = extractFeatures(PRO_PATH);
console.log(`   ✓ ${proFeatures.imports.size} Imports, ${proFeatures.useStates.size} States, ${proFeatures.functions.size} Funktionen`);

console.log('📊 Vergleiche Features...');
const report = compareFeatures(basicFeatures, proFeatures);

printReport(report);

// Save detailed JSON report
const detailedReport = {
  timestamp: new Date().toISOString(),
  paths: { basic: BASIC_PATH, pro: PRO_PATH },
  basic: {
    imports: Array.from(basicFeatures.imports.entries()),
    useStates: Array.from(basicFeatures.useStates.entries()),
    useEffects: basicFeatures.useEffects,
    functions: Array.from(basicFeatures.functions),
    handlers: Array.from(basicFeatures.handlers),
    jsxComponents: Array.from(basicFeatures.jsxComponents),
  },
  pro: {
    imports: Array.from(proFeatures.imports.entries()),
    useStates: Array.from(proFeatures.useStates.entries()),
    useEffects: proFeatures.useEffects,
    functions: Array.from(proFeatures.functions),
    handlers: Array.from(proFeatures.handlers),
    jsxComponents: Array.from(proFeatures.jsxComponents),
  },
  comparison: {
    missingInPro: {
      imports: report.imports.onlyInBasic,
      states: report.useStates.onlyInBasic,
      functions: report.functions.onlyInBasic,
      handlers: report.handlers.onlyInBasic,
      components: report.jsxComponents.onlyInBasic,
    },
    extraInPro: {
      imports: report.imports.onlyInPro,
      states: report.useStates.onlyInPro,
      functions: report.functions.onlyInPro,
      handlers: report.handlers.onlyInPro,
      components: report.jsxComponents.onlyInPro,
    },
  },
};

fs.writeFileSync('ast-comparison-report.json', JSON.stringify(detailedReport, null, 2));
console.log('💾 Detaillierter JSON-Report: ast-comparison-report.json');
