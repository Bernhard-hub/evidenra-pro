/**
 * Add Genesis Button, Modal, and API Status Widget to PRO
 */

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/renderer/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

console.log('📝 Adding Genesis UI components to PRO version...');

// 1. Add Genesis Button after DevTools button
const genesisButtonCode = `
            {/* 🧬 Genesis Dashboard Toggle Button */}
            <button
              onClick={() => setShowGenesisDashboard(!showGenesisDashboard)}
              className="bg-gradient-to-br from-purple-600/90 to-indigo-700/90 backdrop-blur-xl border border-purple-400/30 rounded-2xl text-white hover:bg-purple-700/80 transition-all duration-300 px-4 py-2 hover:scale-105 font-medium flex items-center gap-3 shadow-lg hover:shadow-purple-500/50"
              title={language === 'de' ? '🧬 Genesis Dashboard öffnen' : '🧬 Open Genesis Dashboard'}
            >
              <Brain className="w-4 h-4 animate-pulse" />
              {genesisStats ? (
                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Genesis Gen {genesisStats.generation || 0}</span>
                    {genesisStats.isRunning && (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] text-green-300 font-semibold">ACTIVE</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-purple-200">
                    Consciousness: {(genesisStats.consciousness?.selfAwareness * 100 || 0).toFixed(0)}%
                  </span>
                </div>
              ) : (
                <span className="text-xs">Genesis</span>
              )}
            </button>
`;

// Find the DevTools button close tag and insert after it
if (!content.includes('Genesis Dashboard Toggle Button')) {
  content = content.replace(
    /(\{devToolsOpen \? 'Console ON' : 'Console'\}\s*<\/button>)\s*\n\s*\n\s*(\{\/\* Enhanced License Status \*\/)/,
    `$1\n${genesisButtonCode}\n            $2`
  );
  console.log('✅ Added Genesis Button');
} else {
  console.log('⏭️ Genesis Button already exists');
}

// 2. Add Genesis Dashboard Modal before Enhanced Notifications
const genesisDashboardModal = `
        {/* 🧬 GENESIS DASHBOARD MODAL */}
        {showGenesisDashboard && genesis && (
          <div
            className="fixed inset-0 bg-gradient-to-br from-black/80 via-purple-900/40 to-black/80 backdrop-blur-md z-[9998] flex items-center justify-center p-4"
            onClick={() => setShowGenesisDashboard(false)}
          >
            <div
              className="w-[95vw] max-w-[1800px] max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl
                         bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl
                         border border-purple-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGenesisDashboard(false)}
                className="fixed top-8 right-8 z-[10000] bg-gradient-to-br from-purple-600/40 to-pink-600/40 hover:from-purple-500/60 hover:to-pink-500/60
                           text-white rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg
                           border border-white/10 backdrop-blur-sm"
                title="Close Genesis Dashboard"
              >
                <X className="w-6 h-6" />
              </button>
              <GenesisDashboard
                genesisEngine={genesis.getEngine ? genesis.getEngine() : genesis}
                genesisAPIWrapper={genesisAPIWrapper}
              />
            </div>
          </div>
        )}

`;

if (!content.includes('GENESIS DASHBOARD MODAL')) {
  content = content.replace(
    '{/* Enhanced Notifications */}',
    genesisDashboardModal + '        {/* Enhanced Notifications */}'
  );
  console.log('✅ Added Genesis Dashboard Modal');
} else {
  console.log('⏭️ Genesis Dashboard Modal already exists');
}

// 3. Add API Status Widget in sidebar
// Find the sidebar section and add API Status widget
const apiStatusWidget = `
                {/* 🚀 API Status Dashboard Widget */}
                <div className="bg-black/20 rounded-2xl p-3 border border-white/10 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-semibold text-white">API Status</span>
                    </div>
                    <div className={\`w-2 h-2 rounded-full \${
                      apiRateStatus.isOverloaded ? 'bg-red-400' :
                      apiRateStatus.usage > 70 ? 'bg-yellow-400' : 'bg-green-400'
                    } animate-pulse\`}></div>
                  </div>

                  {!sidebarCollapsed && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/70">Usage</span>
                        <span className={\`font-bold \${
                          apiRateStatus.usage > 80 ? 'text-red-400' :
                          apiRateStatus.usage > 60 ? 'text-yellow-400' : 'text-green-400'
                        }\`}>{apiRateStatus.usage}%</span>
                      </div>

                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className={\`h-1.5 rounded-full transition-all duration-500 \${
                            apiRateStatus.usage > 80 ? 'bg-red-400' :
                            apiRateStatus.usage > 60 ? 'bg-yellow-400' : 'bg-green-400'
                          }\`}
                          style={{ width: \`\${Math.min(100, apiRateStatus.usage)}%\` }}
                        ></div>
                      </div>

                      {apiRateStatus.cooldownTime > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-400">
                          <Clock className="w-3 h-3" />
                          <span>Cooldown: {apiRateStatus.cooldownTime}s</span>
                        </div>
                      )}

                      <div className="flex justify-between text-xs">
                        <span className="text-white/70">Streak</span>
                        <span className="text-green-400 font-bold">🔥 {apiRateStatus.successStreak}</span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-white/70">Reliability</span>
                        <span className={\`font-bold \${
                          apiRateStatus.reliabilityScore > 90 ? 'text-green-400' :
                          apiRateStatus.reliabilityScore > 70 ? 'text-yellow-400' : 'text-red-400'
                        }\`}>{apiRateStatus.reliabilityScore}%
                        {apiRateStatus.reliabilityScore > 95 ? ' 🏆' :
                         apiRateStatus.reliabilityScore > 85 ? ' ⭐' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
`;

// Find a good place in sidebar to add API status widget
// Look for "EVIDENRA Professional" title or similar sidebar element
if (!content.includes('API Status Dashboard Widget')) {
  // Find the sidebar title section and add after it
  const sidebarMatch = content.match(/(Professional v3\.0.*?<\/p>)/s);
  if (sidebarMatch) {
    content = content.replace(
      sidebarMatch[0],
      sidebarMatch[0] + apiStatusWidget
    );
    console.log('✅ Added API Status Widget');
  } else {
    console.log('⚠️ Could not find sidebar location for API Status Widget');
  }
} else {
  console.log('⏭️ API Status Widget already exists');
}

// Save the file
fs.writeFileSync(appPath, content, 'utf8');
console.log('\n✅ All UI components saved to App.tsx');
