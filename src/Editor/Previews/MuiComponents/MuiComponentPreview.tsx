import { type ComponentType } from "react";
import * as MuiMaterial from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

/**
 * Default props for common MUI components to make them render nicely in preview
 */
const getDefaultProps = (componentName: string): Record<string, unknown> => {
  // Buttons
  if (componentName === "Button") {
    return { children: "Button", variant: "contained" };
  }
  if (componentName === "IconButton") {
    return { children: "✕" };
  }
  if (componentName === "Fab") {
    return { children: "+" };
  }

  // Text & Typography
  if (componentName === "Typography") {
    return { children: "Typography Component" };
  }
  if (componentName === "Link") {
    return { children: "Link Component", href: "#" };
  }

  // Inputs
  if (componentName === "TextField") {
    return { label: "Text Field", placeholder: "Enter text...", defaultValue: "Sample text" };
  }
  if (componentName === "Select") {
    return { value: "option1", children: <option value="option1">Option 1</option> };
  }
  if (componentName === "Checkbox") {
    return { defaultChecked: true };
  }
  if (componentName === "Switch") {
    return { defaultChecked: true };
  }
  if (componentName === "Radio") {
    return { defaultChecked: true };
  }
  if (componentName === "Slider") {
    return { defaultValue: 50 };
  }

  // Feedback
  if (componentName === "Alert") {
    return { children: "This is an alert message", severity: "info" };
  }
  if (componentName === "CircularProgress") {
    return {};
  }
  if (componentName === "LinearProgress") {
    return {};
  }
  if (componentName === "Skeleton") {
    return { variant: "rectangular", width: 210, height: 118 };
  }

  // Surfaces
  if (componentName === "Accordion") {
    return { 
      children: (
        <>
          <MuiMaterial.AccordionSummary>
            <Typography>Accordion Summary</Typography>
          </MuiMaterial.AccordionSummary>
          <MuiMaterial.AccordionDetails>
            <Typography>Accordion details content goes here.</Typography>
          </MuiMaterial.AccordionDetails>
        </>
      )
    };
  }

  // Data Display
  if (componentName === "Chip") {
    return { label: "Chip" };
  }
  if (componentName === "Badge") {
    return { badgeContent: 4, children: <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main' }} /> };
  }
  if (componentName === "Avatar") {
    return { children: "JD" };
  }
  if (componentName === "Card") {
    return { children: <Box sx={{ p: 2 }}>Card Content</Box>, sx: { maxWidth: 345 } };
  }
  if (componentName === "Paper") {
    return { children: <Box sx={{ p: 2 }}>Paper Content</Box>, elevation: 3, sx: { width: 200 } };
  }
  if (componentName === "Divider") {
    return {};
  }
  if (componentName === "List") {
    return { children: "List Items Here" };
  }
  if (componentName === "Table") {
    return { children: <tbody><tr><td>Table Cell</td></tr></tbody> };
  }
  if (componentName === "Tooltip") {
    return { title: "Tooltip text", children: <span>Hover me</span> };
  }

  // Layout
  if (componentName === "Container") {
    return { children: "Container Content", maxWidth: "sm" };
  }
  if (componentName === "Grid") {
    return { container: true, spacing: 2, children: "Grid Content" };
  }
  if (componentName === "Stack") {
    return { spacing: 2, children: <><div>Item 1</div><div>Item 2</div></> };
  }
  if (componentName === "Box") {
    return { children: "Box Content", sx: { p: 2, border: '1px dashed grey' } };
  }

  // Navigation
  if (componentName === "Tabs") {
    return { value: 0, children: "Tabs require Tab children" };
  }
  if (componentName === "Breadcrumbs") {
    return { children: <><span>Home</span><span>Category</span><span>Current</span></> };
  }
  if (componentName === "Drawer") {
    return { open: true, variant: "permanent", children: <Box sx={{ width: 250, p: 2 }}>Drawer Content</Box> };
  }
  if (componentName === "AppBar") {
    return { children: <Box sx={{ p: 2 }}>App Bar Content</Box>, position: "static" };
  }
  if (componentName === "Toolbar") {
    return { children: "Toolbar Content" };
  }

  // Default fallback
  return { children: `${componentName} Component` };
};

/**
 * Props for the MuiComponentPreview wrapper
 */
type MuiComponentPreviewProps = {
  componentName: string;
};

/**
 * Wrapper component that renders a MUI component with sensible default props
 * for preview purposes. This allows raw MUI components to be displayed in the
 * canvas without needing to manually configure props for each one.
 */
export default function MuiComponentPreview({ componentName }: MuiComponentPreviewProps) {
  const MuiComponent = (MuiMaterial as unknown as Record<string, ComponentType<Record<string, unknown>>>)[
    componentName
  ];

  if (!MuiComponent) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Component not found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The component "{componentName}" could not be loaded from @mui/material.
        </Typography>
      </Container>
    );
  }

  const defaultProps = getDefaultProps(componentName);

  // Try to render the component, catch any errors
  let componentRender;
  try {
    componentRender = <MuiComponent {...defaultProps} />;
  } catch (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error rendering {componentName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          This component may require specific parent components or props to render correctly.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {componentName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Preview of the MUI {componentName} component
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          p: 3,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.default",
        }}
      >
        {componentRender}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          This is a preview with default props. In a real application, you would customize these props.
        </Typography>
      </Box>
    </Container>
  );
}

