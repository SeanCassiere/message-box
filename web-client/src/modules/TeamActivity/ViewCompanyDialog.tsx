import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  onClose: () => void;
  showDialog: boolean;
}

const ViewCompanyDialog: React.FC<IProps> = (props) => {
  return (
    <Dialog open={props.showDialog} onClose={props.onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Stack flexDirection="row">
          <Box flexGrow={1}>All Employees</Box>
          <IconButton aria-label="Close" onClick={props.onClose} size="small" onMouseDown={props.onClose}>
            <CloseIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ mb: 1 }}>{props.children}</DialogContent>
    </Dialog>
  );
};

export default ViewCompanyDialog;
