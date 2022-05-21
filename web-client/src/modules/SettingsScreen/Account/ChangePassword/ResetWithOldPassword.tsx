import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import TextField from "../../../../shared/components/Form/TextField";

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

interface IProps {
  onSubmit?: () => void;
}

const ResetWithOldPassword = (props: IProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = (cb: (cbFn: any) => any) => {
    cb((prev: boolean) => !prev);
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
          if (props?.onSubmit) {
            props?.onSubmit();
          }
        });
    },
  });

  return (
    <Box sx={{ mt: 2, pt: 2, pb: 0 }}>
      <Grid container spacing={2} component="form" onSubmit={formik.handleSubmit}>
        <Grid item xs={12} md={12}>
          <TextField
            label="Old password"
            id="oldPassword-reset-password"
            type={showOldPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(setShowOldPassword)}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="New password"
            id="oldPassword-reset-newPassword"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(setShowNewPassword)}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Confirm new password"
            id="oldPassword-reset-newPasswordConfirmation"
            type={showConfirmPassword ? "text" : "password"}
            name="newPasswordConfirmation"
            value={formik.values.newPasswordConfirmation}
            onChange={formik.handleChange}
            error={formik.touched.newPasswordConfirmation && Boolean(formik.errors.newPasswordConfirmation)}
            helperText={formik.touched.newPasswordConfirmation && formik.errors.newPasswordConfirmation}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(setShowConfirmPassword)}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
