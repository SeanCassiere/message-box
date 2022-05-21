import React from "react";
import QRCode from "qrcode.react";
import { FormikContextType } from "formik";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

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
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title="SET-UP TWO-FACTOR AUTHENTICATION" onClose={handleClose} startIconMode="qrcode-icon" />
        <DialogContent>
          <DialogContentText sx={{ mt: 1 }}>
            This account does not have two-factor authentication configured.
          </DialogContentText>
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
        <DialogBigButtonFooter submitButtonText="COMPLETE 2FA SETUP" isLoading={formik.isSubmitting} />
      </Box>
    </Dialog>
  );
};

export default AddQrDialog;
