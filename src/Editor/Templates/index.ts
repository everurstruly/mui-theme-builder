/**
 * Templates Module
 * 
 * Central export point for all theme templates and registry utilities.
 */

export { default as templatesRegistry } from "./registry";
export * from "./registry";

// Re-export individual templates for direct access if needed
export { default as materialTheme } from "./material";
export { default as modernTheme } from "./modern";
export { default as minimalTheme } from "./minimal";
