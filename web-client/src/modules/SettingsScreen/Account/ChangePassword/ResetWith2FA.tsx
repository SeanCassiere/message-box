import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import LoadingButton from "@mui/lab/LoadingButton";

import TextField from "../../../../shared/components/Form/TextField";
import { useSelector } from "react-redux";
import { selectUserState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";

const validationSchema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Your new password is required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your new password"),
  code: yup.string().required("2FA Code is required"),
});

const ResetWith2FA = () => {
  const { enqueueSnackbar } = useSnackbar();
  const applicationProfile = useSelector(selectUserState);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      email: applicationProfile.userProfile?.email ?? "",
      password: "",
      passwordConfirmation: "",
      code: "",
    },
    onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
      const payload = { email: values.email, password: values.password, code: values.code };

      client
        .post("/Users/ResetPassword/With2FA", payload)
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
            label="Two factor code"
            id="2fa-reset-code"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="New password"
            id="2fa-reset-password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Confirm new password"
            id="2fa-reset-passwordConfirmation"
            type="password"
            name="passwordConfirmation"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
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

export default ResetWith2FA;
