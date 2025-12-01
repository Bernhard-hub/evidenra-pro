/**
 * Script to add BASIC version features to PRO version
 * - Context Menu for Input Fields
 * - Genesis State Variables
 * - Genesis Initialization
 * - Genesis Button
 * - Genesis Dashboard Modal
 * - API Status Widget
 */

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/renderer/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

console.log('📝 Adding BASIC features to PRO version...');

// 1. Add Context Menu Handler after the imports (before "// Document interface")
const contextMenuCode = `
// ==========================================
// 🚀 V41: CONTEXT MENU SUPPORT FOR ALL INPUT FIELDS
// ==========================================
/**
 * Universal Context Menu Handler for Input/Textarea Fields
 * Provides native-like right-click menu with Cut/Copy/Paste/Select All
 */
const handleInputContextMenu = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.preventDefault();

  const target = e.currentTarget;
  const hasSelection = target.selectionStart !== target.selectionEnd;
  const hasValue = target.value.length > 0;

  // Create custom context menu
  const menu = document.createElement('div');
  menu.className = 'fixed z-[99999] bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl py-2 min-w-[160px]';
  menu.style.left = \`\${e.clientX}px\`;
  menu.style.top = \`\${e.clientY}px\`;

  const menuItems = [
    {
      label: 'Ausschneiden',
      icon: '✂️',
      action: () => {
        if (hasSelection) {
          const text = target.value.substring(target.selectionStart!, target.selectionEnd!);
          navigator.clipboard.writeText(text);
          document.execCommand('delete');
        }
      },
      disabled: !hasSelection || target.readOnly
    },
    {
      label: 'Kopieren',
      icon: '📋',
      action: () => {
        if (hasSelection) {
          const text = target.value.substring(target.selectionStart!, target.selectionEnd!);
          navigator.clipboard.writeText(text);
        }
      },
      disabled: !hasSelection
    },
    {
      label: 'Einfügen',
      icon: '📌',
      action: async () => {
        if (!target.readOnly) {
          try {
            const text = await navigator.clipboard.readText();
            const start = target.selectionStart!;
            const end = target.selectionEnd!;
            const before = target.value.substring(0, start);
            const after = target.value.substring(end);
            target.value = before + text + after;

            // Trigger onChange event
            const event = new Event('input', { bubbles: true });
            target.dispatchEvent(event);

            // Set cursor position
            target.selectionStart = target.selectionEnd = start + text.length;
            target.focus();
          } catch (err) {
            console.error('Failed to read clipboard:', err);
          }
        }
      },
      disabled: target.readOnly
    },
    {
      label: 'Alles auswählen',
      icon: '🔍',
      action: () => {
        target.select();
      },
      disabled: !hasValue
    }
  ];

  menuItems.forEach((item, index) => {
    const menuItem = document.createElement('div');
    menuItem.className = \`px-4 py-2 text-white text-sm cursor-pointer transition-all duration-200 flex items-center gap-3 \${
      item.disabled
        ? 'opacity-40 cursor-not-allowed'
        : 'hover:bg-white/10 hover:text-blue-400'
    }\`;
    menuItem.innerHTML = \`<span class="text-base">\${item.icon}</span><span>\${item.label}</span>\`;

    if (!item.disabled) {
      menuItem.onclick = () => {
        item.action();
        document.body.removeChild(menu);
      };
    }

    menu.appendChild(menuItem);

    // Add separator after Copy
    if (index === 1) {
      const separator = document.createElement('div');
      separator.className = 'h-px bg-white/10 my-1';
      menu.appendChild(separator);
    }
  });

  document.body.appendChild(menu);

  // Close menu on click outside
  const closeMenu = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      if (document.body.contains(menu)) {
        document.body.removeChild(menu);
      }
      document.removeEventListener('click', closeMenu);
    }
  };

  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 10);
};

`;

// Insert context menu before "// Document interface"
if (!content.includes('handleInputContextMenu')) {
  content = content.replace(
    '// Document interface for better type safety',
    contextMenuCode + '// Document interface for better type safety'
  );
  console.log('✅ Added Context Menu Handler');
} else {
  console.log('⏭️ Context Menu already exists');
}

// 2. Add Genesis State Variables after activeTab state
const genesisStateCode = `
  // 🧬 Genesis Engine State Variables (from BASIC)
  const [genesis, setGenesis] = useState<any>(null);
  const [genesisStats, setGenesisStats] = useState<any>(null);
  const [showGenesisDashboard, setShowGenesisDashboard] = useState<boolean>(false);
  const [genesisAPIWrapper, setGenesisAPIWrapper] = useState<any>(null);

  // 🚀 API Rate Status for Dashboard Widget
  const [apiRateStatus, setApiRateStatus] = useState({
    usage: 0,
    isOverloaded: false,
    cooldownTime: 0,
    lastError: null as string | null,
    successStreak: 0,
    reliabilityScore: 100
  });
`;

if (!content.includes('const [genesis, setGenesis]')) {
  content = content.replace(
    "const [activeTab, setActiveTab] = useState<string>('dashboard');",
    "const [activeTab, setActiveTab] = useState<string>('dashboard');" + genesisStateCode
  );
  console.log('✅ Added Genesis State Variables');
} else {
  console.log('⏭️ Genesis State already exists');
}

// 3. Find a good place to add Genesis initialization useEffect
// We'll add it after the component state declarations
const genesisInitCode = `
  // 🧬 GENESIS INITIALIZATION: Self-Evolving AI System
  useEffect(() => {
    async function initGenesis() {
      console.log('🧬 Initializing GENESIS for EVIDENRA PRO...');

      try {
        const g = new GenesisIntegration({
          mutationRate: 0.15,
          crossoverRate: 0.7,
          populationSize: 50,
          extinctionThreshold: 0.3,
          evolutionInterval: 30000,
          metaLearningInterval: 60000,
          selfModificationInterval: 300000
        });

        await g.initializeAndStart();
        setGenesis(g);

        // Initialize GAPES Wrapper
        const wrapper = new GenesisAPIWrapper(g);
        setGenesisAPIWrapper(wrapper);
        console.log('✅ GAPES Wrapper initialized');

        // Event Listeners
        g.on('onEvolution', (data: any) => {
          console.log(\`🧬 Evolution: Generation \${data.generation}\`);
        });

        g.on('onEmergence', (data: any) => {
          console.log('🌟 EMERGENCE: New capability discovered!', data);
        });

        g.on('onBreakthrough', (data: any) => {
          console.log('💥 BREAKTHROUGH: Genesis improved itself!', data);
        });

        console.log('✅ GENESIS ready for EVIDENRA PRO');

        // Update stats periodically
        const interval = setInterval(() => {
          try {
            const stats = g.getStats();
            setGenesisStats(stats);
          } catch (e) {
            // Ignore errors during stats update
          }
        }, 1000);

        return () => clearInterval(interval);

      } catch (error) {
        console.error('❌ Genesis initialization failed:', error);
      }
    }

    initGenesis();
  }, []);

  // 🚀 API Rate Status Update
  useEffect(() => {
    const updateApiStatus = () => {
      if (genesisAPIWrapper) {
        try {
          const stats = genesisAPIWrapper.getStats();
          setApiRateStatus({
            usage: Math.min(100, stats.totalCalls || 0),
            isOverloaded: stats.totalCalls > 90,
            cooldownTime: 0,
            lastError: null,
            successStreak: stats.streak || 0,
            reliabilityScore: Math.round((stats.successRate || 1) * 100)
          });
        } catch (e) {
          // Use default values
        }
      }
    };

    const interval = setInterval(updateApiStatus, 2000);
    return () => clearInterval(interval);
  }, [genesisAPIWrapper]);
`;

// Find a place after state declarations to add the useEffect
// Look for the first useEffect in the component
if (!content.includes('GENESIS INITIALIZATION')) {
  // Find the pattern of first useEffect and insert before it
  const firstUseEffectMatch = content.match(/(\n  \/\/ .*\n  useEffect\(\(\) => \{)/);
  if (firstUseEffectMatch) {
    content = content.replace(
      firstUseEffectMatch[0],
      genesisInitCode + firstUseEffectMatch[0]
    );
    console.log('✅ Added Genesis Initialization useEffect');
  } else {
    console.log('⚠️ Could not find place to insert Genesis useEffect');
  }
} else {
  console.log('⏭️ Genesis Initialization already exists');
}

// Save the file
fs.writeFileSync(appPath, content, 'utf8');
console.log('\n✅ All changes saved to App.tsx');
console.log('\n📋 Next steps:');
console.log('1. Add Genesis Button in header (manual)');
console.log('2. Add Genesis Dashboard Modal (manual)');
console.log('3. Add API Status Widget in sidebar (manual)');
console.log('4. Run: npm run build');
