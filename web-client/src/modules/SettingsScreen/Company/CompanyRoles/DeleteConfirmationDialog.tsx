import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

interface IProps {
  handleClose: () => void;
  handleAccept: () => void;
  showDialog: boolean;
}

const DeleteConfirmationDialog = (props: IProps) => {
  const { handleClose, handleAccept, showDialog } = props;

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth>
      <DialogHeaderClose title="Delete user access role" onClose={handleClose} startIconMode="delete-icon" />
      <DialogContent>
        <DialogContentText sx={{ mt: 1 }}>
          This is a permanent deletion, are you sure you want to proceed and delete this user access role?
        </DialogContentText>
      </DialogContent>
      <DialogBigButtonFooter submitButtonText="YES, DELETE THIS USER ROLE" onSubmit={handleAccept} color="error" />
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
