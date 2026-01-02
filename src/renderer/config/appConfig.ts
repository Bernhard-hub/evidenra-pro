/**
 * EVIDENRA App Configuration
 * Central configuration for version and app settings
 * Version is automatically read from package.json
 */

// Import version from package.json (webpack resolves this)
const packageVersion = require('../../../package.json').version;

export const APP_CONFIG = {
  // Version - automatically synced from package.json
  VERSION: packageVersion,
  VERSION_DISPLAY: `v${packageVersion}`,

  // Product Info
  PRODUCT_NAME: 'EVIDENRA Professional',
  PRODUCT_SHORT: 'Pro',

  // Trial Settings
  TRIAL_DAYS: 30,

  // Feature Flags
  FEATURES: {
    CLOUD_SYNC: true,
    TEAM_FEATURES: false,
    ADMIN_PANEL: false,
  }
} as const;

// Export individual values for convenience
export const APP_VERSION = APP_CONFIG.VERSION;
export const APP_VERSION_DISPLAY = APP_CONFIG.VERSION_DISPLAY;
export const PRODUCT_NAME = APP_CONFIG.PRODUCT_NAME;
