import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteDialog = (props: IProps) => {
  return (
    <React.Fragment>
      <Dialog open={props.open}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Box>
            <Typography>Please confirm that you want to delete this widget.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton color="secondary" sx={{ bgcolor: "inherit" }} onClick={props.onClose}>
            Cancel
          </LoadingButton>
          <LoadingButton type="button" color="error" sx={{ bgcolor: "inherit" }} onClick={props.onConfirm}>
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ConfirmDeleteDialog;
