import * as React from "react";
import TemplateMethod from "./Template/Template";
import BlankMethod from "./Blank/Blank";
import type { StrategiesDialog } from "./useDialogs";

export const launchDialogTabs: {
  value: StrategiesDialog;
  label: string;
  Component: React.ComponentType<any>;
}[] = [
  { value: "template", label: "Built-in Templates", Component: TemplateMethod },
  { value: "blank", label: "Blank", Component: BlankMethod },
];
