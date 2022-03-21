import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FormikContextType } from "formik";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

interface IProps {
  formik: FormikContextType<{ code: string }>;
  handleClose: () => void;
  showDialog: boolean;
  handleClickRequest2faReset: () => void;
}

const CodeLoginDialog = (props: IProps) => {
  const { formik, handleClose, showDialog } = props;
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullScreen={isOnMobile}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title="Two-Factor Authentication" onClose={handleClose} />
        <DialogContent>
          <DialogContentText sx={{ mt: 3 }}>Enter your two-factor authentication code.</DialogContentText>
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
            autoFocus
          />
          <Link
            variant="body2"
            sx={{ cursor: "pointer", textDecoration: "none" }}
            onClick={props.handleClickRequest2faReset}
          >
            I no longer have access to my authenticator app.
          </Link>
          <br />
          <Link
            variant="body2"
            sx={{ cursor: "pointer", textDecoration: "none" }}
            onClick={() => alert("functionality not implemented")}
          >
            Send a temporary pin via email.
          </Link>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText="SUBMIT" isLoading={formik.isSubmitting} />
      </Box>
    </Dialog>
  );
};

export default CodeLoginDialog;
