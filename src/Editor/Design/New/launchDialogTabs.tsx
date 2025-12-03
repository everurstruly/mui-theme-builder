import * as React from "react";
import TemplateMethod from "./Template/Template";
import type { LaunchDialog } from "./useLaunchDialog";

export const launchDialogTabs: {
  value: LaunchDialog;
  label: string;
  Component: React.ComponentType<any>;
}[] = [
  { value: "template", label: "Built-in Templates", Component: TemplateMethod },
];
