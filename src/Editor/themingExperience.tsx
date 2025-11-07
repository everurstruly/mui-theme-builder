import SampleCanvasObjectsTree from "./ExplorerPanel/Menus/SampleCanvasObjectsTree";
import MuiComponentsTree from "./ExplorerPanel/Menus/MuiComponentsTree";
import PrimitiesPropertiesPanelBody from "./PropertiesPanel/PropertiesPanelBody/BrandingPropertiesPanelBody";
import SystemPropertiesPanelBody from "./PropertiesPanel/PropertiesPanelBody/CodingPropertiesPanelBody";
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

export const editorExperiences = {
  primitives: {
    icon: AutoFixHighOutlined,
    id: "primitives",
    title: "Brand Design",

    navigationPanelTitle: "Previews",
    renderNavigationPanel: () => <SampleCanvasObjectsTree />,

    propsPanelTitle: "Properties",
    renderPropsPanel: () => <PrimitiesPropertiesPanelBody />,
  } as EditorExperience,

  components: {
    icon: GridViewOutlined,
    id: "components",
    title: "MUI Override",

    navigationPanelTitle: "MUI Components",
    renderNavigationPanel: () => <MuiComponentsTree />,

    propsPanelTitle: "Editor",
    renderPropsPanel: () => <SystemPropertiesPanelBody />,
  } as EditorExperience,
} as const;

export type EditorExperienceId = keyof typeof editorExperiences;
