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

import FormTextField from "../../../../shared/components/Form/FormTextField";

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

interface IProps {
  onSubmit?: () => void;
}

const ResetWith2FA = (props: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const applicationProfile = useSelector(selectUserState);

  const [showPassword, setShowPassword] = useState(false);
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
      email: applicationProfile.userProfile?.email ?? "",
      password: "",
      passwordConfirmation: "",
      code: "",
    },
    onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
      setShowConfirmPassword(false);
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
          if (props?.onSubmit) {
            props?.onSubmit();
          }
        });
    },
  });

  return (
    <Box sx={{ mt: 2, pt: 2, pb: 0 }}>
      <Grid container spacing={2} component="form" onSubmit={formik.handleSubmit}>
        <Grid item xs={12} md={6}>
          <FormTextField
            label="New password"
            id="2fa-reset-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            asteriskRequired
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(setShowPassword)}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormTextField
            label="Confirm new password"
            id="2fa-reset-passwordConfirmation"
            type={showConfirmPassword ? "text" : "password"}
            name="passwordConfirmation"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
            asteriskRequired
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
          <FormTextField
            label="Two factor code"
            id="2fa-reset-code"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            asteriskRequired
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <LoadingButton
            type="submit"
            size="large"
            variant="contained"
            fullWidth
            loading={formik.isSubmitting}
            disableElevation={false}
          >
            CHANGE PASSWORD
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResetWith2FA;
