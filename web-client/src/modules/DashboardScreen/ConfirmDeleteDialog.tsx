import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteDialog = (props: IProps) => {
  return (
    <React.Fragment>
      <Dialog open={props.open}>
        <DialogHeaderClose title="Delete dashboard widget" onClose={props.onClose} startIconMode="delete-icon" />
        <DialogContent>
          <Box>
            <Typography>Please confirm that you want to delete this widget.</Typography>
          </Box>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText="DELETE" color="error" onSubmit={props.onConfirm} />
      </Dialog>
    </React.Fragment>
  );
};

export default ConfirmDeleteDialog;
