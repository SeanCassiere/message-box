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

const RegistrationSuccessDialog = (props: IProps) => {
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
        <DialogHeaderClose title="Confirm your account" />
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ pt: 3 }}>
            Your account has been created. Please check your email to confirm your account.
          </DialogContentText>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText="OK, WILL DO" onSubmit={handleOkClick} />
      </Dialog>
    </>
  );
};

export default RegistrationSuccessDialog;
