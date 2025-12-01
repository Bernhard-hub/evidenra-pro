// Add Provider Choice UI before the provider dropdown
const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/renderer/App.tsx', 'utf8');

// Find the line before provider dropdown and add provider choice UI
const providerChoiceUI = `                    {/* Provider Choice: API Key vs Bridge */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4 text-white">
                        {language === 'de' ? '🎯 Wie möchten Sie Claude nutzen?' : '🎯 How do you want to use Claude?'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* API Key Option */}
                        <div
                          onClick={() => {
                            setApiSettings(prev => ({
                              ...prev,
                              provider: 'anthropic'
                            }));
                          }}
                          className={\`cursor-pointer p-4 rounded-xl border-2 transition-all \${
                            apiSettings.provider === 'anthropic'
                              ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                              : 'border-gray-600 bg-gray-800 bg-opacity-40 hover:border-gray-500'
                          }\`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${
                              apiSettings.provider === 'anthropic' ? 'bg-purple-500' : 'bg-gray-700'
                            }\`}>
                              <Key className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">
                                {language === 'de' ? 'Anthropic API Key' : 'Anthropic API Key'}
                              </h4>
                              <p className="text-sm text-gray-300 mb-2">
                                {language === 'de'
                                  ? 'Direkter API-Zugang mit eigenem Key'
                                  : 'Direct API access with your own key'}
                              </p>
                              <div className="text-xs text-gray-400 space-y-1">
                                <div className="flex items-start gap-1">
                                  <Check className="w-3 h-3 mt-0.5 text-green-400" />
                                  <span>{language === 'de' ? 'Volle Kontrolle & Transparenz' : 'Full control & transparency'}</span>
                                </div>
                                <div className="flex items-start gap-1">
                                  <Check className="w-3 h-3 mt-0.5 text-green-400" />
                                  <span>{language === 'de' ? 'Pay-per-use (~$0.003/1K tokens)' : 'Pay-per-use (~$0.003/1K tokens)'}</span>
                                </div>
                                <div className="flex items-start gap-1">
                                  <Check className="w-3 h-3 mt-0.5 text-green-400" />
                                  <span>{language === 'de' ? 'Benötigt: console.anthropic.com Account' : 'Requires: console.anthropic.com account'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bridge Option */}
                        <div
                          onClick={() => {
                            setApiSettings(prev => ({
                              ...prev,
                              provider: 'bridge',
                              model: 'claude-max'
                            }));
                          }}
                          className={\`cursor-pointer p-4 rounded-xl border-2 transition-all \${
                            apiSettings.provider === 'bridge'
                              ? 'border-blue-400 bg-blue-500 bg-opacity-20'
                              : 'border-gray-600 bg-gray-800 bg-opacity-40 hover:border-gray-500'
                          }\`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${
                              apiSettings.provider === 'bridge' ? 'bg-blue-500' : 'bg-gray-700'
                            }\`}>
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">
                                {language === 'de' ? 'Claude Browser Extension' : 'Claude Browser Extension'}
                              </h4>
                              <p className="text-sm text-gray-300 mb-2">
                                {language === 'de'
                                  ? 'Nutzt dein bestehendes Claude.ai Abo'
                                  : 'Uses your existing Claude.ai subscription'}
                              </p>
                              <div className="text-xs text-gray-400 space-y-1">
                                <div className="flex items-start gap-1">
                                  <Check className="w-3 h-3 mt-0.5 text-green-400" />
                                  <span>{language === 'de' ? 'Kein extra API Key nötig' : 'No extra API key needed'}</span>
                                </div>
                                <div className="flex items-start gap-1">
                                  <Check className="w-3 h-3 mt-0.5 text-green-400" />
                                  <span>{language === 'de' ? 'Nutzt Claude Pro/Max Subscription' : 'Uses Claude Pro/Max subscription'}</span>
                                </div>
                                <div className="flex items-start gap-1">
                                  <Check className="w-3 h-3 mt-0.5 text-green-400" />
                                  <span>{language === 'de' ? 'Browser-Extension erforderlich' : 'Browser extension required'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info Box */}
                      <div className="mt-4 p-3 bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-300 mt-0.5" />
                          <p className="text-sm text-blue-200">
                            {language === 'de'
                              ? '💡 Tipp: Wähle API Key für volle Kontrolle oder Bridge für einfache Nutzung mit bestehender Claude Subscription.'
                              : '💡 Tip: Choose API Key for full control or Bridge for easy use with your existing Claude subscription.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">`;

// Replace the line before provider dropdown
content = content.replace(
  /<div className="space-y-4">\s+<div>\s+<label className="block text-sm font-medium mb-2 opacity-75">Provider<\/label>/,
  providerChoiceUI + '\\n                      <div>\\n                        <label className="block text-sm font-medium mb-2 opacity-75">Provider (Advanced)</label>'
);

// Write back
fs.writeFileSync('src/renderer/App.tsx', content, 'utf8');

console.log('✅ Provider Choice UI added!');
