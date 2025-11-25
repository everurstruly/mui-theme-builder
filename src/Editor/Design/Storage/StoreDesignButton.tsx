import { SaveRounded } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useDesignStore } from "../Current/designStore";
import useDesignStorage from "./useDesignStorage";

export default function SaveDesignButton() {
  const isSaved = useDesignStore((state) => !state.hasUnsavedChanges);
  const title = useDesignStore((s) => s.title);
  const { saveCurrent } = useDesignStorage();
  const [open, setOpen] = useState(false);

  const handleSaveChanges = async () => {
    try {
      await saveCurrent({ title });
      setOpen(true);
    } catch (e) {
      void e;
      // swallow for now
    }
  };

  return (
    <>
      <Button
        value="save"
        aria-label="Save design"
        color="info"
        variant="outlined"
        disabled={isSaved}
        startIcon={<SaveRounded />}
        onClick={() => handleSaveChanges()}
      >
        {isSaved ? "Saved" : "Save"}
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Design saved to device"
      />
    </>
  );
}
