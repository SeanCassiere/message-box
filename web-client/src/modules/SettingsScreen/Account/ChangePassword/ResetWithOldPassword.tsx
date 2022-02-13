import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";

import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";

const validationSchema = yup.object().shape({
  password: yup.string().required("Your new password is required"),
  newPassword: yup.string().required("Your new password is required"),
  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm your new password"),
});

const ResetWithOldPassword = () => {
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    validationSchema,
    initialValues: {
      password: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
    onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
      const payload = { password: values.password, newPassword: values.newPassword };

      client
        .post("/Users/Profile/ChangePassword", payload)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(MESSAGES.PASSWORD_CHANGED, { variant: "success" });

            resetForm();
          } else if (res.status === 403 || res.status === 400) {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(res.data.errors));
          } else {
            enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
          }
        })
        .catch(() => {
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <Box sx={{ mt: 2, pt: 2, pb: 0 }}>
      <Grid container spacing={2} component="form" onSubmit={formik.handleSubmit}>
        <Grid item xs={12} md={12}>
          <TextField
            // margin="normal"
            label="Old password"
            id="oldPassword-reset-password"
            type="password"
            name="password"
            autoComplete="off"
            InputLabelProps={{ disableAnimation: false }}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            // margin="normal"
            label="New password"
            id="oldPassword-reset-newPassword"
            type="password"
            name="newPassword"
            autoComplete="off"
            InputLabelProps={{ disableAnimation: false }}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            // margin="normal"
            label="Confirm new password"
            id="oldPassword-reset-newPasswordConfirmation"
            type="password"
            name="newPasswordConfirmation"
            autoComplete="off"
            InputLabelProps={{ disableAnimation: false }}
            value={formik.values.newPasswordConfirmation}
            onChange={formik.handleChange}
            error={formik.touched.newPasswordConfirmation && Boolean(formik.errors.newPasswordConfirmation)}
            helperText={formik.touched.newPasswordConfirmation && formik.errors.newPasswordConfirmation}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <LoadingButton type="submit" size="large" variant="contained" fullWidth loading={formik.isSubmitting}>
            CHANGE PASSWORD
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResetWithOldPassword;
