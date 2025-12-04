import { getTemplateById } from "../../../Templates";
import { serializeThemeOptions } from "../../compiler";
import { createFreshSnapshot } from "../../storage/createFreshSnapshot";
import { validateSnapshot } from "../../storage/validateSnapshot";
import type { LoadData } from "../types";

/**
 * Load from template
 */

export async function loadFromTemplate(
  templateId: string
): Promise<LoadData> {
  const template = getTemplateById(templateId);
  if (!template) {
    throw {
      code: "TEMPLATE_MISSING",
      message: "Template not found",
    };
  }

  const themeCode = serializeThemeOptions(template.themeOptions);
  const themeDsl = JSON.parse(themeCode);

  // Use factory to ensure consistency
  const snapshot = createFreshSnapshot({
    id: '', // Empty = unsaved/template
    title: template.label,
    baseThemeDsl: themeDsl,
    templateId,
    sourceLabel: template.label,
  });

  // Validate before returning
  validateSnapshot(snapshot, "template");

  return {
    snapshot,
    metadata: {
      title: template.label,
      sourceType: "template",
    },
  };
}
