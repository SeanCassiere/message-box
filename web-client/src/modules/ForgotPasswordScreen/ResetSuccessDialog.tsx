import React from "react";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

interface IProps {
  open: boolean;
}

const ResetSuccessDialog = (props: IProps) => {
  const navigate = useNavigate();
  const { open } = props;

  const handleOkClick = () => {
    navigate("/");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => ({})}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">Password has been reset</DialogTitle> */}
        <DialogHeaderClose title="Password has been reset" />
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ pt: 3 }}>
            Your password has been successfully reset, please login with your new password.
          </DialogContentText>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText="GO TO THE LOGIN PAGE" onSubmit={handleOkClick} />
      </Dialog>
    </>
  );
};

export default ResetSuccessDialog;
