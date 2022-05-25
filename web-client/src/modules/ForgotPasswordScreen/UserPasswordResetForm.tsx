import React, { useState } from "react";
import { FormikContextType } from "formik";
import { Link as RouterLink } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import FormTextField from "../../shared/components/Form/FormTextField";

interface IProps {
  formik: FormikContextType<{
    token: string;
    password: string;
    passwordConfirmation: string;
  }>;
}

const UserRegistrationForm = (props: IProps) => {
  const { formik } = props;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          pr: 1.6,
          pl: 1.6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 3, mt: 2.5 }}>
                <Chip label="Enter your new password" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
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
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                name="passwordConfirmation"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                id="passwordConfirmation"
                autoComplete="confirm-password"
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
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            loading={formik.isSubmitting}
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Change Password
          </LoadingButton>
          <Grid container justifyContent="center">
            <Grid item sx={{ mb: 3 }}>
              <Link to="/" variant="body2" component={RouterLink}>
                Nevermind, I just want to sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default UserRegistrationForm;
