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

import TextField from "../../shared/components/Form/TextField";

interface IProps {
  formik: FormikContextType<{
    clientName: string;
    firstName: string;
    lastName: string;
    email: string;
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 3 }}>
                <Chip label="Company Information" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="clientName"
                label="Company Name"
                name="clientName"
                autoComplete="off"
                autoFocus
                value={formik.values.clientName}
                onChange={formik.handleChange}
                error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                helperText={formik.touched.clientName && formik.errors.clientName}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ mb: 3, mt: 2.5 }}>
                <Chip label="User Information" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                name="firstName"
                id="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Last Name"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Email Address"
                id="email"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="passwordConfirmation"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                id="passwordConfirmation"
                autoComplete="confirm-password"
                value={formik.values.passwordConfirmation}
                onChange={formik.handleChange}
                error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
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
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2, fontSize: 15 }}
            fullWidth
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="center">
            <Grid item sx={{ mb: 3 }}>
              <Link to="/" variant="body2" component={RouterLink}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default UserRegistrationForm;
