import React, { useCallback, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FormikContextType } from "formik";
import { useSnackbar } from "notistack";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";
import { client } from "../../shared/api/client";
import { MESSAGES } from "../../shared/util/messages";

interface IProps {
  formik: FormikContextType<{ code: string }>;
  handleClose: () => void;
  showDialog: boolean;
  handleClickRequest2faReset: () => void;
  userId: string | null;
}

const CodeLoginDialog = (props: IProps) => {
  const { formik, handleClose, showDialog } = props;
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();

  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  const handleSendPasswordlessPin = useCallback(() => {
    setIsLoadingRequest(true);
    client
      .post("/Authentication/Login/Passwordless", { method: "email", userId: props.userId })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            enqueueSnackbar("Success: One-Time PIN has been sent", { variant: "success" });
          } else {
            enqueueSnackbar("Error: Could not send the PIN", { variant: "error" });
          }
        }

        if (res.status === 400) {
          enqueueSnackbar("Warning: Some details were missing, could not send the PIN", { variant: "warning" });
        }
      })
      .catch((e) => {
        console.log("Send passwordless pin error", e);
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      })
      .finally(() => {
        setIsLoadingRequest(false);
      });
  }, [enqueueSnackbar, props.userId]);

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullScreen={isOnMobile}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title="Two-Factor Authentication" onClose={handleClose} startIconMode="phone-icon" />
        <DialogContent>
          <DialogContentText sx={{ mt: 2 }}>Enter your two-factor authentication code.</DialogContentText>
          <TextField
            margin="normal"
            fullWidth
            label="Code"
            id="code"
            name="code"
            autoComplete="off"
            variant="standard"
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            disabled={formik.isSubmitting || isLoadingRequest}
            autoFocus
            required
          />
          <Link
            variant="body2"
            sx={{ cursor: "pointer", textDecoration: "none" }}
            onClick={props.handleClickRequest2faReset}
          >
            I no longer have access to my authenticator app.
          </Link>
          <br />
          <Link variant="body2" sx={{ cursor: "pointer", textDecoration: "none" }} onClick={handleSendPasswordlessPin}>
            Send a temporary pin via email.
          </Link>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText="SUBMIT" isLoading={formik.isSubmitting || isLoadingRequest} />
      </Box>
    </Dialog>
  );
};

export default CodeLoginDialog;
