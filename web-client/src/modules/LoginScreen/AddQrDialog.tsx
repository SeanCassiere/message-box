import React from "react";
import { FormikContextType } from "formik";
import QRCode from "qrcode.react";

import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface TwoFactorSecretPair {
  base32: string;
  otpauth_url: string;
}

interface IProps {
  formik: FormikContextType<{ code: string }>;
  handleClose: () => void;
  showDialog: boolean;
  secret: TwoFactorSecretPair | null;
}

const AddQrDialog = (props: IProps) => {
  const { formik, handleClose, showDialog, secret } = props;
  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Set up two-factor authentication.</DialogTitle>
        <DialogContent>
          <DialogContentText>This account does not have two-factor authentication configured.</DialogContentText>
          <DialogContentText sx={{ mt: 3, textAlign: "center" }}>
            {secret && <QRCode value={secret?.otpauth_url} size={200} />}
          </DialogContentText>
          <DialogContentText sx={{ mt: 3 }}>
            Scan the QR code into your authenticator app, and enter the code below.
          </DialogContentText>
          <TextField
            margin="normal"
            fullWidth
            label="Code"
            id="code"
            name="code"
            type="text"
            autoComplete="off"
            variant="standard"
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleClose} color="error" sx={{ bgcolor: "initial" }}>
            Cancel
          </LoadingButton>
          <LoadingButton type="submit" color="primary" loading={formik.isSubmitting} sx={{ bgcolor: "initial" }}>
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddQrDialog;
