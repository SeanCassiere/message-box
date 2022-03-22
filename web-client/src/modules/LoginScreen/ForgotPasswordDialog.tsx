import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";

import { red } from "@mui/material/colors";

import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";

import { client } from "../../shared/api/client";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";

interface Props {
  open: boolean;
  handleDismiss: () => void;
}

const validation2fa = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("A new password is required"),
  code: yup.string().required("2FA Code is required"),
});

const validationEmailReset = yup.object().shape({
  emailReset: yup.string().required("Email is required"),
});

const ForgotPasswordDialog = (props: Props) => {
  const { handleDismiss, open } = props;
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [expanded, setExpanded] = useState("panel1"); // controls which panel is expanded

  const handleChangeOpen = (key: string) => {
    setExpanded(key);
  };

  const formik2fa = useFormik({
    initialValues: {
      email: "",
      password: "",
      code: "",
    },
    validationSchema: validation2fa,
    onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
      client
        .post("/Users/ResetPassword/With2FA", values)
        .then((res) => {
          if (res.status === 400) {
            setErrors(formatErrorsToFormik(res.data.errors));
          }

          if (res.status === 200) {
            enqueueSnackbar("Success: Your password has been changed.", {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
            });
            resetForm();
          }
        })
        .catch((err) => {
          enqueueSnackbar("Error: Network unavailable.", {
            variant: "error",
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const formikEmailReset = useFormik({
    initialValues: {
      emailReset: "",
    },
    validationSchema: validationEmailReset,
    onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
      const formData = { email: values.emailReset };
      const currentHost = window.location.protocol + "//" + window.location.host;
      const confirmationPath = "/forgot-password/";
      client
        .post("/Users/ResetPassword/RequestEmail", { ...formData, host: currentHost, path: confirmationPath })
        .then((res) => {
          if (res.status === 400) {
            setErrors(formatErrorsToFormik(res.data.errors));
          }

          if (res.status === 200) {
            enqueueSnackbar("Success: Reset link has been sent to your email.", {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
            });
            resetForm();
          }
        })
        .catch((err) => {
          enqueueSnackbar("Error: Network unavailable.", {
            variant: "error",
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  // handles the closing of the main forgot-password dialog
  const closeDialog = () => {
    formik2fa.resetForm();
    formikEmailReset.resetForm();
    handleDismiss();
  };

  return (
    <>
      <Dialog open={open} onClose={handleDismiss} maxWidth="xs" disableEscapeKeyDown fullScreen={isOnMobile}>
        <DialogHeaderClose title="Reset password" onClose={closeDialog} />
        <DialogContent>
          <DialogContentText sx={{ mt: 3, mb: 2 }}>How do you want to reset your password?</DialogContentText>
          <Accordion
            elevation={0}
            expanded={expanded === "panel1"}
            onChange={() => handleChangeOpen("panel1")}
            disabled={formikEmailReset.isSubmitting}
          >
            <AccordionSummary
              expandIcon={
                expanded === "panel1" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ py: 0.3 }}>Using 2FA</Typography>
              <Typography
                color="white"
                sx={{
                  bgcolor: red[500],
                  px: 1,
                  ml: 1,
                  borderRadius: 5,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                recommended
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={formik2fa.handleSubmit}>
                <Typography sx={{ mb: 2 }}>Enter the two-factor code from your authenticator app.</Typography>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Email Address"
                  id="email"
                  name="email"
                  autoComplete="off"
                  variant="standard"
                  value={formik2fa.values.email}
                  onChange={formik2fa.handleChange}
                  error={formik2fa.touched.email && Boolean(formik2fa.errors.email)}
                  helperText={formik2fa.touched.email && formik2fa.errors.email}
                  autoFocus
                />
                <TextField
                  margin="dense"
                  fullWidth
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  variant="standard"
                  value={formik2fa.values.password}
                  onChange={formik2fa.handleChange}
                  error={formik2fa.touched.password && Boolean(formik2fa.errors.password)}
                  helperText={formik2fa.touched.password && formik2fa.errors.password}
                />
                <TextField
                  margin="dense"
                  fullWidth
                  label="Two-Factor Authentication Code"
                  id="code"
                  name="code"
                  autoComplete="off"
                  variant="standard"
                  value={formik2fa.values.code}
                  onChange={formik2fa.handleChange}
                  error={formik2fa.touched.code && Boolean(formik2fa.errors.code)}
                  helperText={formik2fa.touched.code && formik2fa.errors.code}
                />
                <LoadingButton
                  variant="contained"
                  loading={formik2fa.isSubmitting}
                  sx={{ mt: 2 }}
                  fullWidth
                  type="submit"
                >
                  Reset
                </LoadingButton>
              </form>
            </AccordionDetails>
          </Accordion>
          <Accordion
            elevation={0}
            expanded={expanded === "panel2"}
            onChange={() => handleChangeOpen("panel2")}
            disabled={formik2fa.isSubmitting}
          >
            <AccordionSummary
              expandIcon={
                expanded === "panel2" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
              }
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography sx={{ py: 0.3 }}>Using email</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={formikEmailReset.handleSubmit}>
                <Typography sx={{ mb: 2 }}>An email will be sent with a link to reset your password.</Typography>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Email Address"
                  id="emailReset"
                  name="emailReset"
                  autoComplete="email"
                  variant="standard"
                  value={formikEmailReset.values.emailReset}
                  onChange={formikEmailReset.handleChange}
                  error={formikEmailReset.touched.emailReset && Boolean(formikEmailReset.errors.emailReset)}
                  helperText={formikEmailReset.touched.emailReset && formikEmailReset.errors.emailReset}
                  autoFocus
                />
                <LoadingButton
                  variant="contained"
                  loading={formikEmailReset.isSubmitting}
                  sx={{ mt: 2 }}
                  fullWidth
                  type="submit"
                >
                  Send Email
                </LoadingButton>
              </form>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgotPasswordDialog;
