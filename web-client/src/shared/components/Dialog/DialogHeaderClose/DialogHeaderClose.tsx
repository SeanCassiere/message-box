import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

interface Props {
  title: string;
  onClose?: () => void;
}

const TEXT_COLOR = "whitesmoke";

const DialogHeaderClose = (props: Props) => {
  return (
    <DialogTitle sx={{ bgcolor: "primary.main", color: TEXT_COLOR }}>
      <Stack flexDirection="row">
        <Box flexGrow={1}>{props?.title}</Box>
        {props.onClose && (
          <>
            <IconButton aria-label="Close" onClick={props.onClose} size="small" onMouseDown={props.onClose}>
              <CloseIcon sx={{ fontSize: "1.5rem", color: TEXT_COLOR }} />
            </IconButton>
          </>
        )}
      </Stack>
    </DialogTitle>
  );
};

export default DialogHeaderClose;
