import React, { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import UserCredentialsForm from "./UserCredentialsForm";
import CodeLoginDialog from "./CodeLoginDialog";
import AddQrDialog from "./AddQrDialog";
import Alert from "./Alert";

import { client } from "../../shared/api/client";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";
import { setAccessToken } from "../../shared/redux/slices/auth/authSlice";
import { selectAuthState } from "../../shared/redux/store";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

const credentialsLoginSchema = yup.object().shape({
	email: yup.string().email("Please enter a valid email").required("Username is required"),
	password: yup.string().required("Password is required"),
});

const codeLoginSchema = yup.object().shape({
	code: yup.string().required("Code is required"),
});

interface TwoFactorSecretPair {
	base32: string;
	otpauth_url: string;
}

const LoginScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { isLoggedIn, access_token } = useSelector(selectAuthState);

	useEffect(() => {
		// redirect workflow
		if (isLoggedIn && access_token) {
			const tempLocation = location.state as { from: { pathname: string } };
			if (location.state && tempLocation.from.pathname) {
				return navigate(tempLocation.from.pathname);
			}
			return navigate("/chat");
		}
	}, [access_token, isLoggedIn, location, navigate]);

	const [userId, setUserId] = useState<string | null>(null);

	const [showLogin2fa, setShowLogin2fa] = useState(false); // toggle the 2fa login paddle
	const [showGenerateQR, setShowGenerateQR] = useState(false); // toggle the generate 2fa QA paddle
	const [showSnackbar, setShowSnackbar] = useState(false); // used to toggle the snackbar (toast)
	const [showForgotPassword, setShowForgotPassword] = useState(false); // used to toggle the forgot-password dialog
	const [showRequestConfirmation, setShowRequestConfirmation] = useState(false); // show the link to request the confirmation email again

	const [newQrData, setNewQrData] = useState<TwoFactorSecretPair | null>(null); // generate QR code from this data

	// using user credentials to obtain path for next step
	const formikCredentialsLogin = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: credentialsLoginSchema,
		onSubmit: (values, { setSubmitting, setErrors }) => {
			setShowRequestConfirmation(false);
			client
				.post("/Authentication/Login", values)
				.then((res) => {
					if (res.status === 400) {
						const notConfirmedMsg = "Email is not confirmed";
						const formattedErrors = formatErrorsToFormik(res.data.errors);
						if (formattedErrors?.email.toLowerCase() === notConfirmedMsg.toLowerCase()) {
							setShowRequestConfirmation(true);
						}
						setErrors(formattedErrors);
					}
					if (res.status === 200) {
						setUserId(res.data.userId);
						if (res.data.twoFactorAuthenticationCodeCreator) {
							setNewQrData(res.data.twoFactorAuthenticationCodeCreator);
							setShowGenerateQR(true);
						} else {
							setShowLogin2fa(true);
						}
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
	});

	// using the 2fa challenge code to get the access token
	const formik2faCodeLogin = useFormik({
		initialValues: {
			code: "",
		},
		validationSchema: codeLoginSchema,
		onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
			client
				.post("/Authentication/2FA/Code/Login", { userId: userId, code: values.code })
				.then((res) => {
					if (res.status === 400) {
						const formattedErrors = formatErrorsToFormik(res.data.errors);
						setErrors(formattedErrors);
					}
					if (res.status === 200) {
						setUserId(null);
						setShowLogin2fa(false);
						formikCredentialsLogin.resetForm();
						resetForm();
						dispatch(setAccessToken({ accessToken: res.data.access_token }));
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
	});

	// using the 2fa challenge code to get the access token
	const formikVerify2fa = useFormik({
		initialValues: {
			code: "",
		},
		validationSchema: codeLoginSchema,
		onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
			client
				.post("/Authentication/2FA/Code/ConfirmUser", { userId: userId, code: values.code })
				.then((res) => {
					if (res.status === 400) {
						setErrors(formatErrorsToFormik(res.data.errors));
					}
					if (res.status === 200) {
						resetForm();
						setNewQrData(null);
						setShowGenerateQR(false);
						setShowSnackbar(true);
						setShowLogin2fa(true);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
	});

	// handle closing of the 2fa code login dialog
	const handleClose2faDialog = useCallback(() => {
		formikCredentialsLogin.resetForm();
		setUserId(null);
		setShowLogin2fa(false);
	}, [formikCredentialsLogin]);

	// handle closing of the verify account 2fa dialog
	const handleCloseQrConfirmDialog = useCallback(() => {
		formikVerify2fa.resetForm();
		setUserId(null);
		setShowGenerateQR(false);
	}, [formikVerify2fa]);

	// handle closing of the generate 2fa QR alert
	const handleCloseSuccessAlert = (_?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		setShowSnackbar(false);
	};

	// handle closing of the forgot password dialog
	const handleCloseForgotPasswordDialog = useCallback(() => {
		setShowForgotPassword(false);
	}, []);

	const handleShowForgotPasswordDialog = useCallback(() => {
		setShowForgotPassword(true);
	}, []);

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSuccessAlert}
			>
				<Alert onClose={handleCloseSuccessAlert} severity='success' sx={{ width: "100%" }}>
					Your account now has two-factor authentication configured
				</Alert>
			</Snackbar>
			<AddQrDialog
				formik={formikVerify2fa}
				showDialog={showGenerateQR}
				handleClose={handleCloseQrConfirmDialog}
				secret={newQrData}
			/>
			<ForgotPasswordDialog open={showForgotPassword} handleDismiss={handleCloseForgotPasswordDialog} />
			<CodeLoginDialog formik={formik2faCodeLogin} showDialog={showLogin2fa} handleClose={handleClose2faDialog} />
			<Grid container component='main' sx={{ height: "100vh" }}>
				<Grid
					item
					xs={false}
					sm={4}
					md={8}
					sx={{
						backgroundImage:
							"url(https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2338&q=80)",
						backgroundRepeat: "no-repeat",
						backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component='h1' variant='h5'>
							Sign in
						</Typography>
						<UserCredentialsForm
							formik={formikCredentialsLogin}
							forgotPasswordTrigger={handleShowForgotPasswordDialog}
							isShowingConfirmationRetryLink={showRequestConfirmation}
						/>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};
export default LoginScreen;
