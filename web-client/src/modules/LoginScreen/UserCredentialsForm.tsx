import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FormikContextType } from "formik";

import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

import Alert from "./Alert";
import { client } from "../../shared/api/client";

interface IProps {
	formik: FormikContextType<{ email: string; password: string }>;
	forgotPasswordTrigger: () => void;
	isShowingConfirmationRetryLink: boolean;
}

const UserCredentialsForm = (props: IProps) => {
	const { formik, forgotPasswordTrigger, isShowingConfirmationRetryLink } = props;
	const [showPassword, setShowPassword] = useState(false);
	const [showSnackbar, setShowSnackbar] = useState(false); // used to toggle the snackbar (toast)

	const handleClickShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	// handle closing of the confirmation email alert
	const handleCloseSuccessAlert = (_?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		setShowSnackbar(false);
	};

	const handleResendConfirmationEmail = async () => {
		try {
			setShowSnackbar(true);
			await client.post("/Users/ConfirmUser/ResendConfirmationEmail", { email: formik.values.email });
		} catch (error) {
			console.log(error);
			setShowSnackbar(false);
		}
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSuccessAlert}
			>
				<Alert onClose={handleCloseSuccessAlert} severity='success' sx={{ width: "100%" }}>
					A new confirmation link has been sent to your email
				</Alert>
			</Snackbar>
			<Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
				<TextField
					margin='normal'
					fullWidth
					label='Email Address'
					id='email'
					name='email'
					autoComplete='email'
					value={formik.values.email}
					onChange={formik.handleChange}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
					autoFocus
				/>
				<TextField
					margin='normal'
					fullWidth
					label='Password'
					name='password'
					type={showPassword ? "text" : "password"}
					id='password'
					autoComplete='current-password'
					value={formik.values.password}
					onChange={formik.handleChange}
					error={formik.touched.password && Boolean(formik.errors.password)}
					helperText={formik.touched.password && formik.errors.password}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
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
					<Box component='span'>
						<Link variant='body2' sx={{ cursor: "pointer" }} onClick={handleResendConfirmationEmail}>
							I did not receive the account confirmation email
						</Link>
					</Box>
				)}
				<LoadingButton
					type='submit'
					fullWidth
					variant='contained'
					sx={{ mt: 2, mb: 2, py: 1.2, fontSize: 15 }}
					loading={formik.isSubmitting}
				>
					Login
				</LoadingButton>
				<Grid container>
					<Grid item xs={12} sx={{ mt: 1, mb: 2, textAlign: "center" }}>
						<Link to='/sign-up' variant='body2' component={RouterLink}>
							{"Don't have an account? Sign Up"}
						</Link>
					</Grid>
					<Grid item xs={12} sx={{ mb: 3, textAlign: "center" }}>
						<Link
							variant='body2'
							sx={{ cursor: "pointer" }}
							onClick={(e) => {
								e.preventDefault();
								forgotPasswordTrigger();
							}}
						>
							Forgot your password?
						</Link>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default UserCredentialsForm;
