import React from "react";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import {
  ButtonGroup,
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@mui/material";
import { FieldNumberInput } from "../../../../lib/mui-treasury/field-number-input";
import fontWeights from "./weights";

export type FontWeightSelectInputProps = {
  value: string;
  title: string;
};

export default function FontWeightSelectInput(
  props: FontWeightSelectInputProps
) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [menuOpened, setMenuOpened] = React.useState(false);
  const [selectedWeight, setSelectedWeight] = React.useState(props);

  const handleMenuItemClick = (item: typeof props) => {
    setSelectedWeight(item);
    setMenuOpened(false);
  };

  const handleToggle = () => {
    setMenuOpened((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setMenuOpened(false);
  };

  const handleInputChange = (value?: number) => {
    if (!value) return;

    if (`${value}`.length >= 3) {
      return;
    }

    setSelectedWeight((prev) => {
      return {
        ...prev,
        key: value.toString(),
        title: value.toString(),
      };
    });
  };

  return (
    <React.Fragment>
      <ButtonGroup color="inherit" variant="outlined">
        <FieldNumberInput
          value={parseInt(selectedWeight.title)}
          onChange={handleInputChange}
          size="small"
          step={100}
          sx={{
            fontSize: 12,

            "& .MuiOutlinedInput-notchedOutline": {
              borderTop: "none",
              borderInline: "none",
              borderRadius: 0,
            },
          }}
          slotProps={{
            input: {
              sx: {
                width: "4ch",
              },
            },
          }}
        />

        <IconButton
          ref={anchorRef}
          size="small"
          color={menuOpened ? "primary" : "default"}
          aria-controls={menuOpened ? "split-button-menu" : undefined}
          aria-expanded={menuOpened ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownOutlined />
        </IconButton>
      </ButtonGroup>

      <Popper
        open={menuOpened}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        placement="left-end"
        sx={{ zIndex: 1, top: "-100% !important" }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper
              sx={{
                minWidth: 65,
                border: 1,
                borderColor: "divider",
                borderRadius: 6,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  {fontWeights.map((option) => {
                    return (
                      <MenuItem
                        key={option.initValue.value}
                        onClick={() => handleMenuItemClick(option.initValue)}
                        sx={{ justifyContent: "center" }}
                      >
                        {option.initValue.title}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
