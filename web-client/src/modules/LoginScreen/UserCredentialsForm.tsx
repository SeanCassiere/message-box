import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FormikContextType } from "formik";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import Collapse from "@mui/material/Collapse";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

import FormTextField from "../../shared/components/Form/FormTextField";

import { client } from "../../shared/api/client";
import { MESSAGES } from "../../shared/util/messages";

interface IProps {
  formik: FormikContextType<{ email: string; password: string }>;
  forgotPasswordTrigger: () => void;
  isShowingConfirmationRetryLink: boolean;
  showFullForm: boolean;
}

const UserCredentialsForm = (props: IProps) => {
  const { formik, forgotPasswordTrigger, isShowingConfirmationRetryLink } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleResendConfirmationEmail = async () => {
    const currentHost = window.location.protocol + "//" + window.location.host;
    const confirmationPath = "/confirm-account/";
    try {
      await client.post("/Users/ConfirmUser/ResendConfirmationEmail", {
        email: formik.values.email,
        host: currentHost,
        path: confirmationPath,
      });
      enqueueSnackbar("Success: Confirmation link sent to your email.", { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: "100%" }}>
        <FormTextField
          margin="normal"
          fullWidth
          label="Email Address"
          id="email"
          name="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          autoFocus
        />
        <Collapse in={props.showFullForm}>
          <>
            <FormTextField
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {isShowingConfirmationRetryLink && (
              <Box component="span">
                <Link variant="body2" sx={{ cursor: "pointer" }} onClick={handleResendConfirmationEmail}>
                  I did not receive the account confirmation email
                </Link>
              </Box>
            )}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, py: 1.2, fontSize: 15 }}
              loading={formik.isSubmitting}
            >
              Login
            </LoadingButton>
          </>
        </Collapse>

        <Grid container>
          <Grid item xs={12} sx={{ mt: 1, mb: 2, textAlign: "center" }}>
            <Link to="/sign-up" variant="body2" component={RouterLink}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
          <Grid item xs={12} sx={{ mb: 3, textAlign: "center", width: "100%" }}>
            <Collapse in={props.showFullForm}>
              <Link
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  forgotPasswordTrigger();
                }}
              >
                Forgot your password?
              </Link>
            </Collapse>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UserCredentialsForm;
