/**
 * Feature flags configuration
 * 
 * Control feature availability across different environments.
 * Set via environment variables or import.meta.env.VITE_* variables
 * 
 * Usage:
 * - Development: VITE_FF_VERSION_HISTORY=true npm run dev
 * - Production builds: Set env vars before build
 * - At runtime: import { featureFlags } from '@/config/featureFlags'
 */

type FeatureFlag = boolean;

interface FeatureFlagsConfig {
  /** Version history feature: save, view, and restore design versions */
  SHOW_VERSION_HISTORY: FeatureFlag;
}

/**
 * Get feature flag value from environment variable
 * Supports: VITE_FF_* environment variables
 */
function getFlag(flagName: string, defaultValue: boolean): boolean {
  const key = `VITE_FF_${flagName}`;
  const envValue = import.meta.env[key];

  if (envValue === undefined || envValue === "") {
    return defaultValue;
  }

  // Handle various true/false string values
  if (envValue === "true" || envValue === "1" || envValue === "yes") {
    return true;
  }
  if (envValue === "false" || envValue === "0" || envValue === "no") {
    return false;
  }

  return defaultValue;
}

/**
 * Feature flags configuration with defaults
 * Override with environment variables: VITE_FF_SHOW_VERSION_HISTORY=true
 */
export const featureFlags: FeatureFlagsConfig = {
  // Enable version history feature
  // Default: true in development, controlled by env in production
  SHOW_VERSION_HISTORY: getFlag("SHOW_VERSION_HISTORY", import.meta.env.DEV),
};

/**
 * Helper to check if feature is enabled
 * @example
 * if (isFeatureEnabled("SHOW_VERSION_HISTORY")) {
 *   // Show version history UI
 * }
 */
export function isFeatureEnabled(flag: keyof FeatureFlagsConfig): boolean {
  return featureFlags[flag];
}
