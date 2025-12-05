import useTemplateSelection from "../../../Design/Draft/Template/useTemplateSelection";
import { IconButton, Tooltip } from "@mui/material";
import { CasinoOutlined } from "@mui/icons-material";

function RandomTemplateLoader() {
  const { randomSelect } = useTemplateSelection();

  function handleClick() {
    randomSelect();
  }
  return (
    <Tooltip title={"Load a Random Template"}>
      <IconButton
        onClick={handleClick}
        sx={[
          {
            transition: "opacity 300ms ease",
            textTransform: "none",
          },
        ]}
      >
        <CasinoOutlined />
      </IconButton>
    </Tooltip>
  );
}

export default RandomTemplateLoader;
