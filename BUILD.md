# EVIDENRA Professional - Build Instructions

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Operating System Requirements**:
  - Windows: Windows 10/11 (64-bit) for Windows builds
  - macOS: macOS 10.15+ for macOS builds (can only build on macOS)
  - Linux: Ubuntu 20.04+ or similar for Linux builds (can only build on Linux)

## Installation

```bash
cd evidenra-professional-v2
npm install
```

## Development

### Start Development Server

```bash
npm run dev          # Start webpack dev server on http://localhost:8080
npm run electron-dev # Start Electron in development mode
```

### Code Quality Tools

```bash
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format all code with Prettier
npm run format:check # Verify code formatting
npm run type-check   # Check TypeScript types
```

## Production Builds

### 1. Build Application Assets

```bash
npm run build-prod   # Creates optimized webpack bundle in dist/
```

**Output**:
- `dist/renderer.js` (~21 MB)
- `dist/index.html`
- Total bundled: ~7.57 MB

### 2. Create Platform-Specific Executables

#### Windows Portable EXE

```bash
npm run dist:win
```

**Output**:
- File: `release/EVIDENRA-Professional.exe`
- Size: ~100 MB
- Type: Portable executable (no installation required)
- Architecture: x64
- Requirements: Windows 10/11 (64-bit)

**Note**: First run will show "Windows protected your PC" warning because the app is not code-signed. Click "More info" → "Run anyway".

#### macOS DMG (Intel + Apple Silicon)

```bash
npm run dist:mac     # Can only be run on macOS
```

**Output**:
- File: `release/EVIDENRA-Professional.dmg`
- Size: ~120-150 MB
- Type: DMG installer
- Architectures: x64 (Intel) + arm64 (Apple Silicon)
- Requirements: macOS 10.15+

**Limitation**: macOS builds can only be created on macOS machines due to code signing requirements.

#### Linux (AppImage + DEB)

```bash
npm run dist:linux   # Can only be run on Linux
```

**Output**:
- `release/EVIDENRA-Professional-x64.AppImage` (~120 MB)
- `release/EVIDENRA-Professional-amd64.deb` (~110 MB)
- Architecture: x64
- Requirements: Ubuntu 20.04+ or compatible

**Limitation**: Linux builds can only be created on Linux machines.

#### All Platforms (from appropriate OS)

```bash
npm run dist:all     # Builds all targets for current OS
```

## Build Configuration

### Multi-Platform Setup (package.json)

```json
{
  "build": {
    "appId": "com.evidenra.professional",
    "productName": "EVIDENRA Professional",
    "directories": {
      "output": "release"
    },
    "win": {
      "target": "portable",
      "arch": ["x64"]
    },
    "mac": {
      "target": "dmg",
      "arch": ["x64", "arm64"],
      "category": "public.app-category.education"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Education"
    },
    "files": [
      "dist/**/*",
      "src/main/**/*",
      "src/preload/**/*",
      "package.json"
    ]
  }
}
```

## Troubleshooting

### White Screen on Windows Portable EXE

**Problem**: App shows white screen after launch

**Solution**: Fixed in v2.0 by correcting HTML path resolution in production:
```javascript
// src/main/main.js
const htmlPath = path.join(__dirname, '../../dist/index.html');
mainWindow.loadFile(htmlPath).catch(err => {
  const fallbackPath = path.join(app.getAppPath(), 'dist/index.html');
  mainWindow.loadFile(fallbackPath);
});
```

### @napi-rs/canvas-android-arm64 Error

**Problem**: `ENOENT: no such file or directory, scandir 'node_modules\@napi-rs\canvas-android-arm64'`

**Solution**:
```bash
mkdir -p node_modules/@napi-rs/canvas-android-arm64
```

Also added to package.json exclusions:
```json
"files": [
  "!node_modules/@napi-rs/canvas-android-arm64/**/*",
  "!node_modules/@napi-rs/canvas-*/**/*"
]
```

### "Unknown Publisher" Warning (Windows)

**Problem**: Windows shows security warning on first run

**Cause**: Application is not code-signed (requires expensive certificate)

**User Action**: Click "More info" → "Run anyway"

**For Production**: Purchase code signing certificate from Sectigo/DigiCert (~$200-500/year)

## Build Artifacts

### Directory Structure

```
evidenra-professional-v2/
├── dist/                    # Webpack build output
│   ├── renderer.js         # (~21 MB)
│   └── index.html
├── release/                 # Electron builds
│   ├── EVIDENRA-Professional.exe         # Windows portable
│   ├── EVIDENRA-Professional.dmg         # macOS
│   ├── EVIDENRA-Professional-x64.AppImage # Linux AppImage
│   └── EVIDENRA-Professional-amd64.deb   # Linux DEB
└── release/win-unpacked/    # Unpacked Windows build
    └── EVIDENRA Professional.exe
```

### File Sizes

| Platform | Format | Size | Compressed |
|----------|--------|------|------------|
| Windows | .exe (portable) | ~100 MB | - |
| macOS | .dmg | ~120-150 MB | ~100 MB |
| Linux | .AppImage | ~120 MB | - |
| Linux | .deb | ~110 MB | ~90 MB |

## Security Features

### Enabled in v2.0

- ✅ **Web Security**: `webSecurity: true` (protects against XSS/CSRF)
- ✅ **Sandbox**: `sandbox: true` (process isolation)
- ✅ **Context Isolation**: `contextIsolation: true` (secure IPC)
- ✅ **DevTools**: Only enabled in development mode

### Disabled for Security

- ❌ `--disable-web-security` flag removed
- ❌ `nodeIntegration: false` (no direct Node.js access in renderer)

## Testing

### Unit Tests

```bash
npm test              # Run tests with Vitest
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

**Master Thesis Generator Tests**: 30 tests, 100% pass rate

### Manual Testing Checklist

After building, test these features:

#### Windows EXE
- [ ] App launches without white screen
- [ ] All tabs load correctly
- [ ] API connections work (Wissenssynthese)
- [ ] File uploads/downloads work
- [ ] PDF export works
- [ ] Master Thesis Generator works
- [ ] Settings persist across restarts

#### macOS DMG
- [ ] DMG mounts correctly
- [ ] App can be dragged to Applications
- [ ] First launch works (Gatekeeper)
- [ ] All core features work

#### Linux AppImage/DEB
- [ ] AppImage has execute permissions
- [ ] DEB installs correctly
- [ ] Desktop integration works
- [ ] All core features work

## Release Checklist

Before distributing builds:

1. [ ] Update version in package.json
2. [ ] Update CHANGELOG-V2.md
3. [ ] Run `npm run lint` - no errors
4. [ ] Run `npm run type-check` - no errors
5. [ ] Run `npm test` - all tests pass
6. [ ] Build for target platforms
7. [ ] Test executables manually
8. [ ] Create Git tag (e.g., `v2.0.0`)
9. [ ] Create GitHub release with binaries
10. [ ] Update documentation

## Cross-Platform Build Matrix

| Build Platform | Can Build For |
|----------------|---------------|
| Windows | ✅ Windows |
| macOS | ✅ macOS, ⚠️ Windows (unsigned), ⚠️ Linux |
| Linux | ✅ Linux, ⚠️ Windows (unsigned) |

**Legend**:
- ✅ Fully supported
- ⚠️ Possible but not recommended (cross-compilation issues)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build

on: [push, pull_request]

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run dist:win
      - uses: actions/upload-artifact@v3
        with:
          name: windows-build
          path: release/*.exe

  build-mac:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run dist:mac
      - uses: actions/upload-artifact@v3
        with:
          name: mac-build
          path: release/*.dmg

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run dist:linux
      - uses: actions/upload-artifact@v3
        with:
          name: linux-build
          path: release/*.{AppImage,deb}
```

## Performance Optimization

### Production Build Optimizations

- **Webpack mode: production** - minification enabled
- **Tree shaking** - removes unused code
- **Code splitting** - separates vendor bundles
- **Asset optimization** - compresses images/fonts

### Bundle Analysis

To analyze bundle size:

```bash
npm install --save-dev webpack-bundle-analyzer
```

Add to webpack.config.js:
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

## Support

For build issues:
1. Check CHANGELOG-V2.md for known issues
2. Review console logs in DevTools
3. Check electron-builder logs in `release/builder-*.log`
4. Search GitHub issues

## Version History

- **v2.0.0** (2025-10-20)
  - Master Thesis Generator feature
  - Multi-platform build support
  - Fixed white screen bug in portable EXE
  - Security hardening (web security enabled)

- **v1.0.0** (2024)
  - Initial release
  - Basic qualitative research features

---

**Generated**: 2025-10-20
**Build System**: electron-builder 26.0.12
**Electron**: 37.7.0
**Node**: 18.x+
