import SampleCanvasObjectsTree from "./Explorer/Menus/SampleCanvasObjectsTree";
import MuiComponentsTree from "./Explorer/Menus/MuiComponentsTree";
import BrandingPropertiesPanel from "./Properties/BrandingPropertiesPanel";
import DeveloperPropertiesPanel from "./Properties/DeveloperPropertiesPanel";
import { AutoFixHighOutlined, GridViewOutlined } from "@mui/icons-material";

export type EditorExperience = {
  id: string;
  title: string;
  icon: typeof AutoFixHighOutlined;
  navigationPanelTitle?: string;
  renderNavigationPanel?: () => React.ReactNode;
  propsPanelTitle?: string;
  renderPropsPanel?: () => React.ReactNode;
};

export const editorDesignExperience = {
  primitives: {
    icon: AutoFixHighOutlined,
    id: "primitives",
    title: "Brand Design",

    navigationPanelTitle: "Previews",
    renderNavigationPanel: () => <SampleCanvasObjectsTree />,

    propsPanelTitle: "Properties",
    renderPropsPanel: () => <BrandingPropertiesPanel />,
  } as EditorExperience,

  components: {
    icon: GridViewOutlined,
    id: "components",
    title: "Override",

    navigationPanelTitle: "MUI Components",
    renderNavigationPanel: () => <MuiComponentsTree />,

    propsPanelTitle: "Editor",
    renderPropsPanel: () => <DeveloperPropertiesPanel />,
  } as EditorExperience,
} as const;

export type EditorDesignExperienceId = keyof typeof editorDesignExperience;
