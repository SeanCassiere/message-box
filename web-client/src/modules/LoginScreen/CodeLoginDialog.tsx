import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FormikContextType } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IProps {
  formik: FormikContextType<{ code: string }>;
  handleClose: () => void;
  showDialog: boolean;
}

const CodeLoginDialog = (props: IProps) => {
  const { formik, handleClose, showDialog } = props;
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullScreen={isOnMobile}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your two-factor authentication code.</DialogContentText>
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
          <Link to="/forgot-password" variant="body2" component={RouterLink}>
            I no longer have access to my 2FA code
          </Link>
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleClose} color="error">
            Cancel
          </LoadingButton>
          <LoadingButton type="submit" loading={formik.isSubmitting}>
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CodeLoginDialog;
